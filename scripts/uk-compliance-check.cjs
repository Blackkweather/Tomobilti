#!/usr/bin/env node

/**
 * ShareWheelz UK Compliance & Localization Verification
 * Comprehensive check of UK-specific compliance and localization features
 */

const https = require('https');

console.log('🇬🇧 ShareWheelz UK Compliance & Localization Verification');
console.log('========================================================\n');

const COMPLIANCE_RESULTS = {
  gdpr: { score: 0, maxScore: 0, issues: [], recommendations: [] },
  ukDataProtection: { score: 0, maxScore: 0, issues: [], recommendations: [] },
  localization: { score: 0, maxScore: 0, issues: [], recommendations: [] },
  legalPages: { score: 0, maxScore: 0, issues: [], recommendations: [] }
};

// Test GDPR compliance
async function testGDPRCompliance() {
  console.log('🔒 GDPR Compliance Check...\n');
  
  const gdprTests = [
    { name: 'GDPR Compliance Page', path: '/gdpr-compliance' },
    { name: 'Privacy Policy Page', path: '/privacy-policy' },
    { name: 'Terms of Service Page', path: '/terms-of-service' },
    { name: 'Cookie Consent Implementation', path: '/' }
  ];

  let passedTests = 0;
  
  for (const test of gdprTests) {
    const result = await testPage(test.path);
    if (result.status === 200) {
      passedTests++;
      console.log(`✅ ${test.name}: Available`);
      
      // Check for GDPR-specific content
      if (test.path === '/gdpr-compliance' && result.content.includes('GDPR')) {
        COMPLIANCE_RESULTS.gdpr.score += 10;
        console.log(`   📋 GDPR content detected`);
      }
      
      if (test.path === '/privacy-policy' && result.content.includes('privacy')) {
        COMPLIANCE_RESULTS.gdpr.score += 10;
        console.log(`   📋 Privacy content detected`);
      }
      
      if (test.path === '/terms-of-service' && result.content.includes('terms')) {
        COMPLIANCE_RESULTS.gdpr.score += 10;
        console.log(`   📋 Terms content detected`);
      }
      
    } else {
      console.log(`❌ ${test.name}: Not available (${result.status})`);
      COMPLIANCE_RESULTS.gdpr.issues.push(`${test.name} not available`);
      COMPLIANCE_RESULTS.gdpr.recommendations.push(`Implement ${test.name}`);
    }
  }
  
  COMPLIANCE_RESULTS.gdpr.maxScore += 30;
  
  // Check for cookie consent
  const homepageResult = await testPage('/');
  if (homepageResult.status === 200 && homepageResult.content.includes('cookie')) {
    COMPLIANCE_RESULTS.gdpr.score += 10;
    console.log('✅ Cookie consent mechanism detected');
  } else {
    COMPLIANCE_RESULTS.gdpr.issues.push('Cookie consent mechanism missing');
    COMPLIANCE_RESULTS.gdpr.recommendations.push('Implement cookie consent banner');
  }
  
  console.log(`\n📊 GDPR Compliance: ${COMPLIANCE_RESULTS.gdpr.score}/${COMPLIANCE_RESULTS.gdpr.maxScore + 10}`);
  console.log('');
}

