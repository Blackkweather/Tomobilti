#!/usr/bin/env node

/**
 * Remove Hardcoded Credentials Script
 * Replaces all hardcoded credentials with environment variable references
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Removing hardcoded credentials from all script files...\n');

// Define credential patterns to replace
const credentialReplacements = [
  {
    pattern: /const DATABASE_URL = ['"`].*?['"`]/g,
    replacement: "const DATABASE_URL = process.env.DATABASE_URL"
  },
  {
    pattern: /DATABASE_URL: ['"`].*?['"`]/g,
    replacement: "DATABASE_URL: process.env.DATABASE_URL"
  },
  {
    pattern: /password: ['"`]Demo123!['"`]/g,
    replacement: "password: process.env.DEMO_USER_PASSWORD || 'SecureDemo123!'"
  },
  {
    pattern: /password: ['"`]demo_password_123['"`]/g,
    replacement: "password: process.env.DEMO_USER_PASSWORD || 'SecureDemo123!'"
  },
  {
    pattern: /email: ['"`].*?@.*?\..*?['"`]/g,
    replacement: "email: process.env.DEMO_USER_EMAIL || 'demo@sharewheelz.uk'"
  },
  {
    pattern: /JWT_SECRET: ['"`].*?['"`]/g,
    replacement: "JWT_SECRET: process.env.JWT_SECRET"
  },
  {
    pattern: /OPENAI_API_KEY: ['"`]sk-.*?['"`]/g,
    replacement: "OPENAI_API_KEY: process.env.OPENAI_API_KEY"
  }
];

// Files to process
const scriptsDir = path.join(__dirname);
const testDir = path.join(__dirname, '..', 'tests');

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    credentialReplacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all script files
const scriptFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('.js') || file.endsWith('.cjs'))
  .map(file => path.join(scriptsDir, file));

// Process test files
let testFiles = [];
if (fs.existsSync(testDir)) {
  testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('.js') || file.endsWith('.test.js'))
    .map(file => path.join(testDir, file));
}

const allFiles = [...scriptFiles, ...testFiles];

console.log(`Processing ${allFiles.length} files...\n`);

allFiles.forEach(processFile);

console.log('\n🎉 Hardcoded credential removal complete!');
console.log('\n📋 Next steps:');
console.log('1. Set environment variables in your .env file');
console.log('2. Use the .env.secure.template as a reference');
console.log('3. Never commit credentials to version control');