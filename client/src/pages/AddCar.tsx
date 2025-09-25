import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield } from "lucide-react";

interface CarForm {
  make: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  description: string;
  features: string[];
  fuelType: string;
  transmission: string;
  seats: number;
  mileage: number;
  licensePlate: string;
}

const FEATURES = [
  "Air Conditioning", "Bluetooth", "GPS Navigation", "Backup Camera",
  "Heated Seats", "Sunroof", "USB Ports", "Wireless Charging",
  "Premium Sound", "Leather Seats", "Cruise Control", "Keyless Entry"
];

export default function AddCar() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to add a car. Please sign in or create an account to become a host.
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
              >
                Go Home
              </Button>
              <Button 
                onClick={() => setLocation('/login')}
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  const [form, setForm] = useState<CarForm>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    pricePerDay: 0,
    location: "",
    description: "",
    features: [],
    fuelType: "gasoline",
    transmission: "automatic",
    seats: 5,
    mileage: 0,
    licensePlate: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<CarForm>>({});

  const addCarMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/cars", {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add car' }));
        throw new Error(errorData.error || 'Failed to add car');
      }
      return response.json();
    },
    onSuccess: () => {
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      setErrors({ make: error.message });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CarForm> = {};

    if (!form.make.trim()) newErrors.make = "Make is required";
    if (!form.model.trim()) newErrors.model = "Model is required";
    if (form.year < 1990 || form.year > new Date().getFullYear() + 1) {
      newErrors.year = "Invalid year";
    }
    if (form.pricePerDay <= 0) newErrors.pricePerDay = "Price must be greater than 0";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    if (images.length === 0) {
      setErrors(prev => ({ ...prev, images: "At least one image is required" }));
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      addCarMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof CarForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Car</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                <input
                  type="text"
                  value={form.make}
                  onChange={handleChange("make")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Toyota, Honda, BMW..."
                />
                {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={handleChange("model")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Camry, Civic, X3..."
                />
                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={handleChange("year")}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (£)</label>
                <input
                  type="number"
                  value={form.pricePerDay}
                  onChange={handleChange("pricePerDay")}
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={form.fuelType}
                  onChange={handleChange("fuelType")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                <select
                  value={form.transmission}
                  onChange={handleChange("transmission")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={handleChange("seats")}
                  min="2"
                  max="8"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={handleChange("mileage")}
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, County"
                />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
              <input
                type="text"
                value={form.licensePlate}
                onChange={handleChange("licensePlate")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC-1234"
              />
              {errors.licensePlate && <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={handleChange("description")}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your car..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURES.map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
              {images.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">{images.length} image(s) selected</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setLocation("/car-management")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addCarMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {addCarMutation.isPending ? "Adding..." : "Add Car"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}