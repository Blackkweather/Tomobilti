import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔍 Checking existing conversations...');

// Check if conversations table exists
const tableExists = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name='conversations'
`).get();

if (!tableExists) {
  console.log('❌ Conversations table does not exist!');
  process.exit(1);
}

// Check existing conversations
const existingConversations = db.prepare(`
  SELECT * FROM conversations
`).all();

console.log('📋 Existing conversations:', existingConversations);

// Check existing bookings
const existingBookings = db.prepare(`
  SELECT id, renter_id, car_id, status FROM bookings 
  WHERE status = 'confirmed' OR status = 'pending'
  LIMIT 5
`).all();

console.log('🚗 Available bookings:', existingBookings);

if (existingBookings.length > 0) {
  const booking = existingBookings[0];
  
  // Check if conversation already exists for this booking
  const existingConv = db.prepare(`
    SELECT * FROM conversations WHERE booking_id = ?
  `).get(booking.id);
  
  if (existingConv) {
    console.log('✅ Conversation already exists for booking:', booking.id);
    console.log('💬 Conversation ID:', existingConv.id);
  } else {
    // Create a new conversation
    const conversationId = crypto.randomUUID();
    
    db.prepare(`
      INSERT INTO conversations (id, booking_id, owner_id, renter_id, last_message_at, created_at)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      conversationId,
      booking.id,
      booking.owner_id || 'f17dce84-e26c-4bae-bf0f-4972fb134803', // Use current user as owner if no owner_id
      booking.renter_id
    );
    
    console.log('✅ Created new conversation!');
    console.log('💬 Conversation ID:', conversationId);
    console.log('📋 Booking ID:', booking.id);
    console.log('👤 Renter ID:', booking.renter_id);
    
    // Add a sample message
    const messageId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, content, message_type, is_read, created_at)
      VALUES (?, ?, ?, ?, 'text', 0, datetime('now'))
    `).run(
      messageId,
      conversationId,
      booking.renter_id,
      'Hello! I have a question about the car rental. When can I pick up the car?'
    );
    
    console.log('💬 Added sample message to conversation');
  }
} else {
  console.log('❌ No bookings found to create conversation from');
}

// Check final conversations
const finalConversations = db.prepare(`
  SELECT c.*, b.id as booking_id, b.status as booking_status
  FROM conversations c
  LEFT JOIN bookings b ON c.booking_id = b.id
`).all();

console.log('📋 Final conversations:', finalConversations);

db.close();
console.log('✅ Database operations completed');
