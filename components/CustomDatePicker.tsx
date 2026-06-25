import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
  label: string;
  placeholder: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  maxDate?: Date | null;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder,
  value,
  onChange,
  maxDate,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(() => value ?? new Date(2000, 0, 1));
  const [viewMode, setViewMode] = useState<'calendar' | 'months' | 'years'>('calendar');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear;
  const minYear = 1900;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const formatDisplayValue = () => {
    if (value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(newDate);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, currentDate.getDate());
    setCurrentDate(newDate);
    setViewMode('calendar');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentDate.getMonth(), currentDate.getDate());
    setCurrentDate(newDate);
    setViewMode('months');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const generateYears = () => {
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    return value.getDate() === day && 
           value.getMonth() === currentDate.getMonth() && 
           value.getFullYear() === currentDate.getFullYear();
  };

  const isDateDisabled = (day: number) => {
    if (!maxDate) return false;
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateToCheck > maxDate;
  };

  const isNextMonthDisabled = () => {
    if (!maxDate) return false;
    return (
      currentDate.getFullYear() > maxDate.getFullYear() ||
      (currentDate.getFullYear() === maxDate.getFullYear() &&
        currentDate.getMonth() >= maxDate.getMonth())
    );
  };

  const isMonthDisabled = (monthIndex: number) => {
    if (!maxDate) return false;
    return (
      currentDate.getFullYear() > maxDate.getFullYear() ||
      (currentDate.getFullYear() === maxDate.getFullYear() &&
        monthIndex > maxDate.getMonth())
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('calendar');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col items-start w-full ${className}`}>
      <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
        {label}
      </label>
      <div className="relative w-full" ref={dropdownRef}>
        <input
          type="text"
          value={formatDisplayValue()}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-11 border border-gray-200 text-sm text-[#19192C] placeholder:text-[#9CA3AF] px-4 bg-white outline-none rounded-xl focus:ring-2 focus:ring-[#C1001F]/20 focus:border-[#C1001F] shadow-sm cursor-pointer"
        />
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-[#C1001F] text-white p-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="text-white hover:bg-white/10 rounded p-1 transition-colors"
                  disabled={viewMode !== 'calendar'}
                >
                  <span className="text-xl font-bold">{"<"}</span>
                </button>
                
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'months' ? 'calendar' : 'months')}
                    className="text-white font-semibold text-base hover:bg-white/10 px-3 py-1 rounded transition-colors"
                  >
                    {months[currentDate.getMonth()]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'years' ? 'months' : 'years')}
                    className="text-white font-semibold text-base hover:bg-white/10 px-3 py-1 rounded transition-colors"
                  >
                    {currentDate.getFullYear()}
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="text-white hover:bg-white/10 rounded p-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={viewMode !== 'calendar' || isNextMonthDisabled()}
                >
                  <span className="text-xl font-bold">{">"}</span>
                </button>
              </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="p-4">
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day && (
                        <button
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          disabled={isDateDisabled(day)}
                          className={`w-full h-full rounded text-sm font-medium transition-colors ${
                            isDateSelected(day)
                              ? 'bg-[#C1001F] text-white'
                              : isDateDisabled(day)
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'hover:bg-[#ffe6eb] text-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Months View */}
            {viewMode === 'months' && (
              <div className="p-4 grid grid-cols-3 gap-2">
                {monthsShort.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => !isMonthDisabled(index) && handleMonthSelect(index)}
                    disabled={isMonthDisabled(index)}
                    className={`p-3 rounded text-sm font-medium transition-colors ${
                      index === currentDate.getMonth()
                        ? 'bg-[#C1001F] text-white'
                        : isMonthDisabled(index)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-[#ffe6eb] text-gray-700'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* Years View */}
            {viewMode === 'years' && (
              <div className="p-4 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {generateYears().map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      year === currentDate.getFullYear()
                        ? 'bg-[#C1001F] text-white'
                        : 'hover:bg-[#ffe6eb] text-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;