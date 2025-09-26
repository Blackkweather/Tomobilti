import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface CalendarProps {
  selectedDates: { start: Date | null; end: Date | null };
  onDateSelect: (start: Date | null, end: Date | null) => void;
  onClose?: () => void;
  unavailableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function Calendar({ 
  selectedDates, 
  onDateSelect, 
  onClose,
  unavailableDates = [], 
  minDate,
  maxDate,
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

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

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      unavailable.toDateString() === date.toDateString()
    );
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates.start || !selectedDates.end) return false;
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates.start) return false;
    return date.toDateString() === selectedDates.start.toDateString() ||
           (selectedDates.end && date.toDateString() === selectedDates.end.toDateString());
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

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      // Start new selection
      onDateSelect(date, null);
    } else if (selectedDates.start && !selectedDates.end) {
      // Complete selection
      if (date < selectedDates.start) {
        onDateSelect(date, selectedDates.start);
      } else {
        onDateSelect(selectedDates.start, date);
      }
    }
  };

  const getDateClassName = (date: Date) => {
    let className = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 ';
    
    if (isDateDisabled(date)) {
      className += 'text-gray-300 cursor-not-allowed bg-gray-50';
    } else if (isDateSelected(date)) {
      className += 'bg-blue-600 text-white font-semibold shadow-lg';
    } else if (isDateInRange(date)) {
      className += 'bg-blue-100 text-blue-700';
    } else if (date.toDateString() === today.toDateString()) {
      className += 'bg-gray-200 text-gray-900 font-semibold';
    } else {
      className += 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer';
    }

    return className;
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
    const currentDate = new Date(startOfCalendar);

    for (let i = 0; i < 42; i++) {
      days.push(
        <button
          key={i}
          className={getDateClassName(currentDate)}
          onClick={() => handleDateClick(currentDate)}
          onMouseEnter={() => setHoveredDate(currentDate)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={isDateDisabled(currentDate)}
        >
          {currentDate.getDate()}
        </button>
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getSelectedDateText = () => {
    if (!selectedDates.start) return 'Select start date';
    if (!selectedDates.end) return 'Select end date';
    
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

  const getDaysDifference = () => {
    if (!selectedDates.start || !selectedDates.end) return 0;
    return Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`bg-white rounded-xl shadow-2xl border-0 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-semibold">Select Dates</h3>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Selected Dates Display */}
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm text-blue-100 mb-1">Selected Period</div>
          <div className="font-semibold text-lg">{getSelectedDateText()}</div>
          {getDaysDifference() > 0 && (
            <div className="text-sm text-blue-100 mt-1">
              {getDaysDifference()} {getDaysDifference() === 1 ? 'day' : 'days'}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Free cancellation up to 24 hours before</span>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onDateSelect(null, null)}
              className="text-gray-600"
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                if (selectedDates.start && selectedDates.end && onClose) {
                  onClose();
                }
              }}
              disabled={!selectedDates.start || !selectedDates.end}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Dates
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span>In Range</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-50 rounded mr-2"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
}