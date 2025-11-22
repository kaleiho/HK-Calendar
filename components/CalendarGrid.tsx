import React from 'react';
import { CalendarDay } from '../types';
import { getHoliday } from '../utils/holidays';

interface CalendarGridProps {
  year: number;
  month: number; // 0-11
  textColor?: string;
  accentColor?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  year, 
  month, 
  textColor = '#1e293b', 
  accentColor = '#ef4444' 
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  const days: CalendarDay[] = [];
  
  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    const d = new Date(year, month, 1 - (firstDayOfMonth - i));
    days.push({ date: d, isCurrentMonth: false, isToday: false, holiday: getHoliday(d) });
  }
  
  // Current month
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    days.push({ date: d, isCurrentMonth: true, isToday, holiday: getHoliday(d) });
  }
  
  // Next month padding (to complete 6 rows usually, max 42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isCurrentMonth: false, isToday: false, holiday: getHoliday(d) });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
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
      <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-1">
        {days.map((dayInfo, idx) => {
          const isSunday = dayInfo.date.getDay() === 0;
          const isHoliday = !!dayInfo.holiday;
          const isRed = isSunday || isHoliday;
          
          // Determine text color
          let cellTextColor = dayInfo.isCurrentMonth ? textColor : '#cbd5e1'; // Default slate-300 for inactive
          if (dayInfo.isCurrentMonth && isRed) cellTextColor = accentColor;
          
          return (
            <div 
              key={idx} 
              className={`
                relative border-t pt-1 pl-1 flex flex-col items-start justify-start min-h-[3.5rem]
                ${!dayInfo.isCurrentMonth ? 'bg-opacity-10 bg-gray-50' : ''}
              `}
              style={{ borderColor: dayInfo.isCurrentMonth ? 'rgba(0,0,0,0.1)' : 'transparent' }}
            >
              <span 
                className={`text-lg font-semibold leading-none ${dayInfo.isToday ? 'bg-blue-100 rounded-full px-1.5' : ''}`}
                style={{ color: cellTextColor }}
              >
                {dayInfo.date.getDate()}
              </span>
              
              {/* Holiday Label */}
              {dayInfo.holiday && dayInfo.isCurrentMonth && (
                <span 
                  className="text-[0.6rem] mt-1 leading-tight break-words w-full pr-1 font-medium"
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
