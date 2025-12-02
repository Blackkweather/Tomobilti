import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Loader2,
  Copy,
  Eye
} from 'lucide-react';

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

interface DeliveryStatus {
  messageId: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'EXPIRED';
  timestamp: string;
  error?: string;
}

export default function SMSTestPanel() {
  const [activeTab, setActiveTab] = useState('send');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SMSResponse | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus | null>(null);
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('ShareWheelz');
  
  // Booking confirmation form
  const [bookingForm, setBookingForm] = useState({
    bookingId: 'BK123456',
    carName: 'BMW 3 Series',
    startDate: '2024-01-25',
    endDate: '2024-01-28',
    totalAmount: 180,
    pickupLocation: 'London Heathrow Airport'
  });
  
  // Verification code form
  const [verificationCode, setVerificationCode] = useState('123456');

  const tabs = [
    { id: 'send', label: 'Send SMS', icon: Send },
    { id: 'booking', label: 'Booking Confirmation', icon: Calendar },
    { id: 'verification', label: 'Verification Code', icon: CheckCircle },
    { id: 'status', label: 'Check Status', icon: Eye }
  ];

  const handleSendSMS = async () => {
    if (!phoneNumber || !message) {
      alert('Please enter phone number and message');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          text: message,
          from: senderName
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('SMS send error:', error);
      setResult({
        success: false,
        error: 'Failed to send SMS'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingConfirmation = async () => {
    if (!phoneNumber) {
      alert('Please enter phone number');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sms/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          bookingDetails: bookingForm
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Booking confirmation SMS error:', error);
      setResult({
        success: false,
        error: 'Failed to send booking confirmation SMS'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCode = async () => {
    if (!phoneNumber || !verificationCode) {
      alert('Please enter phone number and verification code');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/sms/verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Verification code SMS error:', error);
      setResult({
        success: false,
        error: 'Failed to send verification code SMS'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!result?.messageId) {
      alert('No message ID available. Send an SMS first.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/sms/status/${result.messageId}`);
      const data = await response.json();
      setDeliveryStatus(data);
    } catch (error) {
      console.error('Status check error:', error);
      setDeliveryStatus({
        messageId: result.messageId,
        status: 'FAILED',
        timestamp: new Date().toISOString(),
        error: 'Failed to check status'
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = async () => {
    if (!phoneNumber) return;

    try {
      const response = await fetch('/api/sms/validate-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (data.isValid) {
        setPhoneNumber(data.formatted);
        alert(`Phone number validated and formatted: ${data.formatted}`);
      } else {
        alert('Invalid phone number format');
      }
    } catch (error) {
      console.error('Phone validation error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'EXPIRED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">SMS Testing Panel</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Test Infobip SMS functionality with your API key: 29c1fdb6f37d15f32278f821aaa573d5-545feb06-2f6b-4d98-8a0e-eaa21249ef6c
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {/* Phone Number Input (Common to all tabs) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (UK Format)
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+44 7xxx xxx xxx or 07xxx xxx xxx"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={validatePhoneNumber}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Validate
            </button>
          </div>
        </div>

        {/* Send SMS Tab */}
        {activeTab === 'send' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Text
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Enter your SMS message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Character count: {message.length} (SMS limit: 160 characters)
              </p>
            </div>

            <button
              onClick={handleSendSMS}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send SMS
            </button>
          </div>
        )}

        {/* Booking Confirmation Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking ID
                </label>
                <input
                  type="text"
                  value={bookingForm.bookingId}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, bookingId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Name
                </label>
                <input
                  type="text"
                  value={bookingForm.carName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, carName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (£)
                </label>
                <input
                  type="number"
                  value={bookingForm.totalAmount}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={bookingForm.pickupLocation}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleBookingConfirmation}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
              Send Booking Confirmation
            </button>
          </div>
        )}

        {/* Verification Code Tab */}
        {activeTab === 'verification' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleVerificationCode}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Send Verification Code
            </button>
          </div>
        )}

        {/* Check Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Last Message ID</h3>
              {result?.messageId ? (
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-2 py-1 rounded text-sm">{result.messageId}</code>
                  <button
                    onClick={() => copyToClipboard(result.messageId!)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No message ID available. Send an SMS first.</p>
              )}
            </div>

            <button
              onClick={handleCheckStatus}
              disabled={loading || !result?.messageId}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Check Delivery Status
            </button>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">SMS Result</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  {result.success ? 'SMS Sent Successfully' : 'SMS Failed'}
                </span>
              </div>
              
              {result.messageId && (
                <div className="text-sm text-gray-600">
                  <strong>Message ID:</strong> {result.messageId}
                </div>
              )}
              
              {result.cost && (
                <div className="text-sm text-gray-600">
                  <strong>Cost:</strong> £{result.cost}
                </div>
              )}
              
              {result.error && (
                <div className="text-sm text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Status Display */}
        {deliveryStatus && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Delivery Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deliveryStatus.status)}`}>
                  {deliveryStatus.status}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(deliveryStatus.timestamp).toLocaleString()}
                </span>
              </div>
              
              {deliveryStatus.error && (
                <div className="text-sm text-red-600">
                  <strong>Error:</strong> {deliveryStatus.error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}













