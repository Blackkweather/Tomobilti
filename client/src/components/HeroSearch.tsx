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

export default function HeroSearch() {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    console.log('Date selected:', { start, end });
    setSelectedDates({ start, end });
    if (start && end) {
      setShowCalendar(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (selectedDates.start) params.set('startDate', selectedDates.start.toISOString());
    if (selectedDates.end) params.set('endDate', selectedDates.end.toISOString());
    if (guests > 1) params.set('guests', guests.toString());
    
    window.location.href = `/cars?${params.toString()}`;
  };

  const getDateRangeText = () => {
    if (!selectedDates.start) return 'Start Date';
    if (!selectedDates.end) return 'End Date';
    
    const start = selectedDates.start.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
    const end = selectedDates.end.toLocaleDateString('en-GB', { 
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
    <div className="relative">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl max-w-4xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              placeholder="London, Manchester, Birmingham..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Start Date
            </label>
            <Button
              variant="outline"
              onClick={() => {
                console.log('Calendar button clicked, current state:', showCalendar);
                setShowCalendar(!showCalendar);
              }}
              className="w-full justify-start h-10 text-left"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDates.start ? (
                <span>
                  {selectedDates.start.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              ) : (
                <span className="text-gray-500">Start Date</span>
              )}
            </Button>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              End Date
            </label>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full justify-start h-10 text-left"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDates.end ? (
                <span>
                  {selectedDates.end.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              ) : (
                <span className="text-gray-500">End Date</span>
              )}
            </Button>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 opacity-0">
              Action
            </label>
            <Button 
              onClick={handleSearch}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors h-10"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Cars
            </Button>
          </div>
        </div>

        {/* Calendar Popup */}
        {showCalendar && (
          <div className="absolute z-50 mt-4 left-1/2 transform -translate-x-1/2">
            <Calendar
              selectedDates={selectedDates}
              onDateSelect={handleDateSelect}
              className="shadow-2xl"
            />
          </div>
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
