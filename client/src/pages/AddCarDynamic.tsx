import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  Car as CarIcon,
  Upload,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Users,
  DollarSign,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Star,
  Zap,
  Mountain,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CarForm {
  title: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  location: string;
  description: string;
  features: string[];
  images: File[];
  availabilityStart: string;
  availabilityEnd: string;
  mileage: number;
  condition: string;
  insurance: boolean;
  gps: boolean;
  bluetooth: boolean;
  airConditioning: boolean;
  parkingSensors: boolean;
  sunroof: boolean;
}

const initialForm: CarForm = {
  title: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  fuelType: 'petrol',
  transmission: 'automatic',
  seats: 5,
  pricePerDay: 50,
  location: '',
  description: '',
  features: [],
  images: [],
  availabilityStart: '',
  availabilityEnd: '',
  mileage: 0,
  condition: 'excellent',
  insurance: true,
  gps: false,
  bluetooth: true,
  airConditioning: true,
  parkingSensors: false,
  sunroof: false
};

const fuelTypes = [
  { value: 'petrol', label: 'Petrol', icon: Fuel, color: 'text-red-600' },
  { value: 'diesel', label: 'Diesel', icon: Fuel, color: 'text-blue-600' },
  { value: 'electric', label: 'Electric', icon: Zap, color: 'text-green-600' },
  { value: 'hybrid', label: 'Hybrid', icon: Zap, color: 'text-purple-600' }
];

const transmissionTypes = [
  { value: 'automatic', label: 'Automatic', icon: Settings },
  { value: 'manual', label: 'Manual', icon: Settings }
];

const conditions = [
  { value: 'excellent', label: 'Excellent', color: 'text-green-600' },
  { value: 'good', label: 'Good', color: 'text-blue-600' },
  { value: 'fair', label: 'Fair', color: 'text-yellow-600' }
];

const features = [
  { id: 'insurance', label: 'Insurance Included', icon: Shield },
  { id: 'gps', label: 'GPS Navigation', icon: MapPin },
  { id: 'bluetooth', label: 'Bluetooth', icon: Star },
  { id: 'airConditioning', label: 'Air Conditioning', icon: Zap },
  { id: 'parkingSensors', label: 'Parking Sensors', icon: AlertCircle },
  { id: 'sunroof', label: 'Sunroof', icon: Mountain }
];

