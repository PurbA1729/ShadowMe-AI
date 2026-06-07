"use client";

import React from "react";
import { 
  User, 
  Lock, 
  Trash2, 
  Cpu, 
  Check, 
  Sparkles,
  Database
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

export const SettingsView: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    retentionDays, 
    setRetentionDays 
  } = useMemory();

  const handleClearDatabase = () => {
    alert("Warning: Local database reset is restricted in demo sandbox. Clear browser localStorage to refresh state.");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-6 text-foreground">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account, preferences, and data privacy options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Nav Sections */}
        <div className="md:col-span-8 space-y-6">
          
          {/* User Profile Card */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              User Profile
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent border border-white/10 flex items-center justify-center font-bold text-white text-xl">
                JD
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-base font-bold text-foreground">John Doe</h4>
                <p className="text-xs text-slate-400 font-medium">Memory traces: 5 records • Active searches: 2 items</p>
                <div className="flex justify-center sm:justify-start gap-2 pt-1.5">
                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-accent font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Pro Plan
                  </span>
                  <span className="text-[9px] bg-white/5 border border-white/5 text-slate-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Local Sync
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings Selector */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Theme Settings
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Choose an interface aesthetic that fits your workflow.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "dark" as const, name: "Premium Dark", desc: "Cobalt & Navy" },
                { id: "cyberpunk" as const, name: "Cyberpunk", desc: "Cyan & Neon Pink" },
                { id: "minimal" as const, name: "Slate Minimal", desc: "Monochrome Slate" }
              ].map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? "border-accent bg-accent/5"
                        : "border-white/5 hover:border-white/10 bg-white/1"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-foreground">{t.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory retention parameters */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              Data Retention
            </h3>

            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400 leading-normal max-w-sm font-medium">
                Specify how long raw photos, receipts, and text notes should be stored locally.
              </p>
              <span className="text-sm font-bold font-mono text-accent">{retentionDays} Days</span>
            </div>

            <input
              type="range"
              min="7"
              max="90"
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value))}
              className="w-full accent-accent h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>7 days (Prune weekly)</span>
              <span>30 days (Default)</span>
              <span>90 days (Archive)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Privacy & Diagnostics settings */}
        <div className="md:col-span-4 space-y-6">
          {/* Security Protocols Panel */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Privacy & Security
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { label: "Local Keychain Encryption", active: true, desc: "Encrypt database items on-disk." },
                { label: "Text Extraction (OCR)", active: true, desc: "Read printed text in photos." },
                { label: "Biometric Authentication", active: false, desc: "Require FaceID/TouchID on unlock." }
              ].map((sec, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-foreground">{sec.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-medium">{sec.desc}</p>
                  </div>
                  
                  {/* Mock Switch */}
                  <div className={`w-8 h-4 rounded-full p-0.5 cursor-pointer flex transition-colors ${sec.active ? "bg-accent justify-end" : "bg-white/10 justify-start"}`}>
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Settings Panel */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              Search Parameters
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300 font-medium">
              <div className="flex justify-between items-center">
                <span>Location Match Sensitivity</span>
                <span className="font-mono text-accent font-bold">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Confidence Threshold</span>
                <span className="font-mono text-accent font-bold">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Spatial Search Radius</span>
                <span className="font-mono text-accent font-bold">20m</span>
              </div>
            </div>
          </div>

          {/* Reset button panel */}
          <div className="p-4 rounded-3xl bg-danger/5 border border-danger/20 space-y-3">
            <h4 className="text-xs font-bold text-danger flex items-center gap-1.5 uppercase tracking-wide">
              <Trash2 className="w-4 h-4" />
              System Reset
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              Irreversibly delete all local records, memory indexes, and connection maps from this device.
            </p>
            <button
              onClick={handleClearDatabase}
              className="w-full bg-danger hover:bg-danger/95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center block mt-1"
            >
              Clear All Local Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
