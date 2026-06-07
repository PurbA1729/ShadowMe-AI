"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Brain, 
  Image as ImageIcon, 
  FileText, 
  StickyNote, 
  MapPin, 
  Calendar,
  Eye
} from "lucide-react";
import { useMemory, Memory, TabType } from "@/context/MemoryContext";

export const DashboardView: React.FC = () => {
  const { memories, lostObjects, setActiveTab } = useMemory();

  // Statistics calculations
  const totalMemories = memories.length;
  const objectsTracked = lostObjects.length;
  const recoveredItems = lostObjects.filter(o => o.status === "recovered").length;
  
  // Average confidence
  const avgConfidence = Math.round(
    memories.reduce((acc, m) => acc + m.confidence, 0) / (memories.length || 1)
  );

  // Icon selector based on memory type
  const getMemoryIcon = (type: Memory["type"]) => {
    switch (type) {
      case "photo":
        return <ImageIcon className="w-4 h-4 text-accent" />;
      case "receipt":
        return <FileText className="w-4 h-4 text-success" />;
      case "note":
        return <StickyNote className="w-4 h-4 text-warning" />;
      default:
        return <FileText className="w-4 h-4 text-primary" />;
    }
  };

  // Helper to get type styling
  const getTypeBadgeStyle = (type: Memory["type"]) => {
    switch (type) {
      case "photo":
        return "bg-accent/10 text-accent border-accent/20";
      case "receipt":
        return "bg-success/10 text-success border-success/20";
      case "note":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  // Radial gauge parameters
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (avgConfidence / 100) * circumference;

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 text-foreground">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Local indexing status for your items, locations, and records.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("upload")}
          className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/25 cursor-pointer transition-transform hover:scale-[1.02] self-start"
        >
          <Plus className="w-4 h-4" />
          Add Memories
        </button>
      </div>

      {/* Grid of Stats & Circle Gauge */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Statistics Cards */}
        <div className="md:col-span-8 grid grid-cols-2 gap-4">
          {[
            { label: "Memory Traces", value: totalMemories, sub: "Total indexed records", color: "border-primary/20" },
            { label: "Tracked Items", value: objectsTracked, sub: "Unique items in system", color: "border-accent/20" },
            { label: "Located Items", value: recoveredItems, sub: "Successfully recovered", color: "border-success/20" },
            { label: "Active Searches", value: objectsTracked - recoveredItems, sub: "Currently missing items", color: "border-danger/20" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`glass-card rounded-2xl p-5 border ${stat.color} flex flex-col justify-between h-[125px]`}
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
              <span className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight my-1 text-foreground">
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{stat.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Confidence Gauge Widget */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-4 glass-panel rounded-2xl p-5 border border-white/5 flex flex-col items-center justify-between min-h-[266px] relative overflow-hidden"
        >
          <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider self-start">
            Search Index Confidence
          </span>

          {/* SVG Circular Dial */}
          <div className="relative w-36 h-36 flex items-center justify-center my-3">
            <svg className="w-full h-full transform -rotate-90">
              {/* Underlay Circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-white/5"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Glowing Overlay Progress Circle */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-primary"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(16, 54, 214, 0.4))" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold font-mono text-foreground">{avgConfidence}%</span>
              <span className="text-[9px] font-bold text-primary tracking-widest uppercase mt-0.5">Reliability</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
            Your spatial search indexing status is **stable**. Recent receipts and note overlays support high location certainty.
          </p>
        </motion.div>
      </motion.div>

      {/* Main Bottom Section: Timeline & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Memories Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent animate-pulse" />
              Timeline Activity
            </h3>
            <button
              onClick={() => setActiveTab("replay")}
              className="text-xs text-accent hover:text-accent/80 font-bold flex items-center gap-1 cursor-pointer"
            >
              Full Playback <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {memories.map((memory, index) => {
              // Set border glow color based on type
              const borderStyles: Record<string, string> = {
                photo: "border-l-accent",
                receipt: "border-l-success",
                note: "border-l-warning",
                document: "border-l-primary"
              };
              const leftBorder = borderStyles[memory.type] || "border-l-white/5";

              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-2xl p-5 border border-white/5 border-l-3 ${leftBorder} flex flex-col gap-3 relative overflow-hidden`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/3 border border-white/5">
                        {getMemoryIcon(memory.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{memory.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {memory.displayDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {memory.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Confidence Badge */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confidence</span>
                      <span className="text-xs font-bold text-accent font-mono">{memory.confidence}%</span>
                    </div>
                  </div>

                  {/* Content description */}
                  <p className="text-slate-300 text-xs leading-relaxed font-normal line-clamp-2">
                    {memory.content}
                  </p>

                  {/* Tags row */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {memory.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-white/3 border border-white/5 text-slate-400 rounded-lg px-2 py-0.5 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className={`text-[10px] uppercase font-bold border rounded-lg px-2 py-0.5 ${getTypeBadgeStyle(memory.type)}`}>
                      {memory.type}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Widgets Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-2 border-b border-white/5">
              Quick Tools
            </h3>
            
            <div className="space-y-3">
              {[
                { label: "Lost Object Finder", tab: "lost-objects", text: "Estimate location probabilities on 2D floor plans." },
                { label: "Semantic Connection Map", tab: "graph", text: "Explore connected moments, items, and places." },
                { label: "Chat Assistant", tab: "chat", text: "Search your timeline records with natural query flows." }
              ].map((act, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(act.tab as TabType)}
                  className="w-full text-left p-3.5 rounded-xl border border-white/5 hover:border-primary/20 bg-white/1 hover:bg-white/3 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                      {act.label}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-medium">{act.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pulse Status Panel */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden flex flex-col justify-between h-44">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-success/15 border border-success/30 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
              <span className="text-[8px] text-success font-bold tracking-wider uppercase">Active</span>
            </div>
            
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Index Status</span>
            
            <div className="my-2">
              <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                <span className="text-slate-400">Indexing Speed</span>
                <span className="text-accent font-bold">1,492 links / sec</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary to-accent h-1 rounded-full"
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal font-medium">
              Shadow runs secure local processing to map your text records, timeline items, and image vectors into an active search index.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
