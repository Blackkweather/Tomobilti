import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Calendar, Search } from 'lucide-react';

interface SearchFormProps {
  onDatesChange?: (dates: { start: Date | null; end: Date | null }) => void;
  initialDates?: { start: Date | null; end: Date | null };
}

export default function SearchForm({ onDatesChange, initialDates }: SearchFormProps) {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(initialDates?.start ? 
    initialDates.start.toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(initialDates?.end ? 
    initialDates.end.toISOString().split('T')[0] : '');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (onDatesChange) {
      onDatesChange({
        start: e.target.value ? new Date(e.target.value) : null,
        end: endDate ? new Date(endDate) : null
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (onDatesChange) {
      onDatesChange({
        start: startDate ? new Date(startDate) : null,
        end: e.target.value ? new Date(e.target.value) : null
      });
    }
  };

  const handleSearch = () => {
    // Redirect to cars page with search parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    window.location.href = `/cars${params.toString() ? '?' + params.toString() : ''}`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Location Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </label>
          <Input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Start Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Start Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full"
          />
        </div>

        {/* End Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            End Date
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="w-full"
            min={startDate}
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 h-fit rounded-lg flex items-center justify-center font-semibold"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Cars
        </Button>
      </div>
    </div>
  );
}
