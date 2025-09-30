import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";
import { getSpecificCarImage } from "../utils/carImages";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, MapPin, Heart, Trash2, Eye, Calendar } from "lucide-react";
import Footer from "../components/Footer";

interface FavoriteCar {
  id: string;
  carId: string;
  car: {
    make: string;
    model: string;
    year: number;
    pricePerDay: number;
    location: string;
    images: string[];
    rating: number;
    reviewCount: number;
    features: string[];
    available: boolean;
  };
  addedAt: string;
}

export default function Favorites() {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<"recent" | "price" | "rating">("recent");

  const { data: favorites = [], isLoading } = useQuery<FavoriteCar[]>({
    queryKey: ["/api/favorites"],
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (carId: string) => {
      await apiRequest("DELETE", `/api/favorites/${carId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.car.pricePerDay - b.car.pricePerDay;
      case "rating":
        return b.car.rating - a.car.rating;
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  const formatCurrency = (amount: number) => `£${amount}`;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">My Favorites</h1>
          <p className="text-xl text-gray-700 font-medium">
            {favorites.length} saved car{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Sort Controls */}
        {favorites.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="recent">Recently Added</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-lg text-gray-700 font-medium mb-8 max-w-md mx-auto">
              Start browsing cars and save your favorites for easy access.
            </p>
            <Link href="/cars">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Cars
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={getSpecificCarImage(favorite.car)}
                    alt={`${favorite.car.make} ${favorite.car.model}`}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/CLASSIC.png';
                    }}
                  />
                  <Button
                    onClick={() => removeFavoriteMutation.mutate(favorite.carId)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {!favorite.car.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm font-semibold px-4 py-2">
                        Currently Unavailable
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {favorite.car.year} {favorite.car.make} {favorite.car.model}
                      </h3>
                      <div className="flex items-center text-gray-600 font-medium">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{favorite.car.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold text-gray-700">
                        {favorite.car.rating} ({favorite.car.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {favorite.car.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {favorite.car.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{favorite.car.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        {formatCurrency(favorite.car.pricePerDay)}
                      </span>
                      <span className="text-gray-600 font-medium">/day</span>
                    </div>
                    <Link href={`/cars/${favorite.carId}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Added {new Date(favorite.addedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <Heart className="w-4 h-4 mr-1 fill-current" />
                      <span>Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
