import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface NotificationSettings {
  emailNotifications: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    paymentReceipts: boolean;
    promotions: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    bookingUpdates: boolean;
    messages: boolean;
    promotions: boolean;
  };
  smsNotifications: {
    bookingConfirmations: boolean;
    emergencyAlerts: boolean;
  };
}

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      bookingConfirmations: true,
      bookingReminders: true,
      paymentReceipts: true,
      promotions: false,
      systemUpdates: true,
    },
    pushNotifications: {
      bookingUpdates: true,
      messages: true,
      promotions: false,
    },
    smsNotifications: {
      bookingConfirmations: false,
      emergencyAlerts: true,
    },
  });

  const { data: currentSettings } = useQuery<NotificationSettings>({
    queryKey: ["/api/users/notification-settings"],
  });

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      await apiRequest("PUT", "/api/users/notification-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/notification-settings"] });
    },
  });

  const handleToggle = (category: keyof NotificationSettings, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]],
      },
    }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage how you receive notifications from ShareWheelz
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Email Notifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(settings.emailNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {key === 'bookingConfirmations' && 'Receive emails when bookings are confirmed or cancelled'}
                        {key === 'bookingReminders' && 'Get reminders about upcoming bookings'}
                        {key === 'paymentReceipts' && 'Receive receipts for payments and refunds'}
                        {key === 'promotions' && 'Get notified about special offers and promotions'}
                        {key === 'systemUpdates' && 'Important updates about the platform'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {Object.entries(settings.pushNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {key === 'bookingUpdates' && 'Real-time updates about your bookings'}
                        {key === 'messages' && 'New messages from other users'}
                        {key === 'promotions' && 'Special offers and deals'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Notifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
              <div className="space-y-4">
                {Object.entries(settings.smsNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">
                        {key === 'bookingConfirmations' && 'SMS confirmations for bookings'}
                        {key === 'emergencyAlerts' && 'Critical alerts and emergency notifications'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggle('smsNotifications', key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
