#!/usr/bin/env node

/**
 * Render MCP Integration Script
 * Uses your Render API key to manage ShareWheelz deployment
 */

const https = require('https');

class RenderMCP {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.render.com/v1';
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.render.com',
        port: 443,
        path: `/v1${endpoint}`,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Get all services
  async getServices() {
    console.log('🔍 Fetching all services...');
    const result = await this.makeRequest('/services');
    
    if (result.status === 200) {
      console.log('✅ Services found:');
      
      // Handle Render API response format
      const services = result.data.map(item => item.service);
      
      services.forEach(service => {
        console.log(`  📦 ${service.name}`);
        console.log(`     Type: ${service.type}`);
        console.log(`     Status: ${service.serviceDetails?.envSpecificDetails?.buildCommand ? 'Configured' : 'Not configured'}`);
        console.log(`     URL: ${service.serviceDetails?.url || 'Not deployed'}`);
        console.log(`     ID: ${service.id}`);
        console.log('');
      });
      return services;
    } else {
      console.log('❌ Failed to fetch services:', result.data);
      return [];
    }
  }

  // Get specific service details
  async getServiceDetails(serviceName) {
    console.log(`🔍 Getting details for service: ${serviceName}`);
    
    // First get all services to find the service ID
    const services = await this.getServices();
    const service = services.find(s => s.name === serviceName);
    
    if (!service) {
      console.log(`❌ Service '${serviceName}' not found`);
      return null;
    }

    const result = await this.makeRequest(`/services/${service.id}`);
    
    if (result.status === 200) {
      const serviceData = result.data;
      console.log('✅ Service details:');
      console.log(`  📦 Name: ${serviceData.name}`);
      console.log(`  🏷️ Type: ${serviceData.type}`);
      console.log(`  🌐 URL: ${serviceData.serviceDetails?.url || 'Not deployed'}`);
      console.log(`  🔧 Build Command: ${serviceData.serviceDetails?.envSpecificDetails?.buildCommand || 'Not set'}`);
      console.log(`  🚀 Start Command: ${serviceData.serviceDetails?.envSpecificDetails?.startCommand || 'Not set'}`);
      console.log(`  📊 Status: ${serviceData.suspended === 'not_suspended' ? 'Active' : 'Suspended'}`);
      console.log(`  ⏰ Last Deploy: ${serviceData.updatedAt ? new Date(serviceData.updatedAt).toLocaleString() : 'Never'}`);
      console.log(`  🌿 Branch: ${serviceData.branch || 'main'}`);
      console.log(`  🔄 Auto Deploy: ${serviceData.autoDeploy || 'No'}`);
      console.log(`  🏥 Health Check: ${serviceData.serviceDetails?.healthCheckPath || 'Not set'}`);
      console.log(`  🌍 Region: ${serviceData.serviceDetails?.region || 'Unknown'}`);
      return serviceData;
    } else {
      console.log('❌ Failed to get service details:', result.data);
      return null;
    }
  }

  // Get service logs
  async getServiceLogs(serviceName, lines = 100) {
    console.log(`📋 Getting logs for service: ${serviceName}`);
    
    const services = await this.getServices();
    const service = services.find(s => s.name === serviceName);
    
    if (!service) {
      console.log(`❌ Service '${serviceName}' not found`);
      return;
    }

    const result = await this.makeRequest(`/services/${service.id}/logs?limit=${lines}`);
    
    if (result.status === 200) {
      console.log('📋 Recent logs:');
      console.log('=' .repeat(80));
      console.log(result.data);
      console.log('=' .repeat(80));
    } else {
      console.log('❌ Failed to get logs:', result.data);
    }
  }

  // Trigger deployment
  async triggerDeployment(serviceName) {
    console.log(`🚀 Triggering deployment for service: ${serviceName}`);
    
    const services = await this.getServices();
    const service = services.find(s => s.name === serviceName);
    
    if (!service) {
      console.log(`❌ Service '${serviceName}' not found`);
      return;
    }

    const result = await this.makeRequest(`/services/${service.id}/deploys`, 'POST', {
      clearCache: true
    });
    
    if (result.status === 201) {
      console.log('✅ Deployment triggered successfully!');
      console.log(`  🆔 Deploy ID: ${result.data.id}`);
      console.log(`  📊 Status: ${result.data.status}`);
      console.log(`  ⏰ Started: ${result.data.createdAt}`);
      
      // Monitor deployment
      console.log('\n⏳ Monitoring deployment...');
      await this.monitorDeployment(service.id, result.data.id);
      
      return result.data;
    } else {
      console.log('❌ Failed to trigger deployment:', result.data);
      return null;
    }
  }

  // Monitor deployment progress
  async monitorDeployment(serviceId, deployId) {
    console.log('📊 Monitoring deployment progress...');
    
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max
    
    const checkDeployment = async () => {
      attempts++;
      const result = await this.makeRequest(`/services/${serviceId}/deploys/${deployId}`);
      
      if (result.status === 200) {
        const deploy = result.data;
        console.log(`  📊 Attempt ${attempts}: Status = ${deploy.status}`);
        
        if (deploy.status === 'live') {
          console.log('🎉 Deployment completed successfully!');
          console.log(`  🌐 Service URL: ${deploy.serviceDetails?.url || 'Check dashboard'}`);
          return true;
        } else if (deploy.status === 'build_failed' || deploy.status === 'update_failed') {
          console.log('❌ Deployment failed!');
          console.log(`  📋 Error: ${deploy.buildLog || 'Check logs for details'}`);
          return true;
        } else if (attempts >= maxAttempts) {
          console.log('⏰ Monitoring timeout - check dashboard for final status');
          return true;
        } else {
          // Continue monitoring
          setTimeout(checkDeployment, 10000); // Check every 10 seconds
        }
      } else {
        console.log('❌ Failed to check deployment status:', result.data);
        return true;
      }
    };
    
    await checkDeployment();
  }

