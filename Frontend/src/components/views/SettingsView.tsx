"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  User, 
  Lock, 
  Trash2, 
  Cpu, 
  ShieldCheck, 
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
          Adjust security protocols, theme values, and indexing parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Nav Sections */}
        <div className="md:col-span-8 space-y-6">
          
          {/* User Profile Card */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Cognitive Profile
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent border border-white/10 flex items-center justify-center font-bold text-white text-xl">
                JD
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className="text-base font-bold text-foreground">John Doe</h4>
                <p className="text-xs text-slate-400">Traces recorded: 5 traces • Active lost: 2 items</p>
                <div className="flex justify-center sm:justify-start gap-2 pt-1.5">
                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-accent font-semibold px-2 py-0.5 rounded-full">
                    Developer Mode
                  </span>
                  <span className="text-[9px] bg-white/5 border border-white/5 text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                    Beta Tester
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Settings Selector */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Design Theme
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Toggle global styles to align with your dashboard workspace aesthetic.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "dark" as const, name: "Premium Dark", desc: "#04091e Cobalt" },
                { id: "cyberpunk" as const, name: "Cyberpunk", desc: "Cyan & Magenta" },
                { id: "minimal" as const, name: "Slate Minimal", desc: "Gray & White" }
              ].map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? "border-accent bg-accent/5"
                        : "border-white/5 hover:border-white/10 bg-white/2"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-foreground">{t.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                    <span className="text-[9px] text-slate-400">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory retention parameters */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              Memory Retention Lifecycle
            </h3>

            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400 leading-normal max-w-sm">
                Define the lifespan duration of raw digital traces before automatic pruning.
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
              <span>7 days (Pruned weekly)</span>
              <span>30 days (Default)</span>
              <span>90 days (Archived)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Privacy & Diagnostics settings */}
        <div className="md:col-span-4 space-y-6">
          {/* Security Protocols Panel */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Security Protocol
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { label: "End-to-End Encryption", active: true, desc: "Traces encrypted via local keychain." },
                { label: "OCR Image Parsing", active: true, desc: "Enable optical text scanning." },
                { label: "Biometric Verification", active: false, desc: "Authenticate prior to retrieval." }
              ].map((sec, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-foreground">{sec.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sec.desc}</p>
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
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              AI Cognitive Weights
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between items-center">
                <span>Location Sensitivity</span>
                <span className="font-mono text-accent">High</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Confidence Threshold</span>
                <span className="font-mono text-accent">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Spatial Search Radius</span>
                <span className="font-mono text-accent">20m</span>
              </div>
            </div>
          </div>

          {/* Reset button panel */}
          <div className="p-4 rounded-3xl bg-danger/5 border border-danger/20 space-y-3">
            <h4 className="text-xs font-bold text-danger flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              System Reset
            </h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              Irreversibly delete all uploaded trace files, memories, and association graphs from server indexes.
            </p>
            <button
              onClick={handleClearDatabase}
              className="w-full bg-danger hover:bg-danger/95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer text-center block mt-1"
            >
              Clear Memory Engine
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
