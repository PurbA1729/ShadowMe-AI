"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  Search, 
  Network, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  BrainCircuit, 
  LogOut 
} from "lucide-react";
import { useMemory, TabType } from "@/context/MemoryContext";

interface SidebarItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useMemory();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't show sidebar on landing page
  if (activeTab === "landing") return null;

  const menuItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Upload Memory", icon: UploadCloud },
    { id: "replay", label: "Memory Replay", icon: History },
    { id: "lost-objects", label: "Lost Objects", icon: Search },
    { id: "graph", label: "Memory Graph", icon: Network },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background/95 border-r border-white/5 py-6 px-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={() => handleNavClick("landing")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wider bg-gradient-to-r from-foreground to-slate-400 bg-clip-text text-transparent">
            SHADOW
          </h1>
          <span className="text-[10px] text-accent font-semibold tracking-widest uppercase">
            Local Memory Index
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group cursor-pointer ${
                isActive 
                  ? "text-white" 
                  : "text-text-secondary hover:text-primary hover:bg-primary/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-xl z-0 shadow-md shadow-primary/15"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 p-0.5 rounded-lg transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-text-secondary group-hover:text-primary"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="relative z-10">{item.label}</span>
              
              {isActive && (
                <div className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-white relative z-10" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Local Storage Quota Widget */}
      <div className="mt-auto border-t border-white/5 pt-5 pb-3">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Local Index</span>
          <span className="text-[10px] text-accent font-mono font-bold">1.2 GB / 10 GB</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
          <div className="bg-primary h-1.5 rounded-full w-[12%]" />
        </div>
        <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>Synced locally • Encrypted</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-primary/30 to-accent/30">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">John Doe</p>
            <p className="text-[10px] text-slate-400 truncate">jd.memories@shadow.ai</p>
          </div>
          <button 
            onClick={() => handleNavClick("landing")}
            className="text-slate-400 hover:text-danger transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between bg-background border-b border-white/5 px-4 py-3 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2" onClick={() => handleNavClick("landing")}>
          <BrainCircuit className="w-6 h-6 text-accent" />
          <span className="font-extrabold text-sm tracking-wider text-foreground">SHADOWME</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 bg-white/5 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 z-50 md:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-55">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 border border-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
