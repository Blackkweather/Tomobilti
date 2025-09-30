import { useState } from 'react';
import { Button } from './ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  X
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
  selectedDates = { start: null, end: null }, 
  onDateSelect, 
  onClose,
  unavailableDates = [], 
  minDate,
  maxDate,
  className = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    if (!selectedDates || !selectedDates.start || !selectedDates.end) return false;
    return date >= selectedDates.start && date <= selectedDates.end;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDates || !selectedDates.start) return false;
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

    if (!selectedDates || !selectedDates.start || (selectedDates.start && selectedDates.end)) {
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
      const isDisabled = isDateDisabled(currentDate);
      const isSelected = isDateSelected(currentDate);
      const isInRange = isDateInRange(currentDate);
      const isToday = currentDate.toDateString() === today.toDateString();
      
      let buttonClass = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 cursor-pointer ';
      
      if (isDisabled) {
        buttonClass += 'text-gray-300 cursor-not-allowed bg-gray-50';
      } else if (isSelected) {
        buttonClass += 'bg-blue-600 text-white font-bold shadow-lg';
      } else if (isInRange) {
        buttonClass += 'bg-blue-100 text-blue-800 font-medium';
      } else if (isToday) {
        buttonClass += 'bg-blue-500 text-white font-bold';
      } else {
        buttonClass += 'text-gray-800 hover:bg-blue-50 hover:text-blue-700 font-medium';
      }

      days.push(
        <button
          key={i}
          className={buttonClass}
          onClick={() => handleDateClick(currentDate)}
          disabled={isDisabled}
        >
          {currentDate.getDate()}
        </button>
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getSelectedDateText = () => {
    if (!selectedDates || !selectedDates.start) return 'Select start date';
    if (!selectedDates.end) return 'Select end date';
    
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

  const getDaysDifference = () => {
    if (!selectedDates || !selectedDates.start || !selectedDates.end) return 0;
    return Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className={`bg-white rounded-xl shadow-2xl border-0 overflow-hidden w-full max-w-md mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-bold">Select Dates</h3>
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
        <div className="bg-white/20 rounded-lg p-4">
          <div className="text-sm text-blue-100 mb-1">Selected Period</div>
          <div className="font-bold text-lg">{getSelectedDateText()}</div>
          {getDaysDifference() > 0 && (
            <div className="text-sm text-blue-100 mt-1">
              {getDaysDifference()} {getDaysDifference() === 1 ? 'day' : 'days'}
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h2 className="text-xl font-bold text-gray-900">
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
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex items-center justify-between">
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
            Confirm Dates
          </Button>
        </div>
      </div>
    </div>
  );
}
