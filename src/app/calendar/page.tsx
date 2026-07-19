"use client";

import React, { useState, useEffect } from 'react';
import { fetchSheetData } from '@/lib/api';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Fetching with "Calendar" sheetName parameter
    fetchSheetData('Calendar').then(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full flex flex-col items-center justify-center">
      {!loading && (
        <div className="text-center space-y-4 text-slate-400">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Calendar</h2>
          <p>Upcoming meetings and deadlines will be displayed here.</p>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#1c202b]/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300 rounded-xl">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="w-10 h-10 absolute border-4 border-white/5 border-b-pink-500 rounded-full animate-spin direction-reverse"></div>
            <Loader2 className="w-5 h-5 absolute text-cyan-400 animate-pulse" />
          </div>
          <p className="mt-4 text-cyan-400 font-medium tracking-wide animate-pulse">Fetching Calendar Data...</p>
        </div>
      )}
    </div>
  );
}
