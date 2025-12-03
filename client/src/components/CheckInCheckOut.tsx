import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Camera, Upload, Fuel, Gauge } from "lucide-react";

interface CheckInCheckOutProps {
  type: "checkin" | "checkout";
  bookingId: string;
  onSubmit: (data: CheckInCheckOutData) => void;
}

export interface CheckInCheckOutData {
  photos: string[];
  mileage: number;
  fuelLevel: number;
  notes: string;
  damageReported: boolean;
  damageDescription?: string;
  damagePhotos?: string[];
}

export default function CheckInCheckOut({ type, bookingId, onSubmit }: CheckInCheckOutProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [mileage, setMileage] = useState("");
  const [fuelLevel, setFuelLevel] = useState("100");
  const [notes, setNotes] = useState("");
  const [damageReported, setDamageReported] = useState(false);
  const [damageDescription, setDamageDescription] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In production, upload to Cloudinary
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      photos,
      mileage: parseInt(mileage),
      fuelLevel: parseInt(fuelLevel),
      notes,
      damageReported,
      damageDescription: damageReported ? damageDescription : undefined,
      damagePhotos: damageReported ? photos : undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2 text-purple-600" />
          {type === "checkin" ? "Check-In" : "Check-Out"} Documentation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Photos (Required)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload photos</p>
              <p className="text-xs text-gray-500 mt-1">Front, back, sides, interior, dashboard</p>
            </label>
          </div>
          {photos.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {photos.map((photo, idx) => (
                <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Current Mileage
          </label>
          <Input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter mileage"
          />
        </div>

        {/* Fuel Level */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            Fuel Level: {fuelLevel}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="25"
            value={fuelLevel}
            onChange={(e) => setFuelLevel(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Empty</span>
            <span>1/4</span>
            <span>1/2</span>
            <span>3/4</span>
            <span>Full</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations or concerns..."
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Damage Report */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={damageReported}
              onChange={(e) => setDamageReported(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Report damage or issues</span>
          </label>
          {damageReported && (
            <textarea
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              placeholder="Describe the damage..."
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-2"
            />
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700">
          Complete {type === "checkin" ? "Check-In" : "Check-Out"}
        </Button>
      </CardContent>
    </Card>
  );
}
