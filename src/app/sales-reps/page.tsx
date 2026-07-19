"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Users, Loader2 } from 'lucide-react';

const salesTeam = [
  {
    id: 1,
    name: "TOS",
    role: "Senior Sales Representative",
    email: "guo.jing2548@gmail.com",
    phone: "+66 81 234 5678",
    location: "Bangkok, HQ",
    avatar: "https://ui-avatars.com/api/?name=TOS&background=0D8ABC&color=fff&size=256"
  },
  {
    id: 2,
    name: "JIK",
    role: "Product Solution Sales",
    email: "guo.jing2548@gmail.com",
    phone: "+66 82 345 6789",
    location: "Bangkok, HQ",
    avatar: "https://ui-avatars.com/api/?name=JIK&background=F43F5E&color=fff&size=256"
  },
  {
    id: 3,
    name: "PUD",
    role: "nabuakaeokhochon@gmail.com",
    email: "guo.jing2548@gmail.com",
    phone: "+66 83 456 7890",
    location: "Bangkok, HQ",
    avatar: "https://ui-avatars.com/api/?name=PUD&background=FBBF24&color=fff&size=256"
  },
  {
    id: 4,
    name: "HALL",
    role: "Sales Freelance",
    email: "guo.jing2548@gmail.com",
    phone: "+66 84 567 8901",
    location: "Remote",
    avatar: "https://ui-avatars.com/api/?name=HALL&background=10B981&color=fff&size=256"
  }
];

export default function SalesRepsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state for the mock data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            Sales Directory
          </h2>
          <p className="text-slate-400 mt-1">Our dedicated sales representatives.</p>
        </div>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {salesTeam.map((rep) => (
            <div 
              key={rep.id} 
              className="bg-[#252936] rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group flex flex-col"
            >
              {/* Card Banner */}
              <div className="h-24 bg-gradient-to-br from-cyan-900/40 to-slate-800/80 w-full relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 pt-0 relative flex flex-col items-center flex-grow">
                <img 
                  src={rep.avatar} 
                  alt={rep.name}
                  className="w-20 h-20 rounded-full border-4 border-[#252936] -mt-10 mb-4 object-cover shadow-lg bg-[#1c202b]"
                />
                <h3 className="text-xl font-bold text-white tracking-wide">{rep.name}</h3>
                <p className="text-sm text-cyan-400 font-medium mb-4 flex items-center gap-1.5 text-center h-10">
                  <Briefcase className="w-3.5 h-3.5" />
                  {rep.role}
                </p>

                <div className="w-full h-px bg-white/5 my-4"></div>

                <div className="w-full space-y-3 flex-grow">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <a href={`mailto:${rep.email}`} className="truncate hover:text-cyan-400 transition-colors">
                      {rep.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <a href={`tel:${rep.phone.replace(/[^0-9+]/g, '')}`} className="truncate hover:text-pink-400 transition-colors">
                      {rep.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className="truncate">
                      {rep.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          <p className="mt-4 text-cyan-400 font-medium tracking-wide animate-pulse">Loading Directory...</p>
        </div>
      )}
    </div>
  );
}
