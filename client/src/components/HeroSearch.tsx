import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Search, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users,
  Clock
} from 'lucide-react';
import Calendar from './Calendar';

interface HeroSearchProps {
  onDatesChange?: (dates: { start: Date | null; end: Date | null }) => void;
  initialDates?: { start: Date | null; end: Date | null };
}

export default function HeroSearch({ onDatesChange, initialDates }: HeroSearchProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>(
    initialDates || { start: null, end: null }
  );
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedDates({ start, end });
    onDatesChange?.({ start, end });
    // Don't auto-close - let user manually close or use the confirm button
  };

  const handleSearch = () => {
    try {
      const params = new URLSearchParams();
      if (searchLocation) params.set('location', searchLocation);
      if (selectedDates.start) params.set('startDate', selectedDates.start.toISOString());
      if (selectedDates.end) params.set('endDate', selectedDates.end.toISOString());
      if (guests > 1) params.set('guests', guests.toString());
      
      window.location.href = `/cars?${params.toString()}`;
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getDateRangeText = () => {
    if (!selectedDates.start) return 'Start Date';
    if (!selectedDates.end) return 'End Date';
    
    const start = selectedDates.start.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
    const end = selectedDates.end.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
    
    return `${start} - ${end}`;
  };

  const getDuration = () => {
    if (!selectedDates.start || !selectedDates.end) return null;
    
    const diffTime = Math.abs(selectedDates.end.getTime() - selectedDates.start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="relative z-10 px-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg max-w-sm mx-auto p-3 sm:max-w-4xl sm:p-6 sm:rounded-xl relative z-10 touch-manipulation">
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:items-end">
          {/* Location */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Location</span>
              <span className="sm:hidden">Where</span>
            </label>
            <Input
              placeholder="Enter location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-10 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Start Date</span>
              <span className="sm:hidden">From</span>
            </label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full justify-start h-8 sm:h-10 text-left touch-manipulation text-xs sm:text-sm border-gray-300"
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {selectedDates.start ? (
                <span className="text-xs sm:text-sm">
                  {selectedDates.start.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              ) : (
                <span className="text-gray-600 text-xs sm:text-sm">Start Date</span>
              )}
            </Button>
          </div>

          {/* End Date */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1 sm:gap-2">
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">End Date</span>
              <span className="sm:hidden">To</span>
            </label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full justify-start h-8 sm:h-10 text-left text-xs sm:text-sm border-gray-300"
            >
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {selectedDates.end ? (
                <span className="text-xs sm:text-sm">
                  {selectedDates.end.toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              ) : (
                <span className="text-gray-600 text-xs sm:text-sm">End Date</span>
              )}
            </Button>
          </div>

          {/* Search Button */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700 opacity-0">
              Action
            </label>
            <Button 
              onClick={handleSearch}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-md transition-colors h-8 sm:h-10 text-xs sm:text-sm"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Search Cars</span>
              <span className="sm:hidden">Search</span>
            </Button>
          </div>
        </div>

        {/* Calendar Popup */}
        {showCalendar && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
              onClick={(e) => {
                e.stopPropagation();
                setShowCalendar(false);
              }}
            />
            {/* Calendar */}
            <div 
              className="fixed z-[9999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-sm mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                selectedDates={selectedDates}
                onDateSelect={handleDateSelect}
                onClose={() => setShowCalendar(false)}
                className="w-full"
              />
            </div>
          </>
        )}

        {/* Quick Info */}
        {selectedDates.start && selectedDates.end && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-green-700">
                  <CalendarIcon className="h-3 w-3" />
                  {getDateRangeText()}
                </span>
                <span className="flex items-center gap-1 text-green-700">
                  <Users className="h-3 w-3" />
                  {guests} guest{guests !== 1 ? 's' : ''}
                </span>
                {getDuration() && (
                  <span className="flex items-center gap-1 text-green-700">
                    <Clock className="h-3 w-3" />
                    {getDuration()} day{getDuration() !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleSearch}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Search Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
