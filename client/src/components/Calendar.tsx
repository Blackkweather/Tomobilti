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
  AlertTriangle
} from 'lucide-react';

interface CalendarProps {
  selectedDates: { start: Date | null; end: Date | null };
  onDateSelect: (start: Date | null, end: Date | null) => void;
  unavailableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export default function Calendar({ 
  selectedDates, 
  onDateSelect, 
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

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (date < today) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates.start) return false;
    if (selectedDates.end) {
      return date >= selectedDates.start && date <= selectedDates.end;
    }
    return date.toDateString() === selectedDates.start.toDateString();
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates.start || !selectedDates.end) return false;
    return date > selectedDates.start && date < selectedDates.end;
  };

  const isStartDate = (date: Date) => {
    return selectedDates.start && date.toDateString() === selectedDates.start.toDateString();
  };

  const isEndDate = (date: Date) => {
    return selectedDates.end && date.toDateString() === selectedDates.end.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date) || isDateUnavailable(date)) return;

    if (!selectedDates.start) {
      onDateSelect(date, null);
    } else if (!selectedDates.end) {
      if (date < selectedDates.start) {
        onDateSelect(date, selectedDates.start);
      } else {
        onDateSelect(selectedDates.start, date);
      }
    } else {
      onDateSelect(date, null);
    }
  };

  const handleMouseEnter = (date: Date) => {
    if (isDateDisabled(date) || isDateUnavailable(date)) return;
    setHoveredDate(date);
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
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

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const renderCalendarDays = () => {
    const days = [];
    const currentDate = new Date(startOfCalendar);

    for (let i = 0; i < 42; i++) {
      const date = new Date(currentDate);
      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const isUnavailable = isDateUnavailable(date);
      const isDisabled = isDateDisabled(date);
      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const isHovered = hoveredDate && date.toDateString() === hoveredDate.toDateString();

      let className = 'relative w-8 h-8 flex items-center justify-center text-xs rounded-md transition-all duration-200 cursor-pointer ';
      
      if (!isCurrentMonth) {
        className += 'text-gray-300 ';
      } else if (isDisabled) {
        className += 'text-gray-400 cursor-not-allowed ';
      } else if (isUnavailable) {
        className += 'text-red-400 cursor-not-allowed bg-red-50 ';
      } else if (isSelected) {
        className += 'text-white bg-blue-600 font-semibold ';
      } else if (isInRange) {
        className += 'text-blue-600 bg-blue-100 ';
      } else if (isToday) {
        className += 'text-blue-600 bg-blue-50 font-semibold ';
      } else {
        className += 'text-gray-700 hover:bg-gray-100 ';
      }

      if (isHovered && !isSelected && !isDisabled && !isUnavailable) {
        className += 'bg-gray-200 ';
      }

      days.push(
        <button
          key={i}
          className={className}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => handleMouseEnter(date)}
          onMouseLeave={handleMouseLeave}
          disabled={isDisabled || isUnavailable}
        >
          <span>{date.getDate()}</span>
          
          {/* Status indicators */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {isUnavailable && (
              <XCircle className="h-2 w-2 text-red-500" />
            )}
            {isToday && !isSelected && (
              <div className="w-1 h-1 bg-blue-500 rounded-full" />
            )}
            {isStart && (
              <CheckCircle className="h-2 w-2 text-white" />
            )}
            {isEnd && (
              <CheckCircle className="h-2 w-2 text-white" />
            )}
          </div>
        </button>
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getDateRangeText = () => {
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

  const getDuration = () => {
    if (!selectedDates.start || !selectedDates.end) return null;
    
    const diffTime = Math.abs(selectedDates.end.getTime() - selectedDates.start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Select Dates</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs px-2 py-1"
        >
          Today
        </Button>
      </div>

      {/* Selected Date Range */}
      <div className="mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900">Selected Period</p>
            <p className="text-xs text-blue-700">{getDateRangeText()}</p>
          </div>
          {getDuration() && (
            <Badge variant="default" className="bg-blue-600 text-xs">
              {getDuration()} day{getDuration() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="p-1 h-6 w-6"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        
        <h2 className="text-sm font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="p-1 h-6 w-6"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>In Range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-50 rounded"></div>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => onDateSelect(null, null)}
          className="flex-1"
          disabled={!selectedDates.start}
        >
          Clear Selection
        </Button>
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={!selectedDates.start || !selectedDates.end}
        >
          <Clock className="h-4 w-4 mr-2" />
          Confirm Dates
        </Button>
      </div>
    </div>
  );
}
