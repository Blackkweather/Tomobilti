import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useAuth } from "../contexts/AuthContext";
import { useMessaging } from "../contexts/MessagingContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Minimize2,
  Maximize2,
  Search,
  Filter,
  Settings,
  Archive,
  Pin,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Mic,
  Video,
  Users,
  Shield,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Copy,
  Share2,
  Flag,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  X,
  Menu,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Gift,
  Heart,
  MessageSquare,
  MessageSquarePlus,
  MessageSquareText,
  MessageSquareX,
  MessageSquareCheck,
  MessageSquareWarning,
  MessageSquareInfo,
  MessageSquareQuestion,
  MessageSquareReply,
  MessageSquareForward,
  MessageSquareEdit,
  MessageSquareDelete,
  MessageSquarePin,
  MessageSquareUnpin,
  MessageSquareArchive,
  MessageSquareUnarchive,
  MessageSquareStar,
  MessageSquareUnstar,
  MessageSquareFlag,
  MessageSquareUnflag,
  MessageSquareReport,
  MessageSquareBlock,
  MessageSquareUnblock,
  MessageSquareMute,
  MessageSquareUnmute,
  MessageSquareHide,
  MessageSquareShow,
  MessageSquareLock,
  MessageSquareUnlock,
  MessageSquareKey,
  MessageSquareShield,
  MessageSquareShieldCheck,
  MessageSquareShieldX,
  MessageSquareShieldAlert,
  MessageSquareShieldQuestion,
  MessageSquareShieldInfo,
  MessageSquareShieldPlus,
  MessageSquareShieldMinus,
  MessageSquareShieldEdit,
  MessageSquareShieldDelete,
  MessageSquareShieldPin,
  MessageSquareShieldUnpin,
  MessageSquareShieldArchive,
  MessageSquareShieldUnarchive,
  MessageSquareShieldStar,
  MessageSquareShieldUnstar,
  MessageSquareShieldFlag,
  MessageSquareShieldUnflag,
  MessageSquareShieldReport,
  MessageSquareShieldBlock,
  MessageSquareShieldUnblock,
  MessageSquareShieldMute,
  MessageSquareShieldUnmute,
  MessageSquareShieldHide,
  MessageSquareShieldShow,
  MessageSquareShieldLock,
  MessageSquareShieldUnlock,
  MessageSquareShieldKey,
  MessageSquareShieldCheck,
  MessageSquareShieldX,
  MessageSquareShieldAlert,
  MessageSquareShieldQuestion,
  MessageSquareShieldInfo,
  MessageSquareShieldPlus,
  MessageSquareShieldMinus,
  MessageSquareShieldEdit,
  MessageSquareShieldDelete,
  MessageSquareShieldPin,
  MessageSquareShieldUnpin,
  MessageSquareShieldArchive,
  MessageSquareShieldUnarchive,
  MessageSquareShieldStar,
  MessageSquareShieldUnstar,
  MessageSquareShieldFlag,
  MessageSquareShieldUnflag,
  MessageSquareShieldReport,
  MessageSquareShieldBlock,
  MessageSquareShieldUnblock,
  MessageSquareShieldMute,
  MessageSquareShieldUnmute,
  MessageSquareShieldHide,
  MessageSquareShieldShow,
  MessageSquareShieldLock,
  MessageSquareShieldUnlock,
  MessageSquareShieldKey
} from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "text" | "image" | "booking";
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage: Message;
  unreadCount: number;
  bookingId?: string;
}

export default function Messages() {
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversation],
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      await apiRequest("POST", "/api/messages", { conversationId, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      setNewMessage("");
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      await apiRequest("PATCH", `/api/messages/conversations/${conversationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      sendMessageMutation.mutate({
        conversationId: selectedConversation,
        content: newMessage.trim(),
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsReadMutation.mutate(conversationId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <div className="bg-white shadow rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
                </div>
                
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.688c-.442.111-.905-.111-.905-.587l.688-2.725A8.955 8.955 0 014 12C4 7.582 7.582 4 12 4s8 3.582 8 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
                    <p className="mt-1 text-sm text-gray-500">Start a conversation by booking a car.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation) => {
                      const otherParticipant = conversation.participants.find(p => p.id !== "current-user-id");
                      return (
                        <div
                          key={conversation.id}
                          onClick={() => handleSelectConversation(conversation.id)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 ${
                            selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <img
                              src={otherParticipant?.avatar || "/default-avatar.png"}
                              alt={otherParticipant?.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {otherParticipant?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center">
                        <img
                          src={selectedConversationData?.participants.find(p => p.id !== "current-user-id")?.avatar || "/default-avatar.png"}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {selectedConversationData?.participants.find(p => p.id !== "current-user-id")?.name}
                          </p>
                          {selectedConversationData?.bookingId && (
                            <p className="text-xs text-gray-500">
                              Booking #{selectedConversationData.bookingId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === "current-user-id" ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === "current-user-id"
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === "current-user-id" ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <form onSubmit={handleSendMessage} className="flex space-x-4">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                        >
                          {sendMessageMutation.isPending ? "Sending..." : "Send"}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.697-.413l-2.725.688c-.442.111-.905-.111-.905-.587l.688-2.725A8.955 8.955 0 014 12C4 7.582 7.582 4 12 4s8 3.582 8 8z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Select a conversation</h3>
                      <p className="mt-1 text-sm text-gray-500">Choose a conversation from the list to start messaging.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
