"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  CheckCircle, 
  Loader2, 
  FileText, 
  Image as ImageIcon, 
  StickyNote, 
  Sparkles,
  Terminal,
  AlertCircle
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

export const UploadView: React.FC = () => {
  const { simulateUpload, isProcessingUpload, processingStep } = useMemory();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Preset file triggers to simulate
  const presets = [
    { name: "receipt_starbucks_coffee.jpg", type: "receipt" as const, size: "145 KB", label: "Receipt Preset" },
    { name: "photo_entryway_table.png", type: "photo" as const, size: "1.2 MB", label: "Living Room Photo" },
    { name: "notes_weekly_todo.txt", type: "note" as const, size: "1.2 KB", label: "Note Preset" },
    { name: "doc_office_roadmap.pdf", type: "document" as const, size: "450 KB", label: "Cabinet Document" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessingUpload) return;
    
    // Choose a random preset for drag-and-drop simulation
    const randIdx = Math.floor(Math.random() * presets.length);
    setSelectedPreset(randIdx);
    const preset = presets[randIdx];
    simulateUpload(preset.name, preset.type);
  };

  const triggerUpload = (presetIdx: number) => {
    if (isProcessingUpload) return;
    setSelectedPreset(presetIdx);
    const preset = presets[presetIdx];
    simulateUpload(preset.name, preset.type);
  };

  const getPresetIcon = (type: string) => {
    switch (type) {
      case "photo": return <ImageIcon className="w-5 h-5 text-accent" />;
      case "receipt": return <FileText className="w-5 h-5 text-success" />;
      case "note": return <StickyNote className="w-5 h-5 text-warning" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  // Pipeline step names
  const steps = [
    { number: 1, label: "Uploading Trace Data", detail: "Transferring binary packets to secure vault..." },
    { number: 2, label: "OCR & Text Scanning", detail: "Extracting letters, numbers, and receipt totals..." },
    { number: 3, label: "Object Detection & Spatial Mapping", detail: "Identifying key belongs, anchors, and background layouts..." },
    { number: 4, label: "Neural Memory Graph Created", detail: "Synthesizing connections and generating timelines..." }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 text-foreground">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
          Ingest Digital Traces
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Upload images, documents, receipts, or notes to compile into the neural memory map.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Drag & Drop Dropzone */}
        <div className="lg:col-span-7 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[350px] relative overflow-hidden ${
              isProcessingUpload 
                ? "border-primary/40 bg-primary/2" 
                : "border-white/10 hover:border-primary/40 bg-white/2 hover:bg-white/3"
            }`}
          >
            {/* Visual background rings */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_60%)]" />
            
            {/* Scanning radar line when uploading */}
            {isProcessingUpload && (
              <motion.div 
                initial={{ y: "-100%" }}
                animate={{ y: "200%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent z-10 shadow-[0_0_10px_#97ceff]"
              />
            )}

            <AnimatePresence mode="wait">
              {!isProcessingUpload ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4 flex flex-col items-center z-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/2.5 group-hover:scale-105 transition-transform">
                    <Upload className="w-7 h-7 text-accent" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">Drag & drop files here</h3>
                    <p className="text-slate-400 text-xs mt-1.5 max-w-sm">
                      Accepts JPG, PNG, PDF, or raw TXT notes. Our parser auto-routes to OCR or Object Detection.
                    </p>
                  </div>
                  
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    — OR —
                  </span>

                  <button
                    onClick={() => triggerUpload(0)}
                    className="glass-panel text-foreground hover:text-primary hover:border-primary/30 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                  >
                    Select Local File
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 w-full max-w-md z-20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    <span className="font-bold text-base text-foreground">
                      Processing: {selectedPreset !== null ? presets[selectedPreset].name : "Trace Archive"}
                    </span>
                  </div>

                  {/* Processing Pipeline Timeline Steps */}
                  <div className="space-y-4 text-left">
                    {steps.map((step) => {
                      const isCompleted = processingStep > step.number;
                      const isActive = processingStep === step.number;
                      return (
                        <div key={step.number} className="flex gap-3 items-start">
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : isActive ? (
                              <Loader2 className="w-5 h-5 text-accent animate-spin" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-white/20 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                                {step.number}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-bold ${isActive ? "text-accent" : isCompleted ? "text-success" : "text-slate-400"}`}>
                              {step.label}
                            </h4>
                            {isActive && (
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                                {step.detail}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Presets & Live Terminal */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset options */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5">
              Simulate Preset Traces
            </h3>
            
            <p className="text-xs text-slate-400 leading-normal">
              Click any sample below to simulate uploading trace logs in real-time. Watch how they integrate.
            </p>

            <div className="space-y-2.5">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => triggerUpload(index)}
                  disabled={isProcessingUpload}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedPreset === index && isProcessingUpload
                      ? "border-accent bg-accent/5"
                      : "border-white/5 hover:border-primary/20 bg-white/2 hover:bg-white/4 disabled:opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      {getPresetIcon(preset.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{preset.label}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{preset.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{preset.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Console */}
          <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-3 font-mono">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Trace Parser Console</span>
            </div>
            
            <div className="bg-black/60 rounded-xl p-3 h-36 overflow-y-auto text-[10px] text-slate-400 space-y-1 scrollbar-thin">
              <p className="text-accent">$ shadowme --watch-vault</p>
              <p className="text-slate-500">[SYSTEM] Connection secure. Waiting for payload...</p>
              {isProcessingUpload && (
                <>
                  <p className="text-foreground">🚀 [POST] payload init... OK</p>
                  {processingStep >= 2 && <p className="text-success">✔ [OCR] Extracted bounding boxes: 24 found</p>}
                  {processingStep >= 3 && <p className="text-success">✔ [DETECT] Target: Wallet (0.94 probability)</p>}
                  {processingStep >= 3 && <p className="text-success">✔ [DETECT] Location: Entryway Desk console</p>}
                  {processingStep >= 4 && <p className="text-primary">✨ [SYNAPSE] Graph edge weights calculated</p>}
                  {processingStep >= 4 && <p className="text-accent">✨ [SYNC] Database updated. Pipeline idle.</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
