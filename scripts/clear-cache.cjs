#!/usr/bin/env node

/**
 * ShareWheelz Cache Clear Script
 * Clears all cached data from Redis
 */

const redisCache = require('../server/services/redisCache').default;

async function clearCache() {
  console.log('🗑️ ShareWheelz Cache Clear');
  console.log('===========================
');

  try {
    console.log('Clearing all cache...');
    await redisCache.flush();
    
    console.log('✅ All cache cleared successfully!');
    
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
  } finally {
    await redisCache.disconnect();
  }
}

clearCache();