export default function AddCarDynamic() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState<CarForm>(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  const handleChange = (field: keyof CarForm) => (value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setForm(prev => ({
      ...prev,
      [featureId]: !prev[featureId as keyof CarForm]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) newErrors.title = 'Car title is required';
    if (!form.make.trim()) newErrors.make = 'Make is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';
    if (form.year < 2000 || form.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (form.pricePerDay < 10) newErrors.pricePerDay = 'Price must be at least £10';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCarMutation = useMutation({
    mutationFn: async (carData: any) => {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(carData).forEach(([key, value]) => {
        if (key === 'images') {
          // Append all images with the same field name 'images' for multer
          carData.images.forEach((file: File) => {
            formData.append('images', file);
          });
        } else if (key === 'features') {
          formData.append('features', JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('/api/cars', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create car');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Error creating car:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    
    try {
      await createCarMutation.mutateAsync({
        ...form,
        ownerId: user?.id,
        features: Object.entries(form)
          .filter(([key, value]) => features.some(f => f.id === key) && value)
          .map(([key]) => key)
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/dashboard')}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
              <CarIcon className="w-10 h-10 text-blue-600" />
              Add Your Car
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </h1>
            <p className="text-gray-600 text-lg">Share your car and start earning money</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Basic Information' :
                currentStep === 2 ? 'Car Details' :
                currentStep === 3 ? 'Features & Availability' :
                'Photos & Review'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CarIcon className="w-6 h-6 text-blue-600" />
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                        Car Title *
                      </Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => handleChange('title')(e.target.value)}
                        placeholder="e.g., 2020 BMW 3 Series"
                        className="mt-2"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="make" className="text-sm font-semibold text-gray-700">
                        Make *
                      </Label>
                      <Input
                        id="make"
                        value={form.make}
                        onChange={(e) => handleChange('make')(e.target.value)}
                        placeholder="e.g., BMW"
                        className="mt-2"
                      />
                      {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
                    </div>

                    <div>
                      <Label htmlFor="model" className="text-sm font-semibold text-gray-700">
                        Model *
                      </Label>
                      <Input
                        id="model"
                        value={form.model}
                        onChange={(e) => handleChange('model')(e.target.value)}
                        placeholder="e.g., 3 Series"
                        className="mt-2"
                      />
                      {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                    </div>

                    <div>
                      <Label htmlFor="year" className="text-sm font-semibold text-gray-700">
                        Year *
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        value={form.year}
                        onChange={(e) => handleChange('year')(parseInt(e.target.value))}
                        min="2000"
                        max={new Date().getFullYear() + 1}
                        className="mt-2"
                      />
                      {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                        Location *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="location"
                          value={form.location}
                          onChange={(e) => handleChange('location')(e.target.value)}
                          placeholder="e.g., London, UK"
                          className="pl-10"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                      <Label htmlFor="pricePerDay" className="text-sm font-semibold text-gray-700">
                        Price Per Day (£) *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="pricePerDay"
                          type="number"
                          value={form.pricePerDay}
                          onChange={(e) => handleChange('pricePerDay')(parseFloat(e.target.value))}
                          min="10"
                          step="0.01"
                          className="pl-10"
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      {errors.pricePerDay && <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange('description')(e.target.value)}
                      placeholder="Describe your car, its condition, and what makes it special..."
                      className="mt-2 min-h-[120px]"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Car Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Car Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Fuel Type *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {fuelTypes.map(({ value, label, icon: Icon, color }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={form.fuelType === value ? "default" : "outline"}
                            onClick={() => handleChange('fuelType')(value)}
                            className={`h-12 flex flex-col items-center gap-1 ${
                              form.fuelType === value ? 'bg-blue-600 text-white' : ''
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${form.fuelType === value ? 'text-white' : color}`} />
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Transmission *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {transmissionTypes.map(({ value, label, icon: Icon }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={form.transmission === value ? "default" : "outline"}
                            onClick={() => handleChange('transmission')(value)}
                            className={`h-12 flex flex-col items-center gap-1 ${
                              form.transmission === value ? 'bg-blue-600 text-white' : ''
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="seats" className="text-sm font-semibold text-gray-700">
                        Number of Seats *
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="seats"
                          type="number"
                          value={form.seats}
                          onChange={(e) => handleChange('seats')(parseInt(e.target.value))}
                          min="2"
                          max="9"
                          className="pl-10"
                        />
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mileage" className="text-sm font-semibold text-gray-700">
                        Mileage (miles)
                      </Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={form.mileage}
                        onChange={(e) => handleChange('mileage')(parseInt(e.target.value))}
                        min="0"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                        Condition *
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {conditions.map(({ value, label, color }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={form.condition === value ? "default" : "outline"}
                            onClick={() => handleChange('condition')(value)}
                            className={`h-10 ${form.condition === value ? 'bg-blue-600 text-white' : ''}`}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Features & Availability */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-blue-600" />
                    Features & Availability
                  </h2>
                  
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                      Car Features
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {features.map(({ id, label, icon: Icon }) => (
                        <Button
                          key={id}
                          type="button"
                          variant={form[id as keyof CarForm] ? "default" : "outline"}
                          onClick={() => handleFeatureToggle(id)}
                          className={`h-16 flex flex-col items-center gap-2 ${
                            form[id as keyof CarForm] ? 'bg-blue-600 text-white' : ''
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs text-center">{label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                      Availability Period
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Available From</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={form.availabilityStart ? new Date(form.availabilityStart).toLocaleDateString('en-GB') : ''}
                            placeholder="Select start date"
                            readOnly
                            onClick={() => setShowCalendar(true)}
                            className="cursor-pointer"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Available Until</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={form.availabilityEnd ? new Date(form.availabilityEnd).toLocaleDateString('en-GB') : ''}
                            placeholder="Select end date"
                            readOnly
                            onClick={() => setShowCalendar(true)}
                            className="cursor-pointer"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Photos & Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    Photos & Review
                  </h2>
                  
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                      Upload Photos *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Upload high-quality photos of your car</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Choose Photos
                      </Button>
                    </div>
                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    
                    {form.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {form.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Listing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Title:</span>
                        <span className="ml-2 text-gray-900">{form.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2 text-gray-900">{form.location}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <span className="ml-2 text-gray-900">£{form.pricePerDay}/day</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Seats:</span>
                        <span className="ml-2 text-gray-900">{form.seats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Listing...
                      </div>
                    ) : (
                      'Create Listing'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Beautiful Calendar Modal */}
        {showCalendar && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setShowCalendar(false)}
            />
            <div 
              className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Select Availability Dates</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="availabilityStart">Start Date</Label>
                  <Input
                    id="availabilityStart"
                    type="date"
                    value={form.availabilityStart}
                    onChange={(e) => setForm(prev => ({ ...prev, availabilityStart: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availabilityEnd">End Date</Label>
                  <Input
                    id="availabilityEnd"
                    type="date"
                    value={form.availabilityEnd}
                    onChange={(e) => setForm(prev => ({ ...prev, availabilityEnd: e.target.value }))}
                    min={form.availabilityStart || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCalendar(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowCalendar(false)}
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
