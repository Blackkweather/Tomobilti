#!/usr/bin/env node

/**
 * Render CLI Management Script
 * Uses Render CLI for deployment management
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class RenderCLI {
  constructor() {
    this.checkCLI();
  }

  checkCLI() {
    try {
      execSync('render --version', { stdio: 'pipe' });
      console.log('✅ Render CLI is installed');
    } catch (error) {
      console.log('❌ Render CLI not found');
      console.log('📦 Install it with: npm install -g @render/cli');
      console.log('🔑 Then login with: render auth login');
      process.exit(1);
    }
  }

  async runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn('render', [command, ...args], {
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          code,
          stdout,
          stderr
        });
      });

      child.on('error', reject);
    });
  }

  // Get service status
  async getServiceStatus(serviceId) {
    const result = await this.runCommand('service', ['get', serviceId]);
    return result;
  }

  // Get service logs
  async getServiceLogs(serviceId, lines = 100) {
    const result = await this.runCommand('logs', [serviceId, '--lines', lines.toString()]);
    return result;
  }

  // Trigger deployment
  async deployService(serviceId) {
    const result = await this.runCommand('deploy', ['trigger', serviceId]);
    return result;
  }

  // List all services
  async listServices() {
    const result = await this.runCommand('service', ['list']);
    return result;
  }

  // Get deployment status
  async getDeploymentStatus(serviceId, deployId) {
    const result = await this.runCommand('deploy', ['get', serviceId, deployId]);
    return result;
  }

  // Get database status
  async getDatabaseStatus(dbId) {
    const result = await this.runCommand('database', ['get', dbId]);
    return result;
  }

  // Get database logs
  async getDatabaseLogs(dbId, lines = 100) {
    const result = await this.runCommand('logs', [dbId, '--lines', lines.toString()]);
    return result;
  }
}

// Usage functions
async function checkDeploymentStatus() {
  console.log('🔍 Checking ShareWheelz deployment status...\n');
  
  const cli = new RenderCLI();
  
  try {
    // Get service status
    console.log('📊 Service Status:');
    const serviceStatus = await cli.getServiceStatus('sharewheelz-platform');
    console.log(serviceStatus.stdout);
    
    if (serviceStatus.stderr) {
      console.log('⚠️ Warnings:', serviceStatus.stderr);
    }

    // Get recent logs
    console.log('\n📋 Recent Logs:');
    const logs = await cli.getServiceLogs('sharewheelz-platform', 50);
    console.log(logs.stdout);
    
    if (logs.stderr) {
      console.log('⚠️ Log warnings:', logs.stderr);
    }

    // Get database status
    console.log('\n🗄️ Database Status:');
    const dbStatus = await cli.getDatabaseStatus('sharewheelz-db');
    console.log(dbStatus.stdout);

  } catch (error) {
    console.error('❌ Error checking deployment:', error.message);
  }
}

async function triggerDeployment() {
  console.log('🚀 Triggering ShareWheelz deployment...\n');
  
  const cli = new RenderCLI();
  
  try {
    const deploy = await cli.deployService('sharewheelz-platform');
    console.log('✅ Deployment triggered:');
    console.log(deploy.stdout);
    
    if (deploy.stderr) {
      console.log('⚠️ Deployment warnings:', deploy.stderr);
    }

    console.log('\n⏳ Monitoring deployment...');
    // Wait a bit and check status
    setTimeout(async () => {
      const status = await cli.getServiceStatus('sharewheelz-platform');
      console.log('\n📊 Updated Status:');
      console.log(status.stdout);
    }, 10000);

  } catch (error) {
    console.error('❌ Error triggering deployment:', error.message);
  }
}

async function getDetailedLogs() {
  console.log('📋 Getting detailed ShareWheelz logs...\n');
  
  const cli = new RenderCLI();
  
  try {
    const logs = await cli.getServiceLogs('sharewheelz-platform', 200);
    console.log('📋 Service Logs:');
    console.log(logs.stdout);
    
    if (logs.stderr) {
      console.log('⚠️ Log warnings:', logs.stderr);
    }

    // Also get database logs
    console.log('\n🗄️ Database Logs:');
    const dbLogs = await cli.getDatabaseLogs('sharewheelz-db', 100);
    console.log(dbLogs.stdout);

  } catch (error) {
    console.error('❌ Error getting logs:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'status':
      await checkDeploymentStatus();
      break;
    
    case 'deploy':
      await triggerDeployment();
      break;
    
    case 'logs':
      await getDetailedLogs();
      break;
    
    case 'help':
    default:
      console.log('🚀 Render CLI Management Tool');
      console.log('==============================');
      console.log('Available commands:');
      console.log('  status  - Check deployment status');
      console.log('  deploy  - Trigger new deployment');
      console.log('  logs    - Get detailed logs');
      console.log('  help    - Show this help');
      console.log('');
      console.log('Examples:');
      console.log('  node render-cli.cjs status');
      console.log('  node render-cli.cjs deploy');
      console.log('  node render-cli.cjs logs');
      console.log('');
      console.log('Prerequisites:');
      console.log('  1. Install Render CLI: npm install -g @render/cli');
      console.log('  2. Login: render auth login');
      console.log('  3. Ensure you have access to sharewheelz-platform service');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RenderCLI, checkDeploymentStatus, triggerDeployment, getDetailedLogs };
