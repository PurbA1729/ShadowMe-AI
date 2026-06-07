"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Brain, 
  Search, 
  Network, 
  Cpu, 
  UploadCloud, 
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

export const LandingView: React.FC = () => {
  const { setActiveTab } = useMemory();
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  // Define floating nodes for the hero visualization
  const nodes = [
    { id: "home", label: "Home", x: 250, y: 150, delay: 0, icon: "🏠" },
    { id: "wallet", label: "Wallet", x: 100, y: 220, delay: 0.5, icon: "💳" },
    { id: "keys", label: "Keys", x: 180, y: 350, delay: 1, icon: "🔑" },
    { id: "coffee", label: "Coffee Shop", x: 380, y: 280, delay: 1.5, icon: "☕" },
    { id: "office", label: "Office", x: 420, y: 120, delay: 2, icon: "💼" },
    { id: "laptop", label: "Laptop", x: 290, y: 320, delay: 2.5, icon: "💻" },
  ];

  const connections = [
    { from: "wallet", to: "home" },
    { from: "keys", to: "coffee" },
    { from: "coffee", to: "office" },
    { from: "office", to: "laptop" },
    { from: "laptop", to: "home" },
    { from: "wallet", to: "laptop" },
    { from: "keys", to: "home" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans">
      {/* Background Neural Grid Art */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Soft Radial Neon Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
              SHADOWME
            </h1>
            <span className="text-[10px] text-accent font-semibold tracking-widest uppercase block mt-[-2px]">
              Memory Reconstruction
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setActiveTab("dashboard")}
          className="glass-panel text-foreground hover:text-primary px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:border-primary/40 flex items-center gap-2 group cursor-pointer"
        >
          Console
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-6 flex flex-col gap-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-center md:self-start bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-accent font-semibold tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Recall Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            Your Second <br />
            <span className="text-gradient-accent">Brain.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0"
          >
            ShadowMe reconstructs forgotten memories and predicts where your lost belongings are most likely located based on your digital traces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4"
          >
            <button
              onClick={() => setActiveTab("dashboard")}
              className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start Remembering
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDemoVideo(true)}
              className="glass-panel hover:bg-primary/5 text-foreground font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all border border-card-border hover:border-primary/20 cursor-pointer"
            >
              <Play className="w-5 h-5 text-accent fill-accent/10" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Hero Interactive Memory Graph Visualizer */}
        <div className="md:col-span-6 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[500px] h-[450px] relative glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center"
          >
            {/* Background scanner lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_75%)]" />
            
            {/* Live SVG Graph Network */}
            <svg className="w-full h-full absolute inset-0 z-10 pointer-events-none">
              <defs>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1036D6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#97CEFF" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Draw Animated Connections */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <g key={idx}>
                    {/* Glowing static line */}
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="url(#glowGrad)"
                      strokeWidth="1.5"
                    />
                    {/* Animated moving pulse */}
                    <motion.circle
                      r="3"
                      fill="#97CEFF"
                      style={{ filter: "drop-shadow(0 0 4px #97CEFF)" }}
                      animate={{
                        cx: [fromNode.x, toNode.x],
                        cy: [fromNode.y, toNode.y],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 2,
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Floating Nodes */}
            {nodes.map((node) => {
              return (
                <motion.div
                  key={node.id}
                  style={{ left: node.x - 45, top: node.y - 35 }}
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 6, 0]
                  }}
                  transition={{
                    duration: 4 + node.delay * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: node.delay
                  }}
                  className="absolute w-24 h-18 rounded-2xl glass-card flex flex-col items-center justify-center p-2 text-center cursor-pointer select-none border border-white/10 hover:border-accent/40 z-20"
                >
                  <span className="text-xl mb-1">{node.icon}</span>
                  <span className="text-[11px] font-semibold tracking-wide text-foreground">{node.label}</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/10 to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Memory Reconstruction Framework</h3>
          <p className="text-slate-400">Everything you need to secure, map, and query your life's traces.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { 
              title: "🧠 Memory Reconstruction", 
              desc: "Relive forgotten moments with detail extraction and semantic search.", 
              color: "text-primary" 
            },
            { 
              title: "🔍 Lost Object Recovery", 
              desc: "Find what you misplaced using spatial probabilistic forecasting.", 
              color: "text-accent" 
            },
            { 
              title: "📊 Memory Intelligence", 
              desc: "Understand structural behavioral patterns and correlation indexes.", 
              color: "text-success" 
            },
            { 
              title: "🕸 Memory Graph", 
              desc: "Visualize connected places, objects, and people interactively.", 
              color: "text-warning" 
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-48"
            >
              <h4 className="font-bold text-lg text-foreground mb-2">{feat.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-semibold cursor-pointer">
                Learn tech details <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Neural Memory Loop</h3>
          <p className="text-slate-400">How our AI reconstructions turn digital dust into spatial answers.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Bar on Desktop */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 z-0" />

          {[
            {
              step: "Step 1",
              title: "Upload Memories",
              items: ["Photos", "Receipts", "Notes"],
              icon: UploadCloud,
              color: "border-primary"
            },
            {
              step: "Step 2",
              title: "AI Processes",
              items: ["OCR Scanning", "Object Detection", "Graph Mapping"],
              icon: Cpu,
              color: "border-accent"
            },
            {
              step: "Step 3",
              title: "Memory Reconstruction",
              items: ["Timeline Synthesis", "Activity Logs", "Glow Links"],
              icon: Brain,
              color: "border-success"
            },
            {
              step: "Step 4",
              title: "Lost Object Prediction",
              items: ["Heatmap Highlights", "Confidence Indexes", "Reasoning Reports"],
              icon: Search,
              color: "border-warning"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                {/* Step Icon Badge */}
                <div className={`w-12 h-12 rounded-full glass-panel border ${item.color} flex items-center justify-center text-foreground mb-4 shadow-lg shadow-black/5 dark:shadow-white/5`}>
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                
                <span className="text-xs text-accent font-semibold tracking-widest uppercase mb-1">{item.step}</span>
                <h4 className="font-bold text-foreground mb-3 text-base">{item.title}</h4>
                
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  {item.items.map((i, l) => (
                    <span key={l} className="flex items-center gap-1.5 justify-center">
                      <CheckCircle className="w-3 h-3 text-success/70" />
                      {i}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Watch Demo Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/10 relative p-1 shadow-2xl">
            <button
              onClick={() => setShowDemoVideo(false)}
              className="absolute top-4 right-4 bg-white/5 border border-white/10 rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-50 cursor-pointer"
            >
              ✕
            </button>
            <div className="aspect-video w-full bg-background flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Brain className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h4 className="text-xl font-bold text-foreground mb-2">ShadowMe Interactive Demonstration</h4>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                This interactive portal allows full traversal of the Memory Graph, Heatmaps, and AI Assistant. Tap "Start Remembering" to launch the environment.
              </p>
              <button
                onClick={() => {
                  setShowDemoVideo(false);
                  setActiveTab("dashboard");
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer"
              >
                Launch App Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10">
        © 2026 ShadowMe AI. Built for the Premium Memory Reconstruction Hackathon. All rights reserved.
      </footer>
    </div>
  );
};
