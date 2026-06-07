"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Percent, 
  HelpCircle, 
  ArrowRight, 
  Sparkles,
  Home,
  CheckCircle,
  Clock,
  Compass
} from "lucide-react";
import { useMemory, LostObject, PredictedLocation } from "@/context/MemoryContext";
import confetti from "canvas-confetti";

export const LostObjectsView: React.FC = () => {
  const { lostObjects, markAsRecovered } = useMemory();
  
  // Local state for searching/displaying
  const [searchInput, setSearchInput] = useState("");
  const [activeObject, setActiveObject] = useState<LostObject | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PredictedLocation | null>(null);

  // Default to the first lost object (usually Wallet)
  useEffect(() => {
    const defaultObj = lostObjects.find(o => o.status === "lost");
    if (defaultObj) {
      setActiveObject(defaultObj);
      if (defaultObj.predictedLocations.length > 0) {
        setSelectedLocation(defaultObj.predictedLocations[0]);
      }
    }
  }, [lostObjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const matched = lostObjects.find(
      obj => obj.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (matched) {
      setActiveObject(matched);
      if (matched.predictedLocations.length > 0) {
        setSelectedLocation(matched.predictedLocations[0]);
      }
    } else {
      // Create a mock temporary search result if not matched
      const tempObj: LostObject = {
        id: "temp",
        name: searchInput.charAt(0).toUpperCase() + searchInput.slice(1),
        status: "lost",
        lastSeen: "Not logged in traces",
        predictedLocations: [
          {
            name: "Study Table",
            probability: 52,
            reasoning: ["General workspace clustering: you spend 60% of idle time here.", "Common charging drop point."]
          },
          {
            name: "Living Room",
            probability: 33,
            reasoning: ["Secondary common rest zone."]
          },
          {
            name: "Kitchen",
            probability: 15,
            reasoning: ["Low match correlation: food prep area."]
          }
        ]
      };
      setActiveObject(tempObj);
      setSelectedLocation(tempObj.predictedLocations[0]);
    }
  };

  const handleRecover = (id: string) => {
    markAsRecovered(id);
    
    // Confetti celebration!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1036D6", "#97CEFF", "#10B981"]
    });
  };

  // Helper to color codes
  const getProbabilityColor = (prob: number) => {
    if (prob >= 60) return "text-danger bg-danger/10 border-danger/20";
    if (prob >= 20) return "text-warning bg-warning/10 border-warning/20";
    return "text-accent bg-accent/10 border-accent/20";
  };

  const getHeatmapColorClass = (locationName: string) => {
    if (!activeObject || activeObject.status === "recovered") return "bg-white/5 border-white/10";
    
    const locMatch = activeObject.predictedLocations.find(
      loc => loc.name.toLowerCase().includes(locationName.toLowerCase())
    );

    if (!locMatch) return "bg-white/2 border-white/5 opacity-40";
    
    if (locMatch.probability >= 60) {
      return "bg-danger/20 border-danger/40 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]";
    }
    if (locMatch.probability >= 20) {
      return "bg-warning/20 border-warning/40 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]";
    }
    return "bg-accent/20 border-accent/40 shadow-[inset_0_0_15px_rgba(34,211,238,0.15)]";
  };

  const getHeatmapIntensityLabel = (locationName: string) => {
    if (!activeObject || activeObject.status === "recovered") return "0%";
    const locMatch = activeObject.predictedLocations.find(
      loc => loc.name.toLowerCase().includes(locationName.toLowerCase())
    );
    return locMatch ? `${locMatch.probability}%` : "0%";
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 text-foreground">
      {/* Header Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
          Lost Object Finder
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Predicting location probability using temporal tracking and visual overlays.
        </p>
      </div>

      {/* Search Bar Console */}
      <form onSubmit={handleSearch} className="max-w-2xl flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="What did you lose? (e.g. Wallet, Keys...)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-white/30"
          />
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          Forecasting Location
        </button>
      </form>

      {/* Suggested Quick Triggers */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">Index suggestions:</span>
        {lostObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => {
              setActiveObject(obj);
              if (obj.predictedLocations.length > 0) {
                setSelectedLocation(obj.predictedLocations[0]);
              }
            }}
            className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${
              activeObject?.id === obj.id
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
            }`}
          >
            {obj.name} ({obj.status})
          </button>
        ))}
      </div>

      {/* Main Grid: Forecasts + Heatmap */}
      {activeObject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Probability list & details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-accent animate-spin" />
                    {activeObject.name} Forecast
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    Last traced: {activeObject.lastSeen}
                  </span>
                </div>

                {activeObject.status === "lost" ? (
                  <button
                    onClick={() => handleRecover(activeObject.id)}
                    className="bg-success hover:bg-success/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Found It
                  </button>
                ) : (
                  <span className="text-[10px] bg-success/20 text-success border border-success/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    Recovered
                  </span>
                )}
              </div>

              {activeObject.status === "lost" ? (
                <div className="space-y-3">
                  {activeObject.predictedLocations.map((loc, index) => {
                    const isSelected = selectedLocation?.name === loc.name;
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedLocation(loc)}
                        className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-accent bg-accent/5"
                            : "border-white/5 hover:border-white/10 bg-white/2"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {loc.name}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${getProbabilityColor(loc.probability)}`}>
                            {loc.probability}% Likely
                          </span>
                        </div>

                        {/* Progress meter */}
                        <div className="w-full bg-white/5 rounded-full h-1 my-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${loc.probability}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-1 rounded-full ${
                              loc.probability >= 60 
                                ? "bg-danger" 
                                : loc.probability >= 20 
                                  ? "bg-warning" 
                                  : "bg-accent"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  ✨ This item has been successfully recovered.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: House Heatmap visualization */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-white/5">
                Diagnostic House Heatmap
              </h3>

              {/* Heatmap Grid Drawing */}
              <div className="grid grid-cols-2 gap-4 h-[280px]">
                {[
                  { name: "Bedroom", desc: "Common night drop-off" },
                  { name: "Kitchen", desc: "Counters & island bench" },
                  { name: "Living Room", desc: "Sofas & sideboard shelves" },
                  { name: "Study Room", desc: "Workspace charging stations" }
                ].map((room) => {
                  const probVal = getHeatmapIntensityLabel(room.name);
                  const isHigh = parseInt(probVal) >= 60;
                  return (
                    <div
                      key={room.name}
                      onClick={() => {
                        const matchedLoc = activeObject.predictedLocations.find(
                          l => l.name.toLowerCase().includes(room.name.toLowerCase())
                        );
                        if (matchedLoc) {
                          setSelectedLocation(matchedLoc);
                        }
                      }}
                      className={`rounded-2xl border p-4 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${getHeatmapColorClass(room.name)}`}
                    >
                      {/* Pulse Overlay if high probability */}
                      {isHigh && activeObject.status === "lost" && (
                        <div className="absolute inset-0 bg-danger/5 animate-pulse pointer-events-none" />
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {room.name}
                          </h4>
                          <span className="text-[10px] text-slate-400">{room.desc}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-foreground bg-black/5 dark:bg-black/40 border border-card-border px-2 py-0.5 rounded">
                          {probVal}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-6 self-start group-hover:translate-x-0.5 transition-transform">
                        Verify Diagnostics <ArrowRight className="w-3 h-3 text-accent" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explainability Panel (Updated based on selected location) */}
      <AnimatePresence mode="wait">
        {selectedLocation && activeObject && activeObject.status === "lost" && (
          <motion.div
            key={selectedLocation.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="glass-panel-glow rounded-3xl p-6 border border-white/5 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-primary/5 blur-2xl" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                <h3 className="font-bold text-base text-foreground">
                  Explainability Report: {selectedLocation.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Location confidence:</span>
                <span className="text-accent font-mono font-extrabold text-sm">
                  {selectedLocation.probability}%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Reasoning Checkmarks */}
              <div className="md:col-span-8 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  AI Reasonings & Observations
                </h4>
                
                <div className="space-y-2.5">
                  {selectedLocation.reasoning.map((reason, rIdx) => (
                    <div key={rIdx} className="flex gap-2.5 items-start text-xs text-slate-200 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory context log */}
              <div className="md:col-span-4 p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Spatial Reference Trace
                </h4>
                
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  "OCR scans detect {activeObject.name.toLowerCase()} correlations in photo traces near {selectedLocation.name}. System suggests searching near shelves."
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
