import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Star, MapPin, Users, Fuel } from "lucide-react";
import { Link } from "wouter";
import { carApi } from "../lib/api";
import type { Car } from "@shared/schema";

interface SimilarCarsProps {
  currentCarId: string;
  make: string;
  pricePerDay: number;
  city: string;
}

export default function SimilarCars({ currentCarId, make, pricePerDay, city }: SimilarCarsProps) {
  const { data: cars } = useQuery({
    queryKey: ["similarCars", currentCarId],
    queryFn: async () => {
      const result = await carApi.searchCars({
        city,
        minPrice: pricePerDay * 0.7,
        maxPrice: pricePerDay * 1.3,
        limit: 4
      });
      return result.cars.filter((car: Car) => car.id !== currentCarId).slice(0, 3);
    }
  });

  if (!cars || cars.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Similar Cars You Might Like</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cars.map((car: Car) => (
            <Link key={car.id} href={`/cars/${car.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
                    {car.images && car.images.length > 0 ? (
                      <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{car.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{car.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        £{car.pricePerDay}<span className="text-sm text-gray-600">/day</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
