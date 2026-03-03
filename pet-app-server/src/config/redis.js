const config = require('./index');

let redis = null;

try {
  const Redis = require('ioredis');
  redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    retryStrategy: (times) => {
      if (times > 3) {
        console.log('Redis connection failed, running without cache');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redis.on('error', () => {
    // Silently degrade - app works without Redis
  });

  redis.connect().catch(() => {
    console.log('Redis not available, caching disabled');
    redis = null;
  });
} catch (e) {
  console.log('Redis not available, caching disabled');
}

// Cache helper with graceful degradation
const cache = {
  async get(key) {
    if (!redis) return null;
    try {
      const val = await redis.get(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  async set(key, value, ttl = 300) {
    if (!redis) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch { /* ignore */ }
  },
  async del(key) {
    if (!redis) return;
    try { await redis.del(key); } catch { /* ignore */ }
  },
  async delPattern(pattern) {
    if (!redis) return;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) await redis.del(...keys);
    } catch { /* ignore */ }
  },
};

module.exports = { redis, cache };
