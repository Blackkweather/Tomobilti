import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔧 Creating conversations and messages tables...');

// Create conversations table
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    renter_id TEXT NOT NULL,
    last_message_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (renter_id) REFERENCES users(id)
  )
`);

// Create messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text',
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  )
`);

console.log('✅ Tables created successfully!');

// Check existing bookings
const existingBookings = db.prepare(`
  SELECT id, renter_id, car_id, status FROM bookings 
  WHERE status = 'confirmed' OR status = 'pending'
  LIMIT 5
`).all();

console.log('🚗 Available bookings:', existingBookings);

if (existingBookings.length > 0) {
  const booking = existingBookings[0];
  
  // Get the car owner
  const car = db.prepare(`
    SELECT owner_id FROM cars WHERE id = ?
  `).get(booking.car_id);
  
  if (car) {
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
        car.owner_id,
        booking.renter_id
      );
      
      console.log('✅ Created new conversation!');
      console.log('💬 Conversation ID:', conversationId);
      console.log('📋 Booking ID:', booking.id);
      console.log('👤 Owner ID:', car.owner_id);
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
    console.log('❌ Could not find car owner for booking');
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
