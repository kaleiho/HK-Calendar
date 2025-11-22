import React from 'react';
import { CalendarDay, GridStyle } from '../types';
import { getHoliday } from '../utils/holidays';
import { getLunarDateString } from '../utils/lunar';

interface CalendarGridProps {
  year: number;
  month: number; // 0-11
  textColor?: string;
  accentColor?: string;
  gridStyle?: GridStyle;
  showLunar?: boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  year, 
  month, 
  textColor = '#1e293b', 
  accentColor = '#ef4444',
  gridStyle = GridStyle.STANDARD,
  showLunar = false
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  const days: CalendarDay[] = [];
  
  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    const d = new Date(year, month, 1 - (firstDayOfMonth - i));
    days.push({ date: d, isCurrentMonth: false, isToday: false });
  }
  
  // Current month
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    days.push({ 
      date: d, 
      isCurrentMonth: true, 
      isToday, 
      holiday: getHoliday(d),
      lunarStr: showLunar ? getLunarDateString(d) : undefined
    });
  }
  
  // Next month padding
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false, isToday: false });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Grid Style Classes
  const getGridClasses = () => {
    switch (gridStyle) {
      case GridStyle.BOXED:
        return 'gap-0 border-l border-t border-slate-200';
      case GridStyle.ROUNDED:
        return 'gap-2 p-2';
      case GridStyle.MINIMAL:
        return 'gap-0'; // No gaps, lines handled by cells
      default: // STANDARD
        return 'gap-1';
    }
  };

  const getCellClasses = (dayInfo: CalendarDay) => {
    const base = "relative flex flex-col justify-start min-h-[3.5rem] transition-all";
    
    switch (gridStyle) {
      case GridStyle.BOXED:
        return `${base} border-r border-b border-slate-200 p-1 ${!dayInfo.isCurrentMonth ? 'bg-slate-50' : ''}`;
      case GridStyle.ROUNDED:
        return `${base} rounded-xl p-2 ${dayInfo.isCurrentMonth ? 'bg-slate-50/50' : 'opacity-30'}`;
      case GridStyle.MINIMAL:
        return `${base} border-t border-slate-100 pt-2 pl-1 ${!dayInfo.isCurrentMonth ? 'opacity-30' : ''}`;
      default: // STANDARD
        return `${base} border-t pt-1 pl-1 ${!dayInfo.isCurrentMonth ? 'bg-opacity-10 bg-gray-50' : ''}`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Weekday Headers */}
      <div className={`grid grid-cols-7 mb-2 ${gridStyle === GridStyle.BOXED ? 'border-b border-slate-200' : ''}`}>
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={`text-center font-bold text-sm uppercase tracking-wider py-1`}
            style={{ color: (idx === 0 || idx === 6) ? accentColor : textColor }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className={`grid grid-cols-7 flex-1 auto-rows-fr ${getGridClasses()}`}>
        {days.map((dayInfo, idx) => {
          const isSunday = dayInfo.date.getDay() === 0;
          const isHoliday = !!dayInfo.holiday;
          const isRed = isSunday || isHoliday;
          
          // Determine text color
          let cellTextColor = dayInfo.isCurrentMonth ? textColor : '#cbd5e1'; 
          if (dayInfo.isCurrentMonth && isRed) cellTextColor = accentColor;
          
          return (
            <div 
              key={idx} 
              className={getCellClasses(dayInfo)}
              style={{ 
                borderColor: (gridStyle === GridStyle.STANDARD || gridStyle === GridStyle.MINIMAL) && dayInfo.isCurrentMonth 
                  ? 'rgba(0,0,0,0.1)' 
                  : undefined 
              }}
            >
              <div className="flex items-baseline justify-between w-full">
                <span 
                  className={`text-lg font-semibold leading-none ${dayInfo.isToday && dayInfo.isCurrentMonth ? 'bg-blue-100 rounded-full px-2 py-0.5' : ''}`}
                  style={{ color: cellTextColor }}
                >
                  {dayInfo.date.getDate()}
                </span>
                {/* Lunar Date */}
                {dayInfo.lunarStr && dayInfo.isCurrentMonth && (
                  <span className="text-[0.6rem] text-slate-400 font-light pr-1">
                    {dayInfo.lunarStr}
                  </span>
                )}
              </div>
              
              {/* Holiday Label */}
              {dayInfo.holiday && dayInfo.isCurrentMonth && (
                <span 
                  className="text-[0.6rem] mt-auto leading-tight break-words w-full pr-1 font-medium"
                  style={{ color: accentColor }}
                >
                  {dayInfo.holiday.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};