  // Get databases
  async getDatabases() {
    console.log('🗄️ Fetching databases...');
    const result = await this.makeRequest('/databases');
    
    if (result.status === 200) {
      console.log('✅ Databases found:');
      console.log('Raw response:', JSON.stringify(result.data, null, 2));
      
      // Handle different response formats
      const databases = Array.isArray(result.data) ? result.data : (result.data.databases || []);
      
      databases.forEach(db => {
        console.log(`  🗄️ ${db.name || db.id || 'Unknown'}`);
        console.log(`     Type: ${db.databaseDetails?.databaseType || 'Unknown'}`);
        console.log(`     Status: ${db.databaseDetails?.status || 'Unknown'}`);
        console.log(`     Plan: ${db.databaseDetails?.plan || 'Unknown'}`);
        console.log('');
      });
      return databases;
    } else {
      console.log('❌ Failed to fetch databases:', result.data);
      return [];
    }
  }

  // Get database logs
  async getDatabaseLogs(dbName, lines = 100) {
    console.log(`📋 Getting database logs for: ${dbName}`);
    
    const databases = await this.getDatabases();
    const database = databases.find(db => db.name === dbName);
    
    if (!database) {
      console.log(`❌ Database '${dbName}' not found`);
      return;
    }

    const result = await this.makeRequest(`/databases/${database.id}/logs?limit=${lines}`);
    
    if (result.status === 200) {
      console.log('📋 Database logs:');
      console.log('=' .repeat(80));
      console.log(result.data);
      console.log('=' .repeat(80));
    } else {
      console.log('❌ Failed to get database logs:', result.data);
    }
  }

  // Comprehensive status check
  async getFullStatus() {
    console.log('🔍 ShareWheelz Deployment Status Check');
    console.log('=====================================\n');
    
    // Check services
    const services = await this.getServices();
    const sharewheelzService = services.find(s => s.name === 'sharewheelz-platform');
    
    if (sharewheelzService) {
      console.log('✅ ShareWheelz service found!');
      await this.getServiceDetails('sharewheelz-platform');
      
      // Get recent logs
      console.log('\n📋 Recent deployment logs:');
      await this.getServiceLogs('sharewheelz-platform', 50);
    } else {
      console.log('❌ ShareWheelz service not found');
      console.log('Available services:');
      services.forEach(s => console.log(`  - ${s.name}`));
    }
    
    // Check databases
    console.log('\n🗄️ Database Status:');
    const databases = await this.getDatabases();
    const sharewheelzDb = databases.find(db => db.name === 'sharewheelz-db');
    
    if (sharewheelzDb) {
      console.log('✅ ShareWheelz database found!');
      console.log(`  📊 Status: ${sharewheelzDb.databaseDetails?.status || 'Unknown'}`);
      console.log(`  🗄️ Type: ${sharewheelzDb.databaseDetails?.databaseType || 'Unknown'}`);
    } else {
      console.log('❌ ShareWheelz database not found');
    }
  }
}

// Main execution
async function main() {
  const apiKey = 'rnd_cDC8pUcD1fxvbaOoFkW3FHd28FcK';
  const render = new RenderMCP(apiKey);
  
  const command = process.argv[2];
  const serviceName = process.argv[3] || 'sharewheelz-platform';
  
  console.log('🚀 Render MCP Integration');
  console.log('========================\n');
  
  try {
    switch (command) {
      case 'status':
        await render.getFullStatus();
        break;
        
      case 'services':
        await render.getServices();
        break;
        
      case 'service':
        await render.getServiceDetails(serviceName);
        break;
        
      case 'logs':
        await render.getServiceLogs(serviceName);
        break;
        
      case 'deploy':
        await render.triggerDeployment(serviceName);
        break;
        
      case 'databases':
        await render.getDatabases();
        break;
        
      case 'dblogs':
        const dbName = process.argv[3] || 'sharewheelz-db';
        await render.getDatabaseLogs(dbName);
        break;
        
      case 'help':
      default:
        console.log('Available commands:');
        console.log('  status                    - Get full deployment status');
        console.log('  services                  - List all services');
        console.log('  service [name]            - Get service details');
        console.log('  logs [name]               - Get service logs');
        console.log('  deploy [name]             - Trigger deployment');
        console.log('  databases                 - List all databases');
        console.log('  dblogs [name]             - Get database logs');
        console.log('');
        console.log('Examples:');
        console.log('  node render-mcp.cjs status');
        console.log('  node render-mcp.cjs service sharewheelz-platform');
        console.log('  node render-mcp.cjs logs sharewheelz-platform');
        console.log('  node render-mcp.cjs deploy sharewheelz-platform');
        console.log('  node render-mcp.cjs databases');
        console.log('  node render-mcp.cjs dblogs sharewheelz-db');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RenderMCP };
