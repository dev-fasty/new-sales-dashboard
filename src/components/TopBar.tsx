"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export default function TopBar() {
  const pathname = usePathname();
  
  const getPageInfo = () => {
    switch (pathname) {
      case '/':
        return { title: 'Overview', subtitle: "Welcome back, here's what's happening with your sales today." };
      case '/pipeline':
        return { title: 'Pipeline', subtitle: 'Manage and track all active deals.' };
      case '/sales-reps':
        return { title: 'Sales Reps', subtitle: 'Performance and metrics for your team.' };
      case '/expense':
        return { title: 'Expense', subtitle: 'Track and approve team expenses.' };
      case '/calendar':
        return { title: 'Calendar', subtitle: 'Upcoming meetings and deadlines.' };
      default:
        return { title: 'Dashboard', subtitle: 'Manage your data.' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 sticky top-0 bg-[#1c202b]/80 backdrop-blur-md z-10 shrink-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all w-64 text-white placeholder:text-slate-500"
          />
        </div>
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all whitespace-nowrap">
          New Deal
        </button>
      </div>
    </header>
  );
}
