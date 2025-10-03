import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Copy,
  Settings,
  MessageSquare,
  Calendar,
  User,
  Wrench
} from 'lucide-react';

interface AgentResponse {
  success: boolean;
  response: string;
  agentType: string;
  metadata?: {
    model?: string;
    tokens?: number;
    fallback?: boolean;
    error?: string;
  };
}

interface AgentCapabilities {
  availableAgents: string[];
  agentDescriptions: {
    support: string;
    booking: string;
    host: string;
    technical: string;
  };
  isInitialized: boolean;
}

export default function AIAgentTestPanel() {
  const [activeAgent, setActiveAgent] = useState('support');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<AgentResponse[]>([]);
  const [capabilities, setCapabilities] = useState<AgentCapabilities | null>(null);

  const agents = [
    { id: 'support', label: 'Support Agent', icon: MessageSquare, color: 'blue' },
    { id: 'booking', label: 'Booking Agent', icon: Calendar, color: 'green' },
    { id: 'host', label: 'Host Agent', icon: User, color: 'purple' },
    { id: 'technical', label: 'Technical Agent', icon: Wrench, color: 'orange' }
  ];

  const testMessages = {
    support: [
      "I need help with my booking",
      "What are your cancellation policies?",
      "How do I contact customer service?",
      "I have a complaint about my rental"
    ],
    booking: [
      "I want to book a car for this weekend",
      "What cars are available in London?",
      "How much does it cost to rent a BMW?",
      "Can I extend my booking?"
    ],
    host: [
      "How do I become a host?",
      "What should I charge for my car?",
      "How do I optimize my listing?",
      "What are the host requirements?"
    ],
    technical: [
      "I can't log into my account",
      "The app is not working",
      "How do I update my payment method?",
      "I'm having trouble with the website"
    ]
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message;
    if (!messageToSend.trim()) return;

    setLoading(true);
    const newResponse: AgentResponse = {
      success: false,
      response: '',
      agentType: activeAgent,
    };

    try {
      const response = await fetch(`/api/agent/${activeAgent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: 'admin-testing'
          }
        }),
      });

      const data = await response.json();
      setResponses(prev => [...prev, data]);
    } catch (error) {
      console.error('Agent request error:', error);
      newResponse.response = 'Failed to connect to agent service';
      setResponses(prev => [...prev, newResponse]);
    } finally {
      setLoading(false);
      if (!customMessage) setMessage('');
    }
  };

  const loadCapabilities = async () => {
    try {
      const response = await fetch('/api/agent/capabilities');
      const data = await response.json();
      setCapabilities(data);
    } catch (error) {
      console.error('Failed to load capabilities:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getAgentColor = (agentType: string) => {
    const agent = agents.find(a => a.id === agentType);
    return agent?.color || 'gray';
  };

  const getAgentIcon = (agentType: string) => {
    const agent = agents.find(a => a.id === agentType);
    return agent?.icon || Bot;
  };

  React.useEffect(() => {
    loadCapabilities();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Agent Testing Panel</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Test the new @openai/agents integration with specialized AI agents for different use cases
        </p>
      </div>

      {/* Agent Selection */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Agent Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  activeAgent === agent.id
                    ? `border-${agent.color}-500 bg-${agent.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-${agent.color}-600`} />
                  <span className="text-sm font-medium">{agent.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Quick Test Messages */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Test Messages</h3>
          <div className="flex flex-wrap gap-2">
            {testMessages[activeAgent as keyof typeof testMessages]?.map((testMsg, index) => (
              <button
                key={index}
                onClick={() => sendMessage(testMsg)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {testMsg}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Message
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter a message for ${agents.find(a => a.id === activeAgent)?.label}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </button>
          </div>
        </div>

        {/* Agent Capabilities */}
        {capabilities && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Agent Capabilities</h3>
            <div className="text-xs text-gray-600">
              <div className="mb-2">
                <strong>Status:</strong> {capabilities.isInitialized ? '✅ Initialized' : '❌ Not Initialized'}
              </div>
              <div className="mb-2">
                <strong>Available Agents:</strong> {capabilities.availableAgents.join(', ')}
              </div>
              <div>
                <strong>Current Agent:</strong> {capabilities.agentDescriptions[activeAgent as keyof typeof capabilities.agentDescriptions]}
              </div>
            </div>
          </div>
        )}

        {/* Responses */}
        {responses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Agent Responses</h3>
            {responses.map((response, index) => {
              const Icon = getAgentIcon(response.agentType);
              const color = getAgentColor(response.agentType);
              
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 text-${color}-600`} />
                      <span className={`text-sm font-medium text-${color}-600`}>
                        {agents.find(a => a.id === response.agentType)?.label}
                      </span>
                      {response.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(response.response)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-800 mb-2">
                    {response.response}
                  </div>
                  
                  {response.metadata && (
                    <div className="text-xs text-gray-500">
                      {response.metadata.fallback && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded mr-2">
                          Fallback Response
                        </span>
                      )}
                      {response.metadata.model && (
                        <span>Model: {response.metadata.model}</span>
                      )}
                      {response.metadata.tokens && (
                        <span className="ml-2">Tokens: {response.metadata.tokens}</span>
                      )}
                      {response.metadata.error && (
                        <span className="ml-2 text-red-600">Error: {response.metadata.error}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}







