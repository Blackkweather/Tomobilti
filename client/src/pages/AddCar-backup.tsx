import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { carApi } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Car } from "lucide-react";
import ImageUpload from "../components/ImageUpload";

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
  images: string[];
}

const FEATURES = [
  "Air Conditioning", "Bluetooth", "GPS Navigation", "Backup Camera",
  "Heated Seats", "Sunroof", "USB Ports", "Wireless Charging",
  "Premium Sound", "Leather Seats", "Cruise Control", "Keyless Entry"
];

export default function AddCar() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();

  console.log('AddCar component loaded:', { isAuthenticated, user });

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('User not authenticated, showing login prompt');
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
  
  console.log('User authenticated, rendering main form');
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
    images: [],
  });
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
      setLocation("/dashboard/owner");
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
    if (form.images.length === 0) {
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
      form.images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      addCarMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof CarForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? 
      (e.target as HTMLInputElement).checked : 
      e.target.value;
    
    if (field === 'year' || field === 'pricePerDay' || field === 'seats' || field === 'mileage') {
      setForm(prev => ({ ...prev, [field]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-mauve-50 via-white to-bleu-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-mauve-500/10 to-bleu-500/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-mauve-500 to-bleu-500 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-mauve-600 to-bleu-600 bg-clip-text text-transparent">
                  Add New Vehicle
                </h1>
                <p className="text-muted-foreground mt-1">List your car and start earning</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Make</label>
                <input
                  type="text"
                  value={form.make}
                  onChange={handleChange("make")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Toyota, Honda, BMW..."
                />
                {errors.make && <p className="mt-2 text-sm text-red-600 font-medium">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Model</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={handleChange("model")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Camry, Civic, X3..."
                />
                {errors.model && <p className="mt-2 text-sm text-red-600 font-medium">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={handleChange("year")}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                {errors.year && <p className="mt-2 text-sm text-red-600 font-medium">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Price per Day (£)</label>
                <input
                  type="number"
                  value={form.pricePerDay}
                  onChange={handleChange("pricePerDay")}
                  min="1"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
                {errors.pricePerDay && <p className="mt-2 text-sm text-red-600 font-medium">{errors.pricePerDay}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Fuel Type</label>
                <select
                  value={form.fuelType}
                  onChange={handleChange("fuelType")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Transmission</label>
                <select
                  value={form.transmission}
                  onChange={handleChange("transmission")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Number of Seats</label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={handleChange("seats")}
                  min="2"
                  max="8"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Mileage</label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={handleChange("mileage")}
                  min="0"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="e.g., 50000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="City, State/Region"
                />
                {errors.location && <p className="mt-2 text-sm text-red-600 font-medium">{errors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">License Plate</label>
                <input
                  type="text"
                  value={form.licensePlate}
                  onChange={handleChange("licensePlate")}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="e.g., ABC123"
                />
                {errors.licensePlate && <p className="mt-2 text-sm text-red-600 font-medium">{errors.licensePlate}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Description</label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Describe your vehicle, its condition, and any special features..."
                />
                {errors.description && <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {FEATURES.map((feature) => (
                    <label key={feature} className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-mauve-300 hover:bg-mauve-50 transition-all duration-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="h-4 w-4 text-mauve-600 focus:ring-mauve-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  images={form.images}
                  onImagesChange={(images) => setForm(prev => ({ ...prev, images }))}
                  maxImages={10}
                />
                {errors.images && <p className="mt-2 text-sm text-red-600 font-medium">{errors.images}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
              <Button
                type="button"
                onClick={() => setLocation("/dashboard/owner")}
                variant="outline"
                className="px-8 py-3 border-2 border-gray-200 hover:border-mauve-300 hover:bg-mauve-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addCarMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-mauve-500 to-bleu-500 hover:from-mauve-600 hover:to-bleu-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {addCarMutation.isPending ? "Adding Vehicle..." : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}













