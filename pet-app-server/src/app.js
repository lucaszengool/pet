const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { Server } = require('socket.io');

const config = require('./config');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { verifyToken } = require('./utils/jwt');

const app = express();
const server = http.createServer(app);

// ==================== Socket.IO ====================
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
    }
    next();
  } catch {
    next();
  }
});

io.on('connection', (socket) => {
  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
    console.log(`[Socket] User ${socket.userId} connected`);
  }

  socket.on('join_conversation', (conversationId) => {
    socket.join(`conv_${conversationId}`);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conv_${conversationId}`);
  });

  socket.on('typing', (data) => {
    socket.to(`conv_${data.conversation_id}`).emit('user_typing', {
      user_id: socket.userId,
      conversation_id: data.conversation_id,
    });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      console.log(`[Socket] User ${socket.userId} disconnected`);
    }
  });
});

app.set('io', io);

// ==================== Middleware ====================
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { code: 429, message: '请求过于频繁，请稍后再试', data: null },
});
app.use(config.apiPrefix, limiter);

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ==================== Routes ====================
app.use(config.apiPrefix, routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), env: config.env });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: '宠我吧 API',
    version: '1.0.0',
    description: '一站式宠物综合服务平台 RESTful API',
    base_url: config.apiPrefix,
    endpoints: {
      auth: {
        'POST /auth/register': '用户注册',
        'POST /auth/login': '用户登录',
        'GET /auth/profile': '获取个人信息',
        'PUT /auth/profile': '更新个人信息',
        'PUT /auth/password': '修改密码',
        'POST /auth/sign-in': '每日签到',
        'POST /auth/apply-merchant': '申请成为商家',
      },
      categories: {
        'GET /categories': '获取分类列表',
        'POST /categories': '创建分类(admin)',
      },
      pets: {
        'GET /pets': '宠物列表(支持筛选/排序/分页)',
        'GET /pets/:id': '宠物详情',
        'POST /pets': '发布宠物',
        'PUT /pets/:id': '更新宠物',
        'DELETE /pets/:id': '删除宠物',
      },
      services: {
        'GET /services': '服务列表',
        'GET /services/:id': '服务详情',
        'POST /services': '发布服务',
        'PUT /services/:id': '更新服务',
        'DELETE /services/:id': '删除服务',
      },
      products: {
        'GET /products': '商品列表',
        'GET /products/:id': '商品详情',
        'POST /products': '发布商品',
        'PUT /products/:id': '更新商品',
        'DELETE /products/:id': '删除商品',
      },
      orders: {
        'GET /orders': '订单列表',
        'POST /orders': '创建订单',
        'POST /orders/:id/pay': '支付订单',
        'POST /orders/:id/accept': '商家接单',
        'POST /orders/:id/serve': '开始服务',
        'POST /orders/:id/complete': '完成订单',
        'POST /orders/:id/cancel': '取消订单',
        'POST /orders/:id/refund': '申请退款',
      },
      reviews: {
        'GET /reviews/:target_type/:target_id': '获取评价列表',
        'POST /reviews': '创建评价',
        'POST /reviews/:id/reply': '商家回复评价',
      },
      messages: {
        'GET /messages/conversations': '会话列表',
        'GET /messages/conversations/:id': '消息记录',
        'POST /messages/send': '发送消息',
        'GET /messages/unread': '未读数',
      },
      favorites: {
        'POST /favorites/toggle': '收藏/取消收藏',
        'GET /favorites': '收藏列表',
      },
      cart: {
        'GET /cart': '购物车',
        'POST /cart': '加入购物车',
        'PUT /cart/:id': '更新购物车',
        'DELETE /cart/:id': '移除',
      },
      search: {
        'GET /search': '搜索(keyword,type,sort)',
        'GET /search/hot': '热门搜索',
      },
      upload: {
        'POST /upload/:type': '上传图片(最多9张)',
        'POST /upload/avatar': '上传头像',
      },
    },
  });
});

// Serve frontend static files in production
if (config.env === 'production') {
  const frontendPath = path.join(__dirname, '..', 'public');
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith(config.apiPrefix) || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在', data: null });
});

// Error handler
app.use(errorHandler);

// ==================== Start Server ====================
const start = async () => {
  try {
    // Sync database
    await sequelize.sync();
    console.log('[DB] Database synced successfully');

    // Start server
    server.listen(config.port, () => {
      console.log(`\n========================================`);
      console.log(`  宠我吧 API Server`);
      console.log(`  Environment: ${config.env}`);
      console.log(`  Port: ${config.port}`);
      console.log(`  API: http://localhost:${config.port}${config.apiPrefix}`);
      console.log(`  Docs: http://localhost:${config.port}/api`);
      console.log(`  Health: http://localhost:${config.port}/health`);
      console.log(`  WebSocket: ws://localhost:${config.port}`);
      console.log(`========================================\n`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
};

start();

module.exports = app;
