import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "../lib/queryClient";
import { getSpecificCarImage } from "../utils/carImages";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Star, MapPin, Heart, Trash2, Eye, Calendar, Filter, Search, Share2, X, CheckSquare, Square } from "lucide-react";


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
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedFavorites, setSelectedFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter favorites
  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = 
      fav.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.car.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && fav.car.pricePerDay < 100) ||
      (priceFilter === "mid" && fav.car.pricePerDay >= 100 && fav.car.pricePerDay < 200) ||
      (priceFilter === "high" && fav.car.pricePerDay >= 200);
    
    const matchesLocation = locationFilter === "all" || fav.car.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesLocation;
  });

  // Sort filtered favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
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

  const toggleSelect = (carId: string) => {
    const newSelected = new Set(selectedFavorites);
    if (newSelected.has(carId)) {
      newSelected.delete(carId);
    } else {
      newSelected.add(carId);
    }
    setSelectedFavorites(newSelected);
  };

  const selectAll = () => {
    if (selectedFavorites.size === sortedFavorites.length) {
      setSelectedFavorites(new Set());
    } else {
      setSelectedFavorites(new Set(sortedFavorites.map(f => f.carId)));
    }
  };

  const bulkRemove = () => {
    if (selectedFavorites.size === 0) return;
    if (window.confirm(`Remove ${selectedFavorites.size} favorite(s)?`)) {
      selectedFavorites.forEach(carId => {
        removeFavoriteMutation.mutate(carId);
      });
      setSelectedFavorites(new Set());
    }
  };

  const shareFavorites = () => {
    const carIds = sortedFavorites.map(f => f.carId).join(',');
    const shareUrl = `${window.location.origin}/cars?favorites=${carIds}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Favorites list link copied to clipboard!');
  };

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">My Favorites</h1>
          <p className="text-xl text-gray-700 font-medium">
            {filteredFavorites.length} of {favorites.length} saved car{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search and Filter Controls */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search favorites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              {/* Share */}
              <Button
                variant="outline"
                onClick={shareFavorites}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under £100/day</SelectItem>
                      <SelectItem value="mid">£100-£200/day</SelectItem>
                      <SelectItem value="high">Over £200/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter === "all" ? "" : locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value || "all")}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {favorites.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    className="flex items-center gap-2"
                  >
                    {selectedFavorites.size === sortedFavorites.length ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    {selectedFavorites.size === sortedFavorites.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedFavorites.size > 0 && (
                    <span className="text-sm text-gray-600">
                      {selectedFavorites.size} selected
                    </span>
                  )}
                </div>
                {selectedFavorites.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={bulkRemove}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Selected ({selectedFavorites.size})
                  </Button>
                )}
              </div>
            )}
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
          <>
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites match your filters</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setPriceFilter('all');
                    setLocationFilter('all');
                    setShowFilters(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedFavorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => toggleSelect(favorite.carId)}
                      className="absolute top-2 left-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                    >
                      {selectedFavorites.has(favorite.carId) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
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
          </>
        )}
      </div>
    </div>
  );
}
