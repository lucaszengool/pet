const { Op } = require('sequelize');
const { Conversation, Message, Notification, User } = require('../models');
const { success, created, badRequest, notFound, paginate } = require('../utils/response');

// Get or create conversation
const getOrCreateConversation = async (user1Id, user2Id) => {
  const [minId, maxId] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
  let conv = await Conversation.findOne({
    where: { user1_id: minId, user2_id: maxId },
  });
  if (!conv) {
    conv = await Conversation.create({ user1_id: minId, user2_id: maxId });
  }
  return conv;
};

// List conversations
exports.listConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1_id: req.userId },
          { user2_id: req.userId },
        ],
      },
      order: [['last_message_at', 'DESC']],
    });

    // Enrich with user info
    const enriched = await Promise.all(conversations.map(async conv => {
      const otherId = conv.user1_id === req.userId ? conv.user2_id : conv.user1_id;
      const otherUser = await User.findByPk(otherId, { attributes: ['id', 'nickname', 'avatar', 'shop_name'] });
      const unread = conv.user1_id === req.userId ? conv.user1_unread : conv.user2_unread;
      return { ...conv.toJSON(), other_user: otherUser, unread };
    }));

    return success(res, enriched);
  } catch (err) { next(err); }
};

// Get messages in a conversation
exports.getMessages = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const { page = 1, pageSize = 50 } = req.query;

    const conv = await Conversation.findByPk(conversation_id);
    if (!conv) return notFound(res);
    if (conv.user1_id !== req.userId && conv.user2_id !== req.userId) {
      return require('../utils/response').forbidden(res);
    }

    // Mark as read
    if (conv.user1_id === req.userId) {
      await conv.update({ user1_unread: 0 });
    } else {
      await conv.update({ user2_unread: 0 });
    }

    // Mark messages as read
    await Message.update({ is_read: true }, {
      where: { conversation_id, receiver_id: req.userId, is_read: false },
    });

    const result = await Message.findAndCountAll({
      where: { conversation_id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'nickname', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

// Send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiver_id, type = 'text', content, extra } = req.body;
    if (!receiver_id || !content) return badRequest(res, '消息信息不完整');

    const conv = await getOrCreateConversation(req.userId, receiver_id);

    const message = await Message.create({
      conversation_id: conv.id,
      sender_id: req.userId,
      receiver_id,
      type, content,
      extra: extra || {},
    });

    // Update conversation
    const updateData = {
      last_message: type === 'text' ? content.slice(0, 100) : `[${type}]`,
      last_message_at: new Date(),
    };
    if (conv.user1_id === parseInt(receiver_id)) {
      updateData.user1_unread = conv.user1_unread + 1;
    } else {
      updateData.user2_unread = conv.user2_unread + 1;
    }
    await conv.update(updateData);

    // Emit via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${receiver_id}`).emit('new_message', {
        conversation_id: conv.id,
        message: { ...message.toJSON(), sender: { id: req.userId, nickname: req.user.nickname, avatar: req.user.avatar } },
      });
    }

    return created(res, message, '发送成功');
  } catch (err) { next(err); }
};

// Get notifications
exports.listNotifications = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 20, type } = req.query;
    const where = { user_id: req.userId };
    if (type) where.type = type;

    const result = await Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: (page - 1) * pageSize,
    });
    return paginate(res, { ...result, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) { next(err); }
};

// Mark notification as read
exports.readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.update({ is_read: true }, { where: { user_id: req.userId } });
    } else {
      await Notification.update({ is_read: true }, { where: { id, user_id: req.userId } });
    }
    return success(res, null, '已读');
  } catch (err) { next(err); }
};

// Unread count
exports.unreadCount = async (req, res, next) => {
  try {
    const msgCount = await Conversation.sum(
      req.userId === 1 ? 'user1_unread' : 'user2_unread', // simplified
      { where: { [Op.or]: [{ user1_id: req.userId }, { user2_id: req.userId }] } }
    ) || 0;

    const notiCount = await Notification.count({
      where: { user_id: req.userId, is_read: false },
    });

    return success(res, { message: msgCount, notification: notiCount, total: msgCount + notiCount });
  } catch (err) { next(err); }
};
