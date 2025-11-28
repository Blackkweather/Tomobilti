import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { createPortal } from 'react-dom';
import { getAllCityNames } from '../utils/ukCities';

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  className?: string;
}

const LOCATION_SUGGESTIONS = getAllCityNames();

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Enter city or location",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length === 0) {
      setFilteredSuggestions(LOCATION_SUGGESTIONS.slice(0, 5)); // Show top 5 by default
    } else {
      const filtered = LOCATION_SUGGESTIONS
        .filter(location => 
          location.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
    }
    setHighlightedIndex(-1);
  }, [inputValue]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(true);
    // Calculate dropdown position
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close if clicking on dropdown
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className={cn("relative w-full overflow-visible", className)}>
      <div className="relative overflow-visible">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <MapPin className={cn("h-4 w-4", className?.includes('text-white') ? "text-white/70" : "text-gray-400")} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 text-sm border border-gray-300 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "bg-white shadow-sm transition-all duration-200",
            "placeholder:text-gray-400 hover:border-gray-400",
            className
          )}
        />
        
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10
                       p-1 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown - Rendered as portal outside the search card */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl z-[9999] max-h-60 overflow-y-auto
                     animate-in slide-in-from-top-2 duration-200"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width
          }}
        >
          {filteredSuggestions.length > 0 ? (
            <div className="py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors duration-200",
                    "flex items-center gap-3 border-b border-gray-100 last:border-b-0",
                    "hover:text-blue-700 focus:outline-none focus:bg-blue-50",
                    highlightedIndex === index && "bg-blue-50 text-blue-700"
                  )}
                >
                  <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              <Search className="h-4 w-4 mx-auto mb-1 text-gray-300" />
              No locations found
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
