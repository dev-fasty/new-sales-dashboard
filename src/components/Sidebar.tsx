"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Receipt, 
  Calendar,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Pipeline', icon: BarChart3, href: '/pipeline' },
    { name: 'Sales Reps', icon: Users, badge: 3, href: '/sales-reps' },
    { name: 'Expense', icon: Receipt, href: '/expense' },
    { name: 'Calendar', icon: Calendar, href: '/calendar' },
  ];

  return (
    <aside className="w-64 h-full bg-[#1c202b] border-r border-white/5 flex flex-col pt-6 hidden md:flex shrink-0">
      {/* Logo */}
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <span className="text-white font-bold text-lg leading-none">A</span>
        </div>
        <span className="text-white text-xl font-bold tracking-wide">Arion<span className="text-cyan-400">.</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "bg-white/10 text-white shadow-sm font-semibold" 
                  : "text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive ? "text-cyan-400" : "group-hover:scale-110"
              )} />
              
              <span>{item.name}</span>
              
              {item.badge && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Settings placeholder */}
      <div className="p-4 mt-auto mb-4 border-t border-white/5 mx-4 pt-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border border-white/10 relative">
              <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" fill className="object-cover" unoptimized />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-slate-400">Sales Director</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#1c202b]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
