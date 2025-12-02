import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { useMessaging } from '../contexts/MessagingContext';
import { useAuth } from '../contexts/AuthContext';
import { messagingApi } from '../lib/api';
import { useLocation } from 'wouter';

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
  sender: any;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, sender }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender?.profileImage} alt={sender?.firstName} />
            <AvatarFallback className="text-xs">
              {sender?.firstName?.[0]}{sender?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`rounded-2xl px-4 py-2 ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center gap-1 mt-1 ${
            isOwn ? 'justify-end text-blue-100' : 'justify-start text-gray-500'
          }`}>
            <span className="text-xs">{formatTime(message.createdAt)}</span>
            {isOwn && (
              message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatWindowProps {
  conversation: any;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onBack }) => {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { 
    messages, 
    setMessages, 
    sendMessage, 
    joinConversation, 
    leaveConversation,
    typingUsers,
    markMessageAsRead
  } = useMessaging();

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', conversation.id],
    queryFn: () => messagingApi.getConversationMessages(conversation.id),
    enabled: !!conversation.id,
  });

  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData, setMessages]);

  useEffect(() => {
    if (conversation.id) {
      joinConversation(conversation.id);
      return () => leaveConversation(conversation.id);
    }
  }, [conversation.id, joinConversation, leaveConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when conversation is opened
    messages.forEach(message => {
      if (!message.isRead && message.senderId !== user?.id) {
        markMessageAsRead(message.id);
      }
    });
  }, [messages, user?.id, markMessageAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(conversation.id, messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Simple typing indicator logic
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const otherUser = conversation.ownerId === user?.id ? conversation.renter : conversation.owner;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.profileImage} alt={otherUser?.firstName} />
          <AvatarFallback>
            {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{otherUser?.firstName} {otherUser?.lastName}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.id}
                sender={{ id: message.senderId, name: 'User' }}
              />
            ))}
            
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-md">
                  <p className="text-sm text-gray-500 italic">
                    {otherUser?.firstName} is typing...
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ConversationsListProps {
  onSelectConversation: (conversation: any) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ onSelectConversation }) => {
  const { user } = useAuth();
  const { conversations, setConversations } = useMessaging();

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingApi.getConversations(),
  });

  useEffect(() => {
    if (conversationsData?.conversations) {
      setConversations(conversationsData.conversations);
    }
  }, [conversationsData, setConversations]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
        <p className="text-gray-500">Start a conversation by messaging a car owner or renter from your bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUser = conversation.ownerId === user?.id ? conversation.renter : conversation.owner;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherUser?.profileImage} alt={otherUser?.firstName} />
              <AvatarFallback>
                {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold truncate">{otherUser?.firstName} {otherUser?.lastName}</h4>
                <div className="flex items-center gap-2">
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageAt)}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage?.content || 'No messages yet'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MessagingApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/dashboard');
  };

  if (selectedConversation) {
    return (
      <div className="h-screen flex flex-col">
        <ChatWindow 
          conversation={selectedConversation} 
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ConversationsList onSelectConversation={setSelectedConversation} />
      </div>
    </div>
  );
};

export default MessagingApp;
