import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔍 Creating conversation for current user as renter...');

// Find a booking where current user is the renter
const currentUserId = 'f17dce84-e26c-4bae-bf0f-4972fb134803';
const userBooking = db.prepare(`
  SELECT b.*, c.owner_id 
  FROM bookings b
  JOIN cars c ON b.car_id = c.id
  WHERE b.renter_id = ? AND (b.status = 'confirmed' OR b.status = 'pending')
  LIMIT 1
`).get(currentUserId);

if (userBooking) {
  console.log('🚗 Found booking for current user:', userBooking);
  
  // Check if conversation already exists
  const existingConv = db.prepare(`
    SELECT * FROM conversations WHERE booking_id = ?
  `).get(userBooking.id);
  
  if (existingConv) {
    console.log('✅ Conversation already exists for this booking');
  } else {
    // Create conversation
    const conversationId = crypto.randomUUID();
    
    db.prepare(`
      INSERT INTO conversations (id, booking_id, owner_id, renter_id, last_message_at, created_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      conversationId,
      userBooking.id,
      userBooking.owner_id,
      userBooking.renter_id
    );
    
    console.log('✅ Created conversation for current user!');
    console.log('💬 Conversation ID:', conversationId);
    
    // Add a sample message from the owner
    const messageId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, content, message_type, is_read, created_at)
      VALUES (?, ?, ?, ?, 'text', 0, datetime('now'))
    `).run(
      messageId,
      conversationId,
      userBooking.owner_id,
      'Hi! Thanks for booking my car. I\'m excited to host you! Do you have any questions about the pickup location?'
    );
    
    console.log('💬 Added welcome message from owner');
  }
} else {
  console.log('❌ No bookings found for current user');
}

// Show all conversations
const allConversations = db.prepare(`
  SELECT c.*, b.id as booking_id, b.status as booking_status,
         u1.firstName as owner_name, u2.firstName as renter_name
  FROM conversations c
  LEFT JOIN bookings b ON c.booking_id = b.id
  LEFT JOIN users u1 ON c.owner_id = u1.id
  LEFT JOIN users u2 ON c.renter_id = u2.id
`).all();

console.log('📋 All conversations:', allConversations);

db.close();
console.log('✅ Setup completed');
