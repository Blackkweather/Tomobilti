import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  Check,
  Star
} from 'lucide-react';

interface BeautifulCalendarProps {
  selectedDates: { start: Date | null; end: Date | null };
  onDateSelect: (start: Date | null, end: Date | null) => void;
  onClose?: () => void;
  unavailableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  showTimeSlots?: boolean;
  showLocation?: boolean;
}

export default function BeautifulCalendar({ 
  selectedDates = { start: null, end: null }, 
  onDateSelect, 
  onClose,
  unavailableDates = [], 
  minDate,
  maxDate,
  className = '',
  showTimeSlots = true,
  showLocation = true
}: BeautifulCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00');

  const today = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      unavailable.toDateString() === date.toDateString()
    );
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates || !selectedDates.start) return false;
    const dateStr = date.toDateString();
    const startStr = selectedDates.start.toDateString();
    const endStr = selectedDates.end ? selectedDates.end.toDateString() : null;
    
    return dateStr === startStr || (endStr && dateStr === endStr);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates || !selectedDates.start || !selectedDates.end) return false;
    const dateTime = date.getTime();
    const startTime = selectedDates.start.getTime();
    const endTime = selectedDates.end.getTime();
    
    return dateTime > startTime && dateTime < endTime;
  };

  const isDateDisabled = (date: Date) => {
    const effectiveMinDate = minDate || today;
    const effectiveMaxDate = maxDate || new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    return date < effectiveMinDate || 
           date > effectiveMaxDate || 
           isDateUnavailable(date);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    // Always start fresh if no dates selected or both dates are selected
    if (!selectedDates || !selectedDates.start || (selectedDates.start && selectedDates.end)) {
      onDateSelect(date, null);
    } else if (selectedDates.start && !selectedDates.end) {
      // Complete selection
      if (date.getTime() < selectedDates.start.getTime()) {
        onDateSelect(date, selectedDates.start);
      } else {
        onDateSelect(selectedDates.start, date);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < 42; i++) {
      // Create a completely new Date object for each day
      const dayDate = new Date(startOfCalendar.getFullYear(), startOfCalendar.getMonth(), startOfCalendar.getDate() + i);
      
      const isDisabled = isDateDisabled(dayDate);
      const isSelected = isDateSelected(dayDate);
      const isInRange = isDateInRange(dayDate);
      const isToday = dayDate.toDateString() === today.toDateString();
      const isHovered = hoveredDate && dayDate.toDateString() === hoveredDate.toDateString();
      
      let buttonClass = 'relative w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-all duration-300 cursor-pointer group ';
      
      if (isDisabled) {
        buttonClass += 'text-gray-300 cursor-not-allowed bg-gray-50';
      } else if (isSelected) {
        buttonClass += 'bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-lg transform scale-105';
      } else if (isInRange) {
        buttonClass += 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-medium';
      } else if (isToday) {
        buttonClass += 'bg-gradient-to-br from-green-500 to-green-600 text-white font-bold';
      } else if (isHovered) {
        buttonClass += 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-medium transform scale-105';
      } else {
        buttonClass += 'text-gray-800 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 font-medium';
      }

      days.push(
        <button
          key={`${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`}
          className={buttonClass}
          onClick={() => handleDateClick(dayDate)}
          onMouseEnter={() => setHoveredDate(dayDate)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={isDisabled}
        >
          <span className="relative z-10">{dayDate.getDate()}</span>
          
          {/* Overlaid Icons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isSelected && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-2 h-2 text-blue-600" />
                </div>
              </div>
            )}
            {isToday && !isSelected && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-green-600" />
                </div>
              </div>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  const getSelectedDateText = () => {
    if (!selectedDates || !selectedDates.start) return 'Select start date';
    if (!selectedDates.end) return 'Select end date';
    
    const start = selectedDates.start.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
    const end = selectedDates.end.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  };

  const getDaysDifference = () => {
    if (!selectedDates || !selectedDates.start || !selectedDates.end) return 0;
    return Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`bg-white rounded-xl shadow-xl border-0 overflow-hidden w-full max-w-md mx-auto ${className}`}>
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-8 w-4 h-4 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-8 right-4 w-10 h-10 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="relative">
                <CalendarIcon className="h-6 w-6 mr-2" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold">Select Your Dates</h3>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Selected Dates Display */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-3 w-3 text-blue-200" />
              <div className="text-xs text-blue-100">Selected Period</div>
            </div>
            <div className="font-bold text-sm">{getSelectedDateText()}</div>
            {getDaysDifference() > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-blue-200" />
                <div className="text-xs text-blue-100">
                  {getDaysDifference()} {getDaysDifference() === 1 ? 'day' : 'days'} rental
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-blue-50 rounded-full h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4 text-blue-600" />
          </Button>
          
          <h2 className="text-lg font-bold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="hover:bg-blue-50 rounded-full h-8 w-8"
          >
            <ChevronRight className="h-4 w-4 text-blue-600" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {renderCalendarDays()}
        </div>

        {/* Time Slots */}
        {showTimeSlots && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-3 w-3 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Preferred Time</h3>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {timeSlots.map(time => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`text-xs h-8 ${selectedTimeSlot === time ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onDateSelect(null, null)}
            className="text-gray-600 hover:bg-gray-100 text-sm h-8"
          >
            Clear Selection
          </Button>
          <Button
            onClick={() => {
              if (selectedDates.start && selectedDates.end && onClose) {
                onClose();
              }
            }}
            disabled={!selectedDates.start || !selectedDates.end}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 text-sm h-8"
          >
            Confirm Dates
          </Button>
        </div>
      </div>
    </div>
  );
}
