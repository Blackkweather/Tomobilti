import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface MaintenanceRecord {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  type: "routine" | "repair" | "inspection" | "emergency";
  description: string;
  cost: number;
  mileage: number;
  serviceProvider: string;
  scheduledDate: string;
  completedDate?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  receipts: string[];
}

interface MaintenanceSchedule {
  carId: string;
  nextOilChange: string;
  nextInspection: string;
  nextTireRotation: string;
  upcomingServices: Array<{
    type: string;
    dueDate: string;
    dueMileage: number;
  }>;
}

export default function Maintenance() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"records" | "schedule">("records");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<"all" | MaintenanceRecord["status"]>("all");
  const [form, setForm] = useState({
    carId: "",
    type: "routine" as MaintenanceRecord["type"],
    description: "",
    cost: "",
    mileage: "",
    serviceProvider: "",
    scheduledDate: "",
    notes: "",
  });

  const { data: records = [] } = useQuery<MaintenanceRecord[]>({
    queryKey: ["/api/maintenance/records"],
  });

  const { data: schedules = [] } = useQuery<MaintenanceSchedule[]>({
    queryKey: ["/api/maintenance/schedule"],
  });

  const { data: cars = [] } = useQuery<Array<{ id: string; make: string; model: string; year: number }>>({
    queryKey: ["/api/cars/owner"],
  });

  const addRecordMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      await apiRequest("POST", "/api/maintenance/records", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance/records"] });
      setShowAddForm(false);
      setForm({
        carId: "",
        type: "routine",
        description: "",
        cost: "",
        mileage: "",
        serviceProvider: "",
        scheduledDate: "",
        notes: "",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MaintenanceRecord["status"] }) => {
      await apiRequest("PATCH", `/api/maintenance/records/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maintenance/records"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecordMutation.mutate(form);
  };

  const filteredRecords = records.filter(record => 
    filter === "all" || record.status === filter
  );

  const getStatusColor = (status: MaintenanceRecord["status"]) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: MaintenanceRecord["type"]) => {
    switch (type) {
      case "routine": return "🔧";
      case "repair": return "⚠️";
      case "inspection": return "🔍";
      case "emergency": return "🚨";
      default: return "🔧";
    }
  };

  const formatCurrency = (amount: number) => `£${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          {activeTab === "records" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Maintenance Record
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("records")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "records"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Maintenance Records ({records.length})
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "schedule"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Maintenance Schedule
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "records" ? (
              <div>
                <div className="mb-6">
                  <div className="flex space-x-4">
                    {["all", "scheduled", "in_progress", "completed", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status as typeof filter)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          filter === status
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance records</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {filter === "all" ? "Start by adding your first maintenance record." : `No ${filter.replace("_", " ")} records found.`}
                      </p>
                    </div>
                  ) : (
                    filteredRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <span className="text-2xl mr-3">{getTypeIcon(record.type)}</span>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {record.car.year} {record.car.make} {record.car.model}
                              </h3>
                              <p className="text-sm text-gray-600">{record.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                              {record.status.replace("_", " ").toUpperCase()}
                            </span>
                            {record.status === "scheduled" && (
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: record.id, status: "in_progress" })}
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                              >
                                Start
                              </button>
                            )}
                            {record.status === "in_progress" && (
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: record.id, status: "completed" })}
                                className="text-green-600 hover:text-green-500 text-sm font-medium"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Service Provider:</strong> {record.serviceProvider}</p>
                            <p><strong>Scheduled:</strong> {new Date(record.scheduledDate).toLocaleDateString()}</p>
                            {record.completedDate && (
                              <p><strong>Completed:</strong> {new Date(record.completedDate).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div>
                            <p><strong>Cost:</strong> {formatCurrency(record.cost)}</p>
                            <p><strong>Mileage:</strong> {record.mileage.toLocaleString()} miles</p>
                            <p><strong>Type:</strong> {record.type.charAt(0).toUpperCase() + record.type.slice(1)}</p>
                          </div>
                          <div>
                            {record.notes && (
                              <p><strong>Notes:</strong> {record.notes}</p>
                            )}
                            {record.receipts.length > 0 && (
                              <p><strong>Receipts:</strong> {record.receipts.length} file(s)</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {schedules.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance schedules</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Maintenance schedules for your cars will appear here.
                    </p>
                  </div>
                ) : (
                  schedules.map((schedule, index) => {
                    const car = cars.find(c => c.id === schedule.carId);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {car?.year} {car?.make} {car?.model}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl mb-2">🛢️</div>
                            <p className="text-sm font-medium text-gray-900">Next Oil Change</p>
                            <p className="text-sm text-gray-600">
                              {new Date(schedule.nextOilChange).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl mb-2">🔍</div>
                            <p className="text-sm font-medium text-gray-900">Next Inspection</p>
                            <p className="text-sm text-gray-600">
                              {new Date(schedule.nextInspection).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl mb-2">🔄</div>
                            <p className="text-sm font-medium text-gray-900">Tire Rotation</p>
                            <p className="text-sm text-gray-600">
                              {new Date(schedule.nextTireRotation).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {schedule.upcomingServices.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Upcoming Services</h4>
                            <div className="space-y-2">
                              {schedule.upcomingServices.map((service, serviceIndex) => (
                                <div key={serviceIndex} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                  <span className="text-sm text-gray-900">{service.type}</span>
                                  <div className="text-sm text-gray-600">
                                    <span>{new Date(service.dueDate).toLocaleDateString()}</span>
                                    <span className="ml-2">or {service.dueMileage.toLocaleString()} miles</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add Maintenance Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Add Maintenance Record</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car</label>
                  <select
                    value={form.carId}
                    onChange={(e) => setForm(prev => ({ ...prev, carId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as MaintenanceRecord["type"] }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="routine">Routine</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                    <input
                      type="number"
                      value={form.cost}
                      onChange={(e) => setForm(prev => ({ ...prev, cost: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                    <input
                      type="number"
                      value={form.mileage}
                      onChange={(e) => setForm(prev => ({ ...prev, mileage: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Provider</label>
                  <input
                    type="text"
                    value={form.serviceProvider}
                    onChange={(e) => setForm(prev => ({ ...prev, serviceProvider: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addRecordMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {addRecordMutation.isPending ? "Adding..." : "Add Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
