import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'tomobilti.db');
const db = new Database(dbPath);

console.log('🔄 Syncing SQLite conversations to in-memory storage...');

// Get all conversations from SQLite
const conversations = db.prepare(`
  SELECT * FROM conversations
`).all();

console.log('📋 SQLite conversations:', conversations);

// Get all messages from SQLite
const messages = db.prepare(`
  SELECT * FROM messages
`).all();

console.log('💬 SQLite messages:', messages);

// Create a script to populate in-memory storage
const syncScript = `
// Add this to server/storage.ts MemStorage constructor or create a sync method
${conversations.map(conv => `
this.conversations.set('${conv.id}', {
  id: '${conv.id}',
  bookingId: '${conv.booking_id}',
  ownerId: '${conv.owner_id}',
  renterId: '${conv.renter_id}',
  lastMessageAt: '${conv.last_message_at}',
  createdAt: '${conv.created_at}'
});`).join('')}

${messages.map(msg => `
this.messages.set('${msg.id}', {
  id: '${msg.id}',
  conversationId: '${msg.conversation_id}',
  senderId: '${msg.sender_id}',
  content: '${msg.content.replace(/'/g, "\\'")}',
  messageType: '${msg.message_type}',
  isRead: ${msg.is_read ? 'true' : 'false'},
  createdAt: '${msg.created_at}'
});`).join('')}
`;

console.log('📝 Sync script generated. Conversations and messages need to be loaded into in-memory storage.');

db.close();
console.log('✅ SQLite data extracted');
