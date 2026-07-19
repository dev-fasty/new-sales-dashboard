"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, Users, Loader2, Plus, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const initialSalesTeam = [
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
  const [team, setTeam] = useState(initialSalesTeam);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: ''
  });

  useEffect(() => {
    // Simulate a brief loading state for the mock data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.role || !formData.email) {
      toast.error("Please fill in the required fields (Name, Role, Email).");
      return;
    }

    const newRep = {
      id: team.length > 0 ? Math.max(...team.map(t => t.id)) + 1 : 1,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone || "N/A",
      location: formData.location || "Remote",
      // Generate a dynamic avatar based on their name
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=06b6d4&color=fff&size=256`
    };

    setTeam(prev => [...prev, newRep]);
    toast.success("Sales rep added successfully!");
    
    // Reset and close
    setFormData({ name: '', role: '', email: '', phone: '', location: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto pb-20 relative min-h-full">
      <Toaster theme="dark" position="bottom-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            Sales Directory
          </h2>
          <p className="text-slate-400 mt-1">Our dedicated sales representatives.</p>
        </div>
        
        {/* Trigger Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.5)] transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Add Sales Rep
        </button>
      </div>

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((rep) => (
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

      {/* Form Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Add New Sales Rep
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name <span className="text-pink-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role <span className="text-pink-500">*</span></label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Sales Executive"
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email <span className="text-pink-500">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+66 81..."
                    className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Bangkok, HQ"
                    className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 mt-2 flex gap-3 justify-end border-t border-slate-700/50">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/50"
                >
                  Save Rep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay for Initial Fetch */}
      {loading && (
        <div className="absolute inset-0 bg-[#1c202b]/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center transition-all duration-300 rounded-xl">
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
