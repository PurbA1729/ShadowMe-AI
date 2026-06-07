"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  StickyNote, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useMemory, Memory } from "@/context/MemoryContext";

export const ReplayView: React.FC = () => {
  const { memories } = useMemory();
  const [selectedDate, setSelectedDate] = useState<string>("June 7, 2026");

  // Get unique dates available in memories
  const dates = ["June 7, 2026", "June 6, 2026", "All Dates"];

  // Filter memories based on date selection
  const filteredMemories = memories.filter(memory => {
    if (selectedDate === "All Dates") return true;
    return memory.displayDate === selectedDate;
  });

  // Sort memories chronologically (earliest to latest in replay)
  const chronologicalMemories = [...filteredMemories].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  // Generate dynamic AI summaries based on selection
  const getAISummary = () => {
    if (selectedDate === "June 7, 2026") {
      return "Your day began at home drafting weekly plans at 09:00 AM, after which you visited Blue Bottle Coffee for espresso. You then completed an office whiteboard brainstorming session for the Q3 roadmap at 02:30 PM. Focus is high, but keys and laptop are flagged as misplaced.";
    } else if (selectedDate === "June 6, 2026") {
      return "Yesterday you finished grocery shopping at Kitchen by noon, leaving your backpack on the bench. Later in the evening at 06:15 PM, you were in the living room and placed your wallet on the entryway table. Wallet has not been photographed since.";
    } else {
      return "Tracing your memory graph across all active dates: You have compiled 5 traces across office, coffee shop, and home zones. Core activities concentrate on work plans, grocery receipt scans, and living room snapshots. Tracking index stable.";
    }
  };

  const getMemoryIcon = (type: Memory["type"]) => {
    switch (type) {
      case "photo": return <ImageIcon className="w-4 h-4 text-accent" />;
      case "receipt": return <FileText className="w-4 h-4 text-success" />;
      case "note": return <StickyNote className="w-4 h-4 text-warning" />;
      default: return <FileText className="w-4 h-4 text-primary" />;
    }
  };

  // Animation stagger configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15, scale: 0.98 },
    show: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 350, damping: 25 }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-6 text-foreground">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
            Replay Your Day
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Chronological memory playback and neural location tracing.
          </p>
        </div>

        {/* Date Selector Buttons */}
        <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1 self-start">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedDate === date
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* AI Summary Block */}
      <motion.div
        key={selectedDate}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glow rounded-3xl p-5 border border-white/5 flex gap-4 relative overflow-hidden"
      >
        <div className="absolute top-[-20px] right-[-20px] w-20 h-20 rounded-full bg-accent/5 blur-xl pointer-events-none" />
        <div className="p-3 rounded-2xl bg-accent/15 border border-accent/30 self-start shadow-inner">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            AI Generated Memory Summary
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
            {getAISummary()}
          </p>
        </div>
      </motion.div>

      {/* Vertical Timeline container */}
      <div className="relative pl-6 md:pl-10 pb-12 mt-6">
        {/* Glowing vertical line */}
        <div className="absolute left-[29px] md:left-[45px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-accent to-white/5 z-0 shadow-[0_0_10px_rgba(99,102,241,0.2)]" />

        <motion.div
          key={selectedDate}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {chronologicalMemories.length > 0 ? (
            chronologicalMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                variants={itemVariants}
                className="relative grid md:grid-cols-12 gap-4 md:gap-8 items-start z-10"
              >
                {/* Timeline node marker (Time & Icon) */}
                <div className="absolute left-[-29px] md:left-[-45px] top-1 z-20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-background border-2 border-accent flex items-center justify-center shadow-lg shadow-accent/20 transition-transform hover:scale-110">
                    {getMemoryIcon(memory.type)}
                  </div>
                </div>

                {/* Left Column: Hour timestamp */}
                <div className="md:col-span-2 flex items-center gap-2 pt-1 font-mono text-xs font-semibold text-accent md:text-right md:justify-end">
                  <Clock className="w-3.5 h-3.5 md:hidden" />
                  {memory.displayTime}
                </div>

                {/* Right Column: Glassmorphic memory card */}
                <div className="md:col-span-10 glass-card rounded-2xl p-5 border border-white/5 space-y-3 relative group overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {memory.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {memory.location}
                      </div>
                    </div>

                    <span className="text-[10px] bg-white/5 border border-white/5 text-slate-400 rounded-lg px-2.5 py-1 uppercase font-bold tracking-wider">
                      {memory.type}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">
                    {memory.content}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {memory.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] bg-white/5 text-slate-400 rounded px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Optional Image thumbnail preview */}
                  {memory.imageUrl && (
                    <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-white/10 group">
                      <div className="absolute inset-0 bg-background/30 group-hover:bg-transparent transition-all z-10" />
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {memory.title} Preview Image Block
                      </div>
                      <div className="absolute bottom-2 left-2 z-20 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[9px] text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                        OCR Detected
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No memories logged on this date.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
