#!/usr/bin/env node

/**
 * ShareWheelz Cache Statistics Script
 * Shows detailed cache performance metrics
 */

const redisCache = require('../server/services/redisCache').default;

async function showCacheStats() {
  console.log('📊 ShareWheelz Cache Statistics');
  console.log('================================
');

  try {
    // Get cache stats
    const stats = await redisCache.getStats();
    console.log('📈 Performance Metrics:');
    console.log(`   Cache Hits: ${stats.hits}`);
    console.log(`   Cache Misses: ${stats.misses}`);
    console.log(`   Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`);
    console.log(`   Total Requests: ${stats.totalRequests}`);
    
    // Get Redis info
    const redisInfo = await redisCache.getRedisInfo();
    if (redisInfo) {
      console.log('\n🔴 Redis Information:');
      console.log(`   Version: ${redisInfo.redis_version}`);
      console.log(`   Uptime: ${redisInfo.uptime_in_seconds} seconds`);
      console.log(`   Connected Clients: ${redisInfo.connected_clients}`);
      console.log(`   Used Memory: ${redisInfo.used_memory_human}`);
      console.log(`   Total Commands: ${redisInfo.total_commands_processed}`);
    }
    
    // Health check
    const health = await redisCache.healthCheck();
    console.log('\n🏥 Health Status:');
    console.log(`   Status: ${health.status}`);
    
  } catch (error) {
    console.error('❌ Failed to get cache stats:', error);
  } finally {
    await redisCache.disconnect();
  }
}

showCacheStats();