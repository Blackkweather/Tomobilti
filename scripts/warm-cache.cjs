#!/usr/bin/env node

/**
 * ShareWheelz Cache Warming Script
 * Pre-loads frequently accessed data into Redis cache
 */

const redisCache = require('../server/services/redisCache').default;

async function warmCache() {
  console.log('🔥 ShareWheelz Cache Warming');
  console.log('=============================
');

  try {
    // Warm cars cache
    await redisCache.warmCarsCache();
    
    // Warm users cache
    await redisCache.warmUsersCache();
    
    // Get cache stats
    const stats = await redisCache.getStats();
    console.log('\n📊 Cache Statistics:');
    console.log(`   Hits: ${stats.hits}`);
    console.log(`   Misses: ${stats.misses}`);
    console.log(`   Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`);
    console.log(`   Total Requests: ${stats.totalRequests}`);
    
    console.log('\n🎉 Cache warming completed successfully!');
    
  } catch (error) {
    console.error('❌ Cache warming failed:', error);
  } finally {
    await redisCache.disconnect();
  }
}

warmCache();