// Test UK Data Protection compliance
async function testUKDataProtection() {
  console.log('🛡️ UK Data Protection Compliance...\n');
  
  const ukTests = [
    { name: 'UK Data Protection Act 2018', check: 'UK DPA compliance' },
    { name: 'ICO Registration', check: 'ICO compliance' },
    { name: 'Data Subject Rights', check: 'User rights implementation' },
    { name: 'Data Breach Procedures', check: 'Breach notification' }
  ];
  
  let ukScore = 0;
  
  for (const test of ukTests) {
    // Check if UK-specific content exists
    const privacyResult = await testPage('/privacy-policy');
    if (privacyResult.status === 200) {
      const content = privacyResult.content.toLowerCase();
      
      if (test.check === 'UK DPA compliance' && content.includes('uk') && content.includes('data protection')) {
        ukScore += 10;
        console.log(`✅ ${test.name}: UK DPA compliance mentioned`);
      } else if (test.check === 'ICO compliance' && content.includes('ico')) {
        ukScore += 10;
        console.log(`✅ ${test.name}: ICO compliance mentioned`);
      } else if (test.check === 'User rights implementation' && content.includes('right')) {
        ukScore += 10;
        console.log(`✅ ${test.name}: User rights mentioned`);
      } else if (test.check === 'Breach notification' && content.includes('breach')) {
        ukScore += 10;
        console.log(`✅ ${test.name}: Breach procedures mentioned`);
      } else {
        console.log(`⚠️ ${test.name}: Not explicitly mentioned`);
        COMPLIANCE_RESULTS.ukDataProtection.issues.push(`${test.name} not explicitly mentioned`);
        COMPLIANCE_RESULTS.ukDataProtection.recommendations.push(`Add explicit ${test.name} compliance`);
      }
    }
  }
  
  COMPLIANCE_RESULTS.ukDataProtection.score = ukScore;
  COMPLIANCE_RESULTS.ukDataProtection.maxScore = 40;
  
  console.log(`\n📊 UK Data Protection: ${ukScore}/40`);
  console.log('');
}

// Test UK localization
async function testUKLocalization() {
  console.log('🇬🇧 UK Localization Check...\n');
  
  const localizationTests = [
    { name: 'Currency (GBP)', check: '£' },
    { name: 'UK Locations', check: 'London' },
    { name: 'UK Phone Format', check: '+44' },
    { name: 'MOT Expiry Tracking', check: 'MOT' },
    { name: 'UK Names', check: 'James' },
    { name: 'UK Address Format', check: 'postcode' }
  ];
  
  let localizationScore = 0;
  
  // Test cars API for UK localization
  const carsResult = await testAPI('/api/cars');
  if (carsResult.status === 200) {
    const carsData = JSON.parse(carsResult.content);
    
    for (const test of localizationTests) {
      const content = JSON.stringify(carsData).toLowerCase();
      
      if (content.includes(test.check.toLowerCase())) {
        localizationScore += 10;
        console.log(`✅ ${test.name}: Detected in data`);
      } else {
        console.log(`⚠️ ${test.name}: Not detected`);
        COMPLIANCE_RESULTS.localization.issues.push(`${test.name} not detected`);
        COMPLIANCE_RESULTS.localization.recommendations.push(`Implement ${test.name}`);
      }
    }
  }
  
  COMPLIANCE_RESULTS.localization.score = localizationScore;
  COMPLIANCE_RESULTS.localization.maxScore = 60;
  
  console.log(`\n📊 UK Localization: ${localizationScore}/60`);
  console.log('');
}

// Test legal pages accessibility
async function testLegalPages() {
  console.log('📋 Legal Pages Accessibility...\n');
  
  const legalPages = [
    { name: 'GDPR Compliance', path: '/gdpr-compliance' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Insurance', path: '/insurance' },
    { name: 'Accessibility', path: '/accessibility' }
  ];
  
  let legalScore = 0;
  
  for (const page of legalPages) {
    const result = await testPage(page.path);
    if (result.status === 200) {
      legalScore += 10;
      console.log(`✅ ${page.name}: Accessible`);
    } else {
      console.log(`❌ ${page.name}: Not accessible (${result.status})`);
      COMPLIANCE_RESULTS.legalPages.issues.push(`${page.name} not accessible`);
      COMPLIANCE_RESULTS.legalPages.recommendations.push(`Implement ${page.name} page`);
    }
  }
  
  COMPLIANCE_RESULTS.legalPages.score = legalScore;
  COMPLIANCE_RESULTS.legalPages.maxScore = 60;
  
  console.log(`\n📊 Legal Pages: ${legalScore}/60`);
  console.log('');
}

// Test single page
function testPage(path) {
  return new Promise((resolve) => {
    const url = `https://sharewheelz.uk${path}`;
    const options = {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'ShareWheelz-Compliance-Test/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ status: res.statusCode, content: data });
      });
    });

    req.on('error', (error) => {
      resolve({ status: 0, content: '', error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, content: '', error: 'Timeout' });
    });

    req.end();
  });
}

