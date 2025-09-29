import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('📋 Checking all conversations...');

// Show all conversations with correct column names
const allConversations = db.prepare(`
  SELECT c.*, b.id as booking_id, b.status as booking_status,
         u1.first_name as owner_name, u2.first_name as renter_name
  FROM conversations c
  LEFT JOIN bookings b ON c.booking_id = b.id
  LEFT JOIN users u1 ON c.owner_id = u1.id
  LEFT JOIN users u2 ON c.renter_id = u2.id
`).all();

console.log('📋 All conversations:', allConversations);

// Show messages for each conversation
for (const conv of allConversations) {
  const messages = db.prepare(`
    SELECT m.*, u.first_name as sender_name
    FROM messages m
    LEFT JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `).all(conv.id);
  
  console.log(`💬 Messages for conversation ${conv.id}:`, messages);
}

db.close();
console.log('✅ Check completed');
