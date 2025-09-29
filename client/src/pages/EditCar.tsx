import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carApi } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Car, X, Plus, Upload } from "lucide-react";

interface Car {
  id: string;
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

export default function EditCar() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<Omit<Car, "id" | "images">>({
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
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Car>>({});

  const { data: car, isLoading } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carApi.getCar(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (car) {
      console.log('Car data loaded:', car);
      console.log('Car images:', car.images);
      console.log('Car features:', car.features);
      const { id, images, ...carData } = car;
      setForm({
        make: carData.make || "",
        model: carData.model || "",
        year: carData.year || new Date().getFullYear(),
        pricePerDay: carData.pricePerDay || 0,
        location: carData.location || "",
        description: carData.description || "",
        features: Array.isArray(carData.features) ? carData.features : [],
        fuelType: carData.fuelType || "gasoline",
        transmission: carData.transmission || "automatic",
        seats: carData.seats || 5,
        mileage: carData.mileage || 0,
        licensePlate: carData.licensePlate || "",
      });
      console.log('Setting existing images:', images);
      console.log('Setting features:', Array.isArray(carData.features) ? carData.features : []);
      setExistingImages(images || []);
    }
  }, [car]);

  const updateCarMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Mutation started with data:', data);
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (key === 'features') {
          console.log('Adding features:', data[key]);
          formData.append(key, JSON.stringify(data[key]));
        } else if (key === 'images') {
          // Handle images separately - combine existing and new
          const allImages = [...existingImages, ...newImages.map(file => URL.createObjectURL(file))];
          console.log('Adding images:', allImages);
          formData.append(key, JSON.stringify(allImages));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Add new images as files
      newImages.forEach((file, index) => {
        console.log('Adding file:', file.name);
        formData.append('images', file);
      });
      
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData,
        credentials: "include"
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update car' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to update car');
      }
      const result = await response.json();
      console.log('Success response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      queryClient.invalidateQueries({ queryKey: ['car', id] });
      queryClient.invalidateQueries({ queryKey: ['cars', 'owner'] });
      setLocation("/dashboard/owner");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      setErrors({ make: error.message });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Car> = {};

    if (!form.make?.trim()) newErrors.make = "Make is required";
    if (!form.model?.trim()) newErrors.model = "Model is required";
    if (form.year < 1990 || form.year > new Date().getFullYear() + 1) {
      newErrors.year = "Invalid year";
    }
    if (form.pricePerDay <= 0) newErrors.pricePerDay = "Price must be greater than 0";
    if (!form.location?.trim()) newErrors.location = "Location is required";
    if (!form.description?.trim()) newErrors.description = "Description is required";
    if (!form.licensePlate?.trim()) newErrors.licensePlate = "License plate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', form);
    console.log('New images:', newImages);
    console.log('Existing images:', existingImages);
    
    if (validateForm()) {
      console.log('Form validation passed');
      // Prepare the update data
      const updateData = {
        ...form,
        // Convert pricePerDay to string as expected by the schema
        pricePerDay: form.pricePerDay.toString(),
        // Add required fields that might be missing
        title: `${form.make} ${form.model}`,
        city: form.location,
        currency: 'GBP'
      };
      
      console.log('Submitting update data:', updateData);
      console.log('New images:', newImages);
      console.log('Existing images:', existingImages);
      
      updateCarMutation.mutate(updateData);
    } else {
      console.log('Form validation failed');
    }
  };

  const handleChange = (field: keyof typeof form) => (
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
      features: (prev.features || []).includes(feature)
        ? (prev.features || []).filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files].slice(0, 10));
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  };

  const clearAllNewImages = () => {
    setNewImages([]);
  };

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
              You need to be logged in to edit a car. Please sign in or create an account.
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-mauve-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900">Car not found</h2>
            <p className="text-muted-foreground">The car you're looking for doesn't exist or you don't have permission to edit it.</p>
            <Button
              onClick={() => setLocation("/dashboard/owner")}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  Edit Vehicle
                </h1>
                <p className="text-muted-foreground mt-1">Update your car details</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($)</label>
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
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {FEATURES.map((feature) => {
                  const isChecked = Array.isArray(form.features) && form.features.includes(feature);
                  console.log(`Feature ${feature}:`, isChecked, 'Form features:', form.features);
                  return (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFeatureToggle(feature)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Debug: Features count: {Array.isArray(form.features) ? form.features.length : 'Not array'}, 
                Features: {JSON.stringify(form.features)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
              {console.log('Rendering existing images:', existingImages)}
              {existingImages.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {existingImages.map((image, index) => {
                      console.log(`Rendering image ${index}:`, image);
                      return (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Car image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                            onError={(e) => {
                              console.error(`Failed to load image ${index}:`, image);
                              console.error('Image error:', e);
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded image ${index}:`, image);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Removing existing image:', image);
                              removeExistingImage(image);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 shadow-lg"
                            title="Remove this image"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Click the × button on any image to remove it individually
                  </p>
                </>
              ) : (
                <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
                  <p className="text-sm text-gray-500">No existing images</p>
                  <p className="text-xs text-gray-400 mt-1">Add new images below</p>
                </div>
              )}
              
              <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Removing new image:', file.name);
                            removeNewImage(index);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 shadow-lg"
                          title="Remove this image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{newImages.length} new image(s) selected</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200/50">
              <Button
                type="button"
                onClick={() => {
                  console.log('=== DEBUG INFO ===');
                  console.log('Car data:', car);
                  console.log('Form data:', form);
                  console.log('Features:', form.features);
                  console.log('Existing images:', existingImages);
                  console.log('New images:', newImages);
                  console.log('Mutation state:', {
                    isPending: updateCarMutation.isPending,
                    error: updateCarMutation.error,
                    isError: updateCarMutation.isError
                  });
                  console.log('==================');
                }}
                variant="outline"
                className="px-4 py-2 text-sm"
              >
                Debug Info
              </Button>
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
                disabled={updateCarMutation.isPending}
                onClick={(e) => {
                  console.log('Button clicked!');
                  console.log('Mutation pending:', updateCarMutation.isPending);
                  console.log('Mutation error:', updateCarMutation.error);
                }}
                className="px-8 py-3 bg-gradient-to-r from-mauve-500 to-bleu-500 hover:from-mauve-600 hover:to-bleu-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {updateCarMutation.isPending ? "Updating Vehicle..." : "Update Vehicle"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}