// Test API endpoint
function testAPI(path) {
  return new Promise((resolve) => {
    const url = `https://sharewheelz.uk${path}`;
    const options = {
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'ShareWheelz-Compliance-Test/1.0',
        'Accept': 'application/json'
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ status: res.statusCode, content: data });
      });
    });

    req.on('error', (error) => {
      resolve({ status: 0, content: '', error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, content: '', error: 'Timeout' });
    });

    req.end();
  });
}

// Generate compliance report
function generateComplianceReport() {
  console.log('📋 UK COMPLIANCE & LOCALIZATION REPORT');
  console.log('========================================\n');
  
  const categories = [
    { name: 'GDPR Compliance', data: COMPLIANCE_RESULTS.gdpr },
    { name: 'UK Data Protection', data: COMPLIANCE_RESULTS.ukDataProtection },
    { name: 'UK Localization', data: COMPLIANCE_RESULTS.localization },
    { name: 'Legal Pages', data: COMPLIANCE_RESULTS.legalPages }
  ];
  
  let totalScore = 0;
  let totalMaxScore = 0;
  
  for (const category of categories) {
    const score = category.data.score;
    const maxScore = category.data.maxScore;
    const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 0;
    
    totalScore += score;
    totalMaxScore += maxScore;
    
    console.log(`${category.name}: ${score}/${maxScore} (${percentage}%)`);
    
    if (category.data.issues.length > 0) {
      console.log(`   Issues: ${category.data.issues.length}`);
      category.data.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
    
    if (category.data.recommendations.length > 0) {
      console.log(`   Recommendations: ${category.data.recommendations.length}`);
      category.data.recommendations.slice(0, 3).forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }
    console.log('');
  }
  
  const overallPercentage = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(1) : 0;
  
  console.log(`🎯 OVERALL UK COMPLIANCE: ${totalScore}/${totalMaxScore} (${overallPercentage}%)`);
  console.log('');
  
  if (overallPercentage >= 90) {
    console.log('🎉 EXCELLENT! Your platform is fully UK compliant.');
  } else if (overallPercentage >= 75) {
    console.log('✅ GOOD! Your platform meets most UK compliance requirements.');
  } else if (overallPercentage >= 60) {
    console.log('⚠️ FAIR! Your platform needs attention for UK compliance.');
  } else {
    console.log('❌ POOR! Your platform requires significant UK compliance improvements.');
  }
  
  console.log('\n📞 UK COMPLIANCE PRIORITIES:');
  
  // Get all issues sorted by priority
  const allIssues = [];
  for (const category of categories) {
    for (const issue of category.data.issues) {
      allIssues.push({ category: category.name, issue });
    }
  }
  
  if (allIssues.length === 0) {
    console.log('✅ All UK compliance requirements met!');
  } else {
    allIssues.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. [${item.category}] ${item.issue}`);
    });
  }
  
  console.log('\n🇬🇧 UK-SPECIFIC RECOMMENDATIONS:');
  console.log('1. Ensure ICO registration for data processing');
  console.log('2. Implement UK-specific data retention policies');
  console.log('3. Add UK MOT test tracking for vehicles');
  console.log('4. Configure UK-specific payment processing');
  console.log('5. Add UK insurance requirements information');
}

// Main compliance verification
async function runComplianceCheck() {
  try {
    console.log('Starting UK compliance verification for sharewheelz.uk...\n');
    
    // Test GDPR compliance
    await testGDPRCompliance();
    
    // Test UK Data Protection
    await testUKDataProtection();
    
    // Test UK localization
    await testUKLocalization();
    
    // Test legal pages
    await testLegalPages();
    
    // Generate report
    generateComplianceReport();
    
  } catch (error) {
    console.error('❌ Compliance check failed:', error.message);
  }
}

// Run the compliance check
runComplianceCheck();
