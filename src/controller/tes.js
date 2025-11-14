import { redisClient } from '../config/redis.js';
import { db } from '../config/db.js';

export const testConnection = async (req, res) => {
  try {
    await redisClient.set('last_check', new Date().toISOString());
    const cache = await redisClient.get('last_check');
    const result = await db.query('SELECT NOW()');
    const currentTime = result.rows[0].now;

    res.json({
      redis_cached_time: cache,
      db_current_time: currentTime
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
