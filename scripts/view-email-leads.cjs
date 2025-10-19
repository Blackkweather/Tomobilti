const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('\n📧 EMAIL LEADS DATABASE\n');
console.log('='.repeat(80));

try {
  // Get all email leads
  const leads = db.prepare('SELECT * FROM email_leads ORDER BY created_at DESC').all();
  
  if (leads.length === 0) {
    console.log('\n❌ No email leads found yet.\n');
  } else {
    console.log(`\n✅ Total Email Leads: ${leads.length}\n`);
    
    leads.forEach((lead, index) => {
      console.log(`${index + 1}. Email: ${lead.email}`);
      console.log(`   Source: ${lead.source}`);
      console.log(`   Discount Code: ${lead.discount_code}`);
      console.log(`   Used: ${lead.is_used ? 'Yes' : 'No'}`);
      console.log(`   Created: ${lead.created_at}`);
      console.log('-'.repeat(80));
    });
  }
  
  // Show table structure
  console.log('\n📊 TABLE STRUCTURE:\n');
  const tableInfo = db.prepare('PRAGMA table_info(email_leads)').all();
  tableInfo.forEach(col => {
    console.log(`   ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}

console.log('\n' + '='.repeat(80));
console.log('\n💡 Emails are stored in: tomobilti.db > email_leads table');
console.log('💡 You can export them for marketing campaigns\n');
