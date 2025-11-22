
import React, { useState, useRef, useEffect } from 'react';
import { CalendarSheet } from './components/CalendarSheet';
import { LayoutMode, AIAnalysisResult } from './types';
import { analyzeImageForCalendar } from './services/geminiService';
import { ArrowDownTrayIcon, SparklesIcon, PrinterIcon, PhotoIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutMode>(LayoutMode.SPLIT_TOP);
  const [quote, setQuote] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#1e293b');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ef4444');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setQuote(result.quote);
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
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Controls - Hidden on Print */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 no-print overflow-y-auto h-auto lg:h-screen z-20 shadow-lg">
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
          <div className="grid grid-cols-2 gap-2">
             <button
               onClick={() => setLayout(LayoutMode.SPLIT_TOP)}
               className={`px-3 py-2 text-sm rounded-md border ${layout === LayoutMode.SPLIT_TOP ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
             >
               Classic Split
             </button>
             <button
               onClick={() => setLayout(LayoutMode.FULL_BG)}
               className={`px-3 py-2 text-sm rounded-md border ${layout === LayoutMode.FULL_BG ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
             >
               Full Background
             </button>
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

        {/* Manual Overrides (Optional) */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
           <label className="block text-sm font-medium text-slate-700">Manual Caption</label>
           <textarea
             value={quote}
             onChange={(e) => setQuote(e.target.value)}
             rows={2}
             className="block w-full rounded-md border-slate-300 border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
             placeholder="Add a quote..."
           />
        </div>
        
        <div className="flex-1"></div>

        {/* Print Action */}
        <button 
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl hover:bg-slate-800 transition-colors font-medium text-lg"
        >
          <PrinterIcon className="w-6 h-6" />
          Print Calendar
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-slate-200 overflow-auto p-4 lg:p-10 flex justify-center items-start min-h-screen">
        <div className="scale-[0.45] sm:scale-[0.6] md:scale-[0.75] xl:scale-[0.9] 2xl:scale-100 origin-top transition-transform duration-300 shadow-2xl print:scale-100 print:shadow-none print:origin-top-left">
          <CalendarSheet
            year={year}
            month={month}
            imageSrc={imageSrc}
            quote={quote}
            layout={layout}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
