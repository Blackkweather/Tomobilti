import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TripProtectionSelector from "./TripProtectionSelector";
import { Calendar, Clock, MapPin, Users, Tag, Truck } from "lucide-react";

interface EnhancedBookingFlowProps {
  car: any;
  onComplete: (bookingData: any) => void;
}

export default function EnhancedBookingFlow({ car, onComplete }: EnhancedBookingFlowProps) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [protectionTier, setProtectionTier] = useState<"basic" | "standard" | "premium">("basic");
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalDrivers, setAdditionalDrivers] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const basePrice = car.pricePerDay * days;
    const protectionCost = {
      basic: basePrice * 0.10,
      standard: basePrice * 0.20,
      premium: basePrice * 0.35
    }[protectionTier];
    const deliveryFee = deliveryRequested ? (car.deliveryFee || 25) : 0;
    const serviceFee = basePrice * 0.10;
    return basePrice + protectionCost + deliveryFee + serviceFee;
  };

  const handleComplete = () => {
    onComplete({
      startDate,
      endDate,
      startTime,
      endTime,
      protectionTier,
      deliveryRequested,
      deliveryAddress,
      additionalDrivers,
      promoCode,
      totalAmount: calculateTotal()
    });
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Dates & Times */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Select Dates & Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-purple-600 hover:bg-purple-700">
              Continue to Protection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Trip Protection */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6">
            <TripProtectionSelector
              selectedTier={protectionTier}
              onSelect={setProtectionTier}
              dailyRate={car.pricePerDay}
            />
            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Continue to Extras
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Extras */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-purple-600" />
              Add Extras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {car.deliveryAvailable && (
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={deliveryRequested}
                    onChange={(e) => setDeliveryRequested(e.target.checked)}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Delivery to your location</div>
                    <div className="text-sm text-gray-600">
                      £{car.deliveryFee || 25} - We'll bring the car to you
                    </div>
                  </div>
                </label>
                {deliveryRequested && (
                  <Input
                    placeholder="Delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="mt-3"
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Promo Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Review Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Trip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>£{car.pricePerDay} × {calculateDays()} days</span>
                <span>£{(car.pricePerDay * calculateDays()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Trip Protection ({protectionTier})</span>
                <span>£{(car.pricePerDay * calculateDays() * {basic: 0.10, standard: 0.20, premium: 0.35}[protectionTier]).toFixed(2)}</span>
              </div>
              {deliveryRequested && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>£{car.deliveryFee || 25}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>£{(car.pricePerDay * calculateDays() * 0.10).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>£{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1 bg-purple-600 hover:bg-purple-700">
                Confirm & Pay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
