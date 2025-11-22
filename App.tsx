import React, { useState, useRef, useEffect } from 'react';
import { CalendarSheet } from './components/CalendarSheet';
import { LayoutMode, GridStyle } from './types';
import { analyzeImageForCalendar } from './services/geminiService';
import { SparklesIcon, PrinterIcon, PhotoIcon, CalendarDaysIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>(LayoutMode.SPLIT_TOP);
  
  // Customization State
  const [quote, setQuote] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#1e293b');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ef4444');
  const [fontFamily, setFontFamily] = useState<string>('"Quicksand", sans-serif');
  const [captionFontSize, setCaptionFontSize] = useState<number>(18);
  const [captionColor, setCaptionColor] = useState<string>('#ffffff');
  const [gridStyle, setGridStyle] = useState<GridStyle>(GridStyle.STANDARD);
  const [showLunar, setShowLunar] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = [
    { name: 'Modern (Default)', value: '"Quicksand", sans-serif' },
    { name: 'Elegant Serif', value: '"Playfair Display", serif' },
    { name: 'Handwriting', value: '"Dancing Script", cursive' },
    { name: 'Retro Typewriter', value: '"Courier Prime", monospace' },
  ];

  // Inject print page size style based on layout
  useEffect(() => {
    const styleId = 'print-orientation-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    if (layout === LayoutMode.HORIZON) {
      styleTag.innerHTML = `@media print { @page { size: landscape; margin: 0; } }`;
    } else {
      styleTag.innerHTML = `@media print { @page { size: portrait; margin: 0; } }`;
    }

    // Set default caption color based on layout only if it hasn't been manually customized significantly?
    // For now, we reset to a safe default when layout switches to ensure readability.
    if (layout === LayoutMode.FULL_BG) {
      setCaptionColor('#334155'); // Dark slate for white box
    } else {
      setCaptionColor('#ffffff'); // White for image overlay
    }

  }, [layout]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          // Reset AI generated fields when new image is loaded
          setQuote('');
          setPrimaryColor('#1e293b');
          setSecondaryColor('#ef4444');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!imageSrc) {
      setError("Please upload an image first.");
      return;
    }
    
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImageForCalendar(imageSrc, monthName, year);
      if (result) {
        // Sanitize quote to remove start/end quotes if AI included them
        const cleanQuote = result.quote.replace(/^["']|["']$/g, '').trim();
        setQuote(cleanQuote);
        setPrimaryColor(result.primaryColor);
        setSecondaryColor(result.secondaryColor);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Check your API Key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    // Directly call window.print() to ensure browser compliance with user gestures
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row main-layout">
      {/* Sidebar Controls - Hidden on Print */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 no-print overflow-y-auto h-auto lg:h-screen z-20 shadow-lg scrollbar-thin">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
            HK Photo Calendar
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create your custom A4 calendar</p>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Date</label>
          <div className="flex gap-2">
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              className="block w-full rounded-md border-slate-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className="block w-full rounded-md border-slate-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Background Photo</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <PhotoIcon className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm text-slate-500">Click to upload image</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Layout Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Layout Style</label>
          <div className="grid grid-cols-3 gap-2">
             <button
               onClick={() => setLayout(LayoutMode.SPLIT_TOP)}
               className={`px-2 py-2 text-xs font-medium rounded-md border text-center ${layout === LayoutMode.SPLIT_TOP ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
             >
               Classic
             </button>
             <button
               onClick={() => setLayout(LayoutMode.FULL_BG)}
               className={`px-2 py-2 text-xs font-medium rounded-md border text-center ${layout === LayoutMode.FULL_BG ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
             >
               Full
             </button>
             <button
               onClick={() => setLayout(LayoutMode.HORIZON)}
               className={`px-2 py-2 text-xs font-medium rounded-md border text-center ${layout === LayoutMode.HORIZON ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
             >
               Horizon
             </button>
          </div>
        </div>

        {/* Calendar Grid Options */}
        <div className="space-y-3 border-t pt-4 border-slate-200">
           <div className="flex items-center justify-between">
             <label className="block text-sm font-medium text-slate-700">Calendar Grid</label>
             <Cog6ToothIcon className="w-4 h-4 text-slate-400"/>
           </div>
           
           {/* Style Buttons */}
           <div className="grid grid-cols-4 gap-1">
             {[GridStyle.STANDARD, GridStyle.MINIMAL, GridStyle.BOXED, GridStyle.ROUNDED].map(style => (
               <button
                 key={style}
                 onClick={() => setGridStyle(style)}
                 className={`px-1 py-2 text-[10px] uppercase font-bold rounded border text-center ${gridStyle === style ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200'}`}
               >
                 {style.toLowerCase()}
               </button>
             ))}
           </div>

           {/* Toggle Lunar */}
           <div className="flex items-center mt-2">
              <input 
                id="showLunar" 
                type="checkbox" 
                checked={showLunar}
                onChange={(e) => setShowLunar(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="showLunar" className="ml-2 block text-sm text-slate-700">
                Show Lunar Date (農曆)
              </label>
           </div>
        </div>

        {/* Caption Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
           <label className="block text-sm font-medium text-slate-700">Caption Settings</label>
           <textarea
             value={quote}
             onChange={(e) => setQuote(e.target.value)}
             rows={2}
             className="block w-full rounded-md border-slate-300 border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
             placeholder="Add a quote (no quotes needed)..."
           />
           
           <div className="grid grid-cols-1 gap-3">
             <div>
               <label className="block text-xs text-slate-500 mb-1">Font</label>
               <select
                 value={fontFamily}
                 onChange={(e) => setFontFamily(e.target.value)}
                 className="block w-full rounded-md border-slate-300 border px-2 py-1 text-xs"
               >
                 {fontOptions.map((option) => (
                   <option key={option.name} value={option.value}>{option.name}</option>
                 ))}
               </select>
             </div>
             
             <div className="flex gap-3">
               <div className="flex-1">
                 <label className="block text-xs text-slate-500 mb-1">Size: {captionFontSize}px</label>
                 <input 
                    type="range" 
                    min="12" 
                    max="64" 
                    value={captionFontSize}
                    onChange={(e) => setCaptionFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                 />
               </div>
               <div>
                 <label className="block text-xs text-slate-500 mb-1">Color</label>
                 <div className="flex items-center">
                    <input 
                      type="color" 
                      value={captionColor}
                      onChange={(e) => setCaptionColor(e.target.value)}
                      className="h-8 w-14 rounded border border-slate-300 p-0.5 cursor-pointer"
                    />
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* AI Features */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
             <SparklesIcon className="w-5 h-5 text-indigo-600" />
             <h3 className="font-semibold text-indigo-900">AI Magic</h3>
          </div>
          <p className="text-xs text-indigo-700 mb-4">Auto-generate a caption and matching color theme based on your photo.</p>
          <button
            onClick={handleAIAnalysis}
            disabled={isAnalyzing || !imageSrc}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all
              ${isAnalyzing || !imageSrc 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Enhance with AI'}
          </button>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
        
        <div className="flex-1"></div>

        {/* Print Action */}
        <button 
          type="button"
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl hover:bg-slate-800 transition-colors font-medium text-lg cursor-pointer"
        >
          <PrinterIcon className="w-6 h-6" />
          Print Calendar
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-200 overflow-auto p-4 lg:p-10 flex justify-center items-start min-h-screen preview-area">
        <div className="calendar-scale-wrapper scale-[0.45] sm:scale-[0.6] md:scale-[0.75] xl:scale-[0.9] 2xl:scale-100 origin-top transition-transform duration-300 shadow-2xl">
          <CalendarSheet
            year={year}
            month={month}
            imageSrc={imageSrc}
            quote={quote}
            layout={layout}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            fontFamily={fontFamily}
            captionFontSize={captionFontSize}
            captionColor={captionColor}
            gridStyle={gridStyle}
            showLunar={showLunar}
          />
        </div>
      </div>
    </div>
  );
};

export default App;