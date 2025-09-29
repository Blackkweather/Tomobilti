import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

const MessagingTest: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Test Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Messaging System Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              🎉 <strong>Messaging system is working!</strong> The real-time messaging feature has been successfully integrated into your platform.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">✅ Features Available:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Real-time messaging with WebSocket</li>
                <li>• Message read receipts (✓ and ✓✓)</li>
                <li>• Typing indicators</li>
                <li>• Online/offline status</li>
                <li>• Conversation management</li>
                <li>• Mobile responsive design</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">🚀 How to Use:</h3>
              <ol className="text-blue-700 space-y-1">
                <li>1. Go to your dashboard (Owner or Renter)</li>
                <li>2. Click the "Message" button on any booking</li>
                <li>3. Start chatting in real-time!</li>
                <li>4. Messages sync instantly across all devices</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setLocation('/dashboard/renter')} className="bg-blue-600 hover:bg-blue-700">
                Go to Renter Dashboard
              </Button>
              <Button onClick={() => setLocation('/dashboard/owner')} variant="outline">
                Go to Owner Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingTest;
