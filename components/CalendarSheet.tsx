import React from 'react';
import { CalendarGrid } from './CalendarGrid';
import { LayoutMode } from '../types';

interface CalendarSheetProps {
  year: number;
  month: number;
  imageSrc: string | null;
  quote: string;
  layout: LayoutMode;
  primaryColor: string;
  secondaryColor: string;
}

export const CalendarSheet: React.FC<CalendarSheetProps> = ({
  year,
  month,
  imageSrc,
  quote,
  layout,
  primaryColor,
  secondaryColor,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month];

  // A4 dimensions in Tailwind arbitrary values for preview: 210mm x 297mm
  // We use a wrapper to handle scaling for smaller screens, but the inner div is fixed size.
  return (
    <div 
      className="bg-white shadow-2xl print:shadow-none print-container relative mx-auto overflow-hidden flex flex-col"
      style={{ width: '210mm', height: '296mm' }} // Slight reduction to fit some printers better
    >
      {/* Layout: Split Top (Standard Calendar) */}
      {layout === LayoutMode.SPLIT_TOP && (
        <>
          {/* Top Half: Image */}
          <div className="h-[50%] w-full relative overflow-hidden bg-gray-100">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Calendar background" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xl">Select an image</span>
              </div>
            )}
            
            {/* Quote Overlay on Image */}
            {quote && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-right">
                <p className="text-white italic font-serif text-lg drop-shadow-md">“{quote}”</p>
              </div>
            )}
          </div>

          {/* Bottom Half: Grid */}
          <div className="h-[50%] w-full p-8 flex flex-col">
            <div className="flex justify-between items-end mb-4 border-b-2 pb-2" style={{ borderColor: primaryColor }}>
              <h1 className="text-6xl font-light tracking-tighter uppercase" style={{ color: primaryColor }}>
                {monthName}
              </h1>
              <h2 className="text-4xl font-bold text-gray-300 tracking-widest">
                {year}
              </h2>
            </div>
            <div className="flex-1">
              <CalendarGrid 
                year={year} 
                month={month} 
                textColor={primaryColor} 
                accentColor={secondaryColor} 
              />
            </div>
          </div>
        </>
      )}

      {/* Layout: Full Background */}
      {layout === LayoutMode.FULL_BG && (
        <>
          <div className="absolute inset-0 z-0 bg-gray-100">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Calendar background" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                 <span className="text-xl">Select an image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-white/80 z-10 backdrop-blur-sm" style={{ clipPath: 'polygon(0 45%, 100% 35%, 100% 100%, 0% 100%)' }}></div>
          </div>

          <div className="relative z-20 w-full h-full flex flex-col p-8 justify-end">
             {/* Top area for image visibility */}
             <div className="flex-1 flex items-start justify-end pt-8">
                {quote && (
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl max-w-md shadow-lg">
                     <p className="text-gray-700 italic font-serif text-lg">“{quote}”</p>
                  </div>
                )}
             </div>

             {/* Bottom Grid */}
             <div className="h-[60%]">
                <div className="flex justify-between items-baseline mb-6">
                  <h1 className="text-7xl font-bold text-slate-800 drop-shadow-sm">
                    {month < 9 ? `0${month+1}` : month+1}
                  </h1>
                  <div className="text-right">
                    <h2 className="text-3xl uppercase font-light tracking-widest text-slate-600">{monthName}</h2>
                    <p className="text-xl font-bold text-slate-400">{year}</p>
                  </div>
                </div>
                <CalendarGrid 
                  year={year} 
                  month={month} 
                  textColor="#334155" 
                  accentColor="#dc2626" 
                />
             </div>
          </div>
        </>
      )}
    </div>
  );
};
