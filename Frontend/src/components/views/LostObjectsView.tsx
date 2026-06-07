"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Sparkles,
  CheckCircle,
  Clock,
  Compass
} from "lucide-react";
import { useMemory, LostObject } from "@/context/MemoryContext";
import confetti from "canvas-confetti";

export const LostObjectsView: React.FC = () => {
  const { lostObjects, markAsRecovered } = useMemory();
  
  // Local state for searching/displaying
  const [searchInput, setSearchInput] = useState("");
  const [activeObjectId, setActiveObjectId] = useState<string | null>(() => {
    const defaultObj = lostObjects.find(o => o.status === "lost");
    return defaultObj ? defaultObj.id : (lostObjects[0]?.id || null);
  });
  const [customLostObject, setCustomLostObject] = useState<LostObject | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(() => {
    const defaultObj = lostObjects.find(o => o.status === "lost");
    return (defaultObj && defaultObj.predictedLocations.length > 0) ? defaultObj.predictedLocations[0].name : null;
  });

  // Dynamically resolve activeObject and selectedLocation on render
  const activeObject = activeObjectId === "temp"
    ? customLostObject
    : (lostObjects.find(o => o.id === activeObjectId) || null);

  const selectedLocation = activeObject
    ? (activeObject.predictedLocations.find(loc => loc.name === selectedLocationName) 
       || activeObject.predictedLocations[0] 
       || null)
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const matched = lostObjects.find(
      obj => obj.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (matched) {
      setActiveObjectId(matched.id);
      if (matched.predictedLocations.length > 0) {
        setSelectedLocationName(matched.predictedLocations[0].name);
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
      setCustomLostObject(tempObj);
      setActiveObjectId("temp");
      setSelectedLocationName(tempObj.predictedLocations[0].name);
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



  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 text-foreground">
      {/* Header Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
          Find My Items
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Estimate coordinates of missing items using recent photo scans and text activity notes.
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
            placeholder="Search for a tracked item... (e.g. Wallet, Keys)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder-white/30 text-foreground"
          />
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-primary/25 cursor-pointer"
        >
          Search Location
        </button>
      </form>

      {/* Suggested Quick Triggers */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500">Tracked items:</span>
        {lostObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => {
              setActiveObjectId(obj.id);
              if (obj.predictedLocations.length > 0) {
                setSelectedLocationName(obj.predictedLocations[0].name);
              }
            }}
            className={`px-3 py-1 rounded-full border cursor-pointer transition-all ${
              activeObjectId === obj.id
                ? "bg-accent/15 text-accent border-accent/30"
                : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
            }`}
          >
            {obj.name} ({obj.status === "lost" ? "missing" : "found"})
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
                        onClick={() => setSelectedLocationName(loc.name)}
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
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Live Search Heatmap
                </h3>
                <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400 font-mono">
                  {activeObject.name === "Laptop" ? "Location: Office HQ" : "Location: Home Apartment"}
                </span>
              </div>

              {/* Interactive Floor Plan Map */}
              <div className="w-full flex items-center justify-center p-2 rounded-2xl bg-black/20 border border-white/5 relative overflow-hidden h-[280px]">
                {activeObject.status === "lost" ? (
                  (() => {
                    // Decide if showing Office or Home layout
                    const isOffice = activeObject.name === "Laptop";

                    // Defined rooms configuration
                    const homeRooms = [
                      { id: "study", name: "Study Room", x: 20, y: 20, w: 160, h: 100, cx: 100, cy: 70 },
                      { id: "bedroom", name: "Bedroom", x: 190, y: 20, w: 190, h: 100, cx: 285, cy: 70 },
                      { id: "living", name: "Living Room", x: 20, y: 130, w: 220, h: 130, cx: 130, cy: 195 },
                      { id: "kitchen", name: "Kitchen", x: 250, y: 130, w: 130, h: 130, cx: 315, cy: 195 }
                    ];

                    const officeRooms = [
                      { id: "meetingA", name: "Meeting Room A", x: 20, y: 20, w: 170, h: 100, cx: 105, cy: 70 },
                      { id: "meetingB", name: "Meeting Room B", x: 200, y: 20, w: 180, h: 100, cx: 290, cy: 70 },
                      { id: "openSpace", name: "Open Workspace", x: 20, y: 130, w: 240, h: 130, cx: 140, cy: 195 },
                      { id: "lounge", name: "Kitchen / Lounge", x: 270, y: 130, w: 110, h: 130, cx: 325, cy: 195 }
                    ];

                    const rooms = isOffice ? officeRooms : homeRooms;

                    // Map room names to predictions to compute probability
                    const searchTerms: Record<string, string[]> = {
                      "Study Room": ["study", "desk", "workspace"],
                      "Bedroom": ["bedroom"],
                      "Living Room": ["living", "sofa", "entryway", "hallway", "console"],
                      "Kitchen": ["kitchen", "dining"],
                      "Meeting Room B": ["room b", "whiteboard"],
                      "Meeting Room A": ["room a"],
                      "Open Workspace": ["open desk", "workspace", "desk"],
                      "Kitchen / Lounge": ["kitchen", "lounge"]
                    };

                    const getProbability = (roomName: string) => {
                      const terms = searchTerms[roomName] || [];
                      const match = activeObject.predictedLocations.find(loc => 
                        terms.some(t => loc.name.toLowerCase().includes(t))
                      );
                      return match ? match.probability : 0;
                    };

                    // Find room with highest probability for beacon placement
                    let highestRoom = rooms[0];
                    let highestProb = 0;
                    rooms.forEach(room => {
                      const p = getProbability(room.name);
                      if (p > highestProb) {
                        highestProb = p;
                        highestRoom = room;
                      }
                    });

                    const handleRoomClick = (roomName: string) => {
                      const terms = searchTerms[roomName] || [];
                      const match = activeObject.predictedLocations.find(loc => 
                        terms.some(t => loc.name.toLowerCase().includes(t))
                      );
                      if (match) {
                        setSelectedLocationName(match.name);
                      }
                    };

                    return (
                      <svg viewBox="0 0 400 280" className="w-full h-full max-w-[420px]">
                        <defs>
                          {/* Radial Glow Gradients for high/medium/low probability rooms */}
                          <radialGradient id="highProbGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.02" />
                          </radialGradient>
                          <radialGradient id="midProbGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                          </radialGradient>
                          <radialGradient id="lowProbGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#97CEFF" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#97CEFF" stopOpacity="0.01" />
                          </radialGradient>
                        </defs>

                        {/* Rooms Layout */}
                        {rooms.map((room) => {
                          const prob = getProbability(room.name);
                          const isSelected = selectedLocation?.name && searchTerms[room.name]?.some(t => 
                            selectedLocation.name.toLowerCase().includes(t)
                          );

                          // Determine overlay color
                          let glowId = "";
                          let fillStroke = "rgba(255, 255, 255, 0.08)";
                          if (prob >= 60) {
                            glowId = "url(#highProbGlow)";
                            fillStroke = "rgba(239, 68, 68, 0.5)";
                          } else if (prob >= 20) {
                            glowId = "url(#midProbGlow)";
                            fillStroke = "rgba(245, 158, 11, 0.4)";
                          } else if (prob > 0) {
                            glowId = "url(#lowProbGlow)";
                            fillStroke = "rgba(151, 206, 255, 0.3)";
                          }

                          return (
                            <g 
                              key={room.id} 
                              onClick={() => handleRoomClick(room.name)}
                              className="cursor-pointer group"
                            >
                              {/* Background room overlay fill */}
                              <rect
                                x={room.x}
                                y={room.y}
                                width={room.w}
                                height={room.h}
                                className="floor-room fill-white/2"
                                rx="12"
                                style={{
                                  stroke: isSelected ? "var(--primary)" : fillStroke,
                                  strokeWidth: isSelected ? "2.5px" : "1.2px"
                                }}
                              />
                              {/* Glow element */}
                              {glowId && (
                                <rect
                                  x={room.x + 2}
                                  y={room.y + 2}
                                  width={room.w - 4}
                                  height={room.h - 4}
                                  fill={glowId}
                                  rx="10"
                                  pointerEvents="none"
                                />
                              )}
                              
                              {/* Room Name label */}
                              <text
                                x={room.cx}
                                y={room.cy}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-300 pointer-events-none tracking-wide"
                              >
                                {room.name}
                              </text>
                              {/* Room Probability label */}
                              <text
                                x={room.cx}
                                y={room.cy + 14}
                                textAnchor="middle"
                                className={`text-[9px] font-mono font-bold pointer-events-none ${
                                  prob >= 60 ? "fill-danger" : prob >= 20 ? "fill-warning" : "fill-slate-400"
                                }`}
                              >
                                {prob}%
                              </text>
                            </g>
                          );
                        })}

                        {/* Pulsing Locator Beacon (placed on highest probability room) */}
                        {highestProb > 0 && (
                          <g transform={`translate(${highestRoom.cx}, ${highestRoom.cy - 22})`} pointerEvents="none">
                            {/* Inner circle */}
                            <circle r="5" fill="#EF4444" />
                            {/* Outer pulsing ring */}
                            <circle r="12" fill="none" stroke="#EF4444" strokeWidth="1.5" className="beacon-pulse" />
                            <circle r="22" fill="none" stroke="#EF4444" strokeWidth="1" className="beacon-pulse animate-delay-[300ms]" style={{ opacity: 0.5 }} />
                          </g>
                        )}
                      </svg>
                    );
                  })()
                ) : (
                  <div className="text-slate-500 text-xs text-center font-medium">
                    ✨ Floor plan inactive. Item has been recovered.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Analysis Panel */}
      <AnimatePresence mode="wait">
        {selectedLocation && activeObject && activeObject.status === "lost" && (
          <motion.div
            key={selectedLocation.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-[-30px] left-[-30px] w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                <h3 className="font-bold text-base text-foreground">
                  Location Analysis Report: {selectedLocation.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Location confidence:</span>
                <span className="text-accent font-mono font-extrabold text-sm">
                  {selectedLocation.probability}%
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Reasoning Checkmarks */}
              <div className="md:col-span-8 space-y-3.5">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Timeline Evidence & Context
                </h4>
                
                <div className="space-y-2.5">
                  {selectedLocation.reasoning.map((reason, rIdx) => (
                    <div key={rIdx} className="flex gap-2.5 items-start text-xs text-slate-200 leading-relaxed font-medium">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory context log */}
              <div className="md:col-span-4 p-4 rounded-2xl bg-white/3 border border-white/5 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Recent References
                </h4>
                
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  Text matching shows recent activity records related to {activeObject.name.toLowerCase()} near {selectedLocation.name}. Index suggests looking nearby.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
