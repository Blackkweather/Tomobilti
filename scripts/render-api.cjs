#!/usr/bin/env node

/**
 * Render API Management Script
 * Interacts with Render.com API for deployment management
 */

const https = require('https');

class RenderAPI {
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

  // Get service information
  async getService(serviceId) {
    return this.makeRequest(`/services/${serviceId}`);
  }

  // Get service logs
  async getServiceLogs(serviceId, limit = 100) {
    return this.makeRequest(`/services/${serviceId}/logs?limit=${limit}`);
  }

  // Trigger manual deployment
  async deployService(serviceId) {
    return this.makeRequest(`/services/${serviceId}/deploys`, 'POST', {
      clearCache: true
    });
  }

  // Get deployment status
  async getDeploymentStatus(serviceId, deployId) {
    return this.makeRequest(`/services/${serviceId}/deploys/${deployId}`);
  }

  // Get all services
  async getServices() {
    return this.makeRequest('/services');
  }

  // Get database information
  async getDatabase(dbId) {
    return this.makeRequest(`/databases/${dbId}`);
  }

  // Get database logs
  async getDatabaseLogs(dbId, limit = 100) {
    return this.makeRequest(`/databases/${dbId}/logs?limit=${limit}`);
  }
}

// Usage example
async function manageRenderDeployment() {
  const apiKey = process.env.RENDER_API_KEY;
  
  if (!apiKey) {
    console.log('❌ RENDER_API_KEY environment variable not set');
    console.log('📋 To get your API key:');
    console.log('1. Go to https://render.com/dashboard');
    console.log('2. Click on your profile → Account Settings');
    console.log('3. Go to API Keys section');
    console.log('4. Generate a new API key');
    console.log('5. Set it as environment variable: export RENDER_API_KEY=your_key_here');
    return;
  }

  const render = new RenderAPI(apiKey);
  
  try {
    console.log('🔍 Fetching services...');
    const services = await render.getServices();
    
    if (services.status === 200) {
      console.log('✅ Services found:');
      services.data.forEach(service => {
        console.log(`  - ${service.name} (${service.type}) - ${service.serviceDetails?.buildCommand || 'No build command'}`);
      });
    } else {
      console.log('❌ Failed to fetch services:', services.data);
    }

    // Example: Get specific service (replace with your service ID)
    const serviceId = 'sharewheelz-platform'; // Your service name
    console.log(`\n🔍 Getting service details for: ${serviceId}`);
    
    const service = await render.getService(serviceId);
    if (service.status === 200) {
      console.log('✅ Service details:');
      console.log(`  - Status: ${service.data.serviceDetails?.buildCommand || 'Unknown'}`);
      console.log(`  - URL: ${service.data.serviceDetails?.url || 'Unknown'}`);
      console.log(`  - Last Deploy: ${service.data.serviceDetails?.lastDeployAt || 'Unknown'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Command line interface
const command = process.argv[2];
const serviceId = process.argv[3];

async function runCommand() {
  const apiKey = process.env.RENDER_API_KEY;
  
  if (!apiKey) {
    console.log('❌ RENDER_API_KEY not set. Please set your Render API key.');
    process.exit(1);
  }

  const render = new RenderAPI(apiKey);

  switch (command) {
    case 'status':
      if (!serviceId) {
        console.log('Usage: node render-api.cjs status <service-id>');
        process.exit(1);
      }
      const status = await render.getService(serviceId);
      console.log('Service Status:', JSON.stringify(status.data, null, 2));
      break;

    case 'logs':
      if (!serviceId) {
        console.log('Usage: node render-api.cjs logs <service-id>');
        process.exit(1);
      }
      const logs = await render.getServiceLogs(serviceId);
      console.log('Service Logs:', logs.data);
      break;

    case 'deploy':
      if (!serviceId) {
        console.log('Usage: node render-api.cjs deploy <service-id>');
        process.exit(1);
      }
      const deploy = await render.deployService(serviceId);
      console.log('Deployment triggered:', JSON.stringify(deploy.data, null, 2));
      break;

    case 'services':
      const services = await render.getServices();
      console.log('All Services:', JSON.stringify(services.data, null, 2));
      break;

    default:
      console.log('🚀 Render API Management Tool');
      console.log('============================');
      console.log('Available commands:');
      console.log('  status <service-id>  - Get service status');
      console.log('  logs <service-id>    - Get service logs');
      console.log('  deploy <service-id>  - Trigger deployment');
      console.log('  services            - List all services');
      console.log('');
      console.log('Examples:');
      console.log('  node render-api.cjs services');
      console.log('  node render-api.cjs status sharewheelz-platform');
      console.log('  node render-api.cjs logs sharewheelz-platform');
      console.log('  node render-api.cjs deploy sharewheelz-platform');
      break;
  }
}

if (require.main === module) {
  runCommand().catch(console.error);
}

module.exports = { RenderAPI, manageRenderDeployment };
