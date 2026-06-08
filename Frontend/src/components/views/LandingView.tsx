"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  HelpCircle,
  Calendar,
  MapPin,
  Clock,
  Compass,
  Database,
  ArrowRightLeft
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

// Detailed mock information for interactive graph hover states
interface NodeDetail {
  title: string;
  category: string;
  status: "missing" | "active" | "safe";
  confidence?: number;
  lastSeen: string;
  details: string;
}

const nodeDetailsMap: Record<string, NodeDetail> = {
  home: {
    title: "Home Hub",
    category: "Primary Zone",
    status: "active",
    lastSeen: "Synced 5m ago",
    details: "Central coordinate for 90% of spatial traces. Historical tracking highlights Entryway Console and Study Desk as key drop locations."
  },
  wallet: {
    title: "Leather Wallet",
    category: "RFID Tracker",
    status: "missing",
    confidence: 74,
    lastSeen: "Living Room Photo (June 6)",
    details: "Last captured on the entryway table. Predictive engine forecasts it resides on the Study Table due to phone charging behavior correlation."
  },
  keys: {
    title: "House Keyring",
    category: "Physical Anchor",
    status: "missing",
    confidence: 68,
    lastSeen: "Coffee Receipt (June 7)",
    details: "Keys were left on coffee shop counter during purchase. Path loop tracking places them at Kitchen Island bench upon return."
  },
  coffee: {
    title: "Blue Bottle Coffee",
    category: "Place Anchor",
    status: "safe",
    lastSeen: "Checked out June 7, 10:15 AM",
    details: "Parsed transaction: 1x Double Espresso, 1x Avocado Toast ($14.50). Keys registered on counter via receipt metadata."
  },
  office: {
    title: "Headquarters Room B",
    category: "Work Location",
    status: "safe",
    lastSeen: "Visited June 7, 02:30 PM",
    details: "Whiteboard roadmap notes scanned via optical recognition. Work laptop registered in vicinity."
  },
  laptop: {
    title: "Work Laptop",
    category: "Hardware",
    status: "safe",
    confidence: 95,
    lastSeen: "Office Whiteboard (June 7)",
    details: "Visual validation confirms laptop sitting on meeting room table. Status secure."
  }
};

// Interactive sandbox queries
interface SandboxQuery {
  id: string;
  buttonLabel: string;
  queryText: string;
  nodes: string[];
  logs: string[];
  result: {
    title: string;
    badge: string;
    confidence: string;
    location: string;
    reason: string;
    icon: string;
  };
}

const sandboxQueries: SandboxQuery[] = [
  {
    id: "keys",
    buttonLabel: "Where are my keys?",
    queryText: "Where is my keyring? I can't find it since my coffee trip.",
    nodes: ["keys", "coffee", "home"],
    logs: [
      "Parsing natural language syntax...",
      "Resolving object entities -> [keys, keyring]",
      "Scanning transactional ledger for Blue Bottle Coffee...",
      "Extracting spatial markers: keys detected on counter at 10:15 AM",
      "Tracing return path: garage entry to kitchen island (12:00 PM)",
      "Synthesizing behavior heatmaps: 68% probability kitchen island..."
    ],
    result: {
      title: "House Keys",
      badge: "Lost Object",
      confidence: "68%",
      location: "Kitchen Counter",
      reason: "Keys were left on counter during coffee checkout. You returned home and immediately dropped groceries on the kitchen island table.",
      icon: "🔑"
    }
  },
  {
    id: "wallet",
    buttonLabel: "Where did I put my wallet?",
    queryText: "Locate my black leather wallet.",
    nodes: ["wallet", "home", "laptop"],
    logs: [
      "Parsing natural language syntax...",
      "Scanning optical database frames...",
      "Matched: Entryway console photo from June 6, 6:15 PM (94% confidence)",
      "Parsing personal note drafts: 'remember to pack wallet in black backpack'",
      "Correlating charger connection times at study table...",
      "Predicting final drop zone..."
    ],
    result: {
      title: "Leather Wallet",
      badge: "Lost Object",
      confidence: "74%",
      location: "Study Table Desk",
      reason: "Although notes state intent to pack in backpack, charger telemetry indicates you cleaned your study desk later and placed the wallet beside your laptop.",
      icon: "💳"
    }
  },
  {
    id: "coffee",
    buttonLabel: "What did I buy at Blue Bottle?",
    queryText: "Show details of my Blue Bottle coffee visit.",
    nodes: ["coffee", "home"],
    logs: [
      "Locating transaction receipts...",
      "Match found: Blue Bottle receipt (June 7, 10:15 AM)",
      "Running optical text parse on receipt item list...",
      "Found items: Double Espresso ($4.50), Avocado Toast ($10.00)",
      "Extracting location metadata: Coffee Shop - Blue Bottle"
    ],
    result: {
      title: "Coffee Receipt Scan",
      badge: "Financial Trace",
      confidence: "100%",
      location: "Blue Bottle Coffee ($14.50)",
      reason: "Itemized transaction: 1x Double Espresso, 1x Avocado Toast. Paid with Visa ending in 4242.",
      icon: "☕"
    }
  }
];

export const LandingView: React.FC = () => {
  const { setActiveTab } = useMemory();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  
  // Interactive Node state
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Interactive Sandbox state
  const [activeQueryId, setActiveQueryId] = useState<string>("keys");
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [showSandboxResult, setShowSandboxResult] = useState(true);
  const [sandboxHighlightNodes, setSandboxHighlightNodes] = useState<string[]>(["keys", "coffee", "home"]);

  // Set default initial sandbox state
  const activeQuery = sandboxQueries.find(q => q.id === activeQueryId) || sandboxQueries[0];

  // Run sandbox query simulation
  const runSandboxSimulation = (queryId: string) => {
    if (isSandboxRunning) return;
    
    setActiveQueryId(queryId);
    setIsSandboxRunning(true);
    setShowSandboxResult(false);
    setSandboxLogs([]);
    
    const targetQuery = sandboxQueries.find(q => q.id === queryId)!;
    setSandboxHighlightNodes([targetQuery.nodes[0]]); // Highlight primary query node first
    
    let logIdx = 0;
    const interval = setInterval(() => {
      if (logIdx < targetQuery.logs.length) {
        setSandboxLogs(prev => [...prev, targetQuery.logs[logIdx]]);
        
        // Dynamically add nodes to highlight as the logs traverse the graph
        if (logIdx === 2 && targetQuery.nodes[1]) {
          setSandboxHighlightNodes(prev => [...prev, targetQuery.nodes[1]]);
        }
        if (logIdx === 4 && targetQuery.nodes[2]) {
          setSandboxHighlightNodes(prev => [...prev, targetQuery.nodes[2]]);
        }
        
        logIdx++;
      } else {
        clearInterval(interval);
        setIsSandboxRunning(false);
        setShowSandboxResult(true);
        // Full highlight of all path nodes
        setSandboxHighlightNodes(targetQuery.nodes);
      }
    }, 400);
  };

  const nodes = [
    { id: "home", label: "Home Hub", x: 250, y: 150, delay: 0, icon: "🏠" },
    { id: "wallet", label: "Wallet Trace", x: 95, y: 220, delay: 0.5, icon: "💳" },
    { id: "keys", label: "Keys Anchor", x: 180, y: 350, delay: 1, icon: "🔑" },
    { id: "coffee", label: "Coffee Shop", x: 380, y: 280, delay: 1.5, icon: "☕" },
    { id: "office", label: "Office", x: 420, y: 120, delay: 2, icon: "💼" },
    { id: "laptop", label: "Laptop", x: 290, y: 325, delay: 2.5, icon: "💻" },
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative font-sans">
      {/* Background Neural Grid Art */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Soft Radial Neon Glows (Premium Ambient Design) */}
      <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-primary/15 to-accent/5 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-accent/8 to-primary/3 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-foreground to-slate-400 bg-clip-text text-transparent">
              SHADOWME
            </h1>
            <span className="text-[9px] text-accent font-semibold tracking-widest uppercase block mt-[-2px]">
              Memory Reconstruction
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setActiveTab("dashboard")}
          className="glass-panel hover:bg-primary/5 text-foreground hover:text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:border-primary/40 flex items-center gap-2 group cursor-pointer"
        >
          Console Entry
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-6 flex flex-col gap-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 self-center md:self-start bg-primary/10 border border-primary/20 rounded-full px-4.5 py-1.5 text-xs text-accent font-bold tracking-wide shadow-[0_0_15px_rgba(16,54,214,0.06)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Spatial Recall Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7.5xl font-extrabold tracking-tight leading-[0.95] text-gradient-primary"
          >
            Your Second <br />
            <span className="text-gradient-accent">Spatial Brain.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 font-medium"
          >
            ShadowMe automatically reconstructs missing memory linkages and calculates physical locations of your lost belongings using cognitive digital traces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-4"
          >
            <button
              onClick={() => setActiveTab("dashboard")}
              className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start Remembering
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDemoVideo(true)}
              className="glass-panel hover:bg-primary/5 text-foreground font-bold px-8 py-4.5 rounded-2xl flex items-center justify-center gap-2.5 transition-all border border-card-border hover:border-primary/20 cursor-pointer"
            >
              <Play className="w-5 h-5 text-accent fill-accent/10" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Hero Interactive Memory Graph Visualizer */}
        <div className="md:col-span-6 flex flex-col justify-center items-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,54,214,0.06)_0%,transparent_70%)] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[500px] h-[450px] relative glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center bg-background/20 backdrop-blur-xl"
          >
            {/* Background scanner overlays */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-accent/5 border border-accent/10 rounded-lg px-2.5 py-1 z-20 text-[10px] text-accent font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              GRAPH NODE SENSOR ACTIVE
            </div>
            
            {/* Live SVG Graph Network */}
            <svg className="w-full h-full absolute inset-0 z-10 pointer-events-none">
              <defs>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1036D6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#97CEFF" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="activeGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Draw Animated Connections */}
              {connections.map((conn, idx) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                
                // Highlight line if either node is highlighted in the sandbox
                const isConnectionHighlighted = sandboxHighlightNodes.includes(conn.from) && sandboxHighlightNodes.includes(conn.to);
                
                return (
                  <g key={idx}>
                    {/* Glowing static line */}
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isConnectionHighlighted ? "url(#activeGlowGrad)" : "url(#glowGrad)"}
                      strokeWidth={isConnectionHighlighted ? "2.5" : "1.5"}
                      animate={isConnectionHighlighted ? { strokeDasharray: ["0,10", "10,0"], strokeWidth: [2.5, 3.5, 2.5] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                    />
                    {/* Animated moving pulse */}
                    <motion.circle
                      r={isConnectionHighlighted ? "4" : "3"}
                      fill={isConnectionHighlighted ? "#06b6d4" : "#97CEFF"}
                      style={{ filter: isConnectionHighlighted ? "drop-shadow(0 0 6px #06b6d4)" : "drop-shadow(0 0 4px #97CEFF)" }}
                      animate={{
                        cx: [fromNode.x, toNode.x],
                        cy: [fromNode.y, toNode.y],
                      }}
                      transition={{
                        duration: (isConnectionHighlighted ? 1.5 : 3) + Math.random() * 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 1.5,
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Floating Interactive Nodes */}
            {nodes.map((node) => {
              const isSandboxHighlighted = sandboxHighlightNodes.includes(node.id);
              const isHovered = hoveredNode === node.id || selectedNode === node.id;
              
              return (
                <div
                  key={node.id}
                  style={{ left: node.x - 45, top: node.y - 35 }}
                  className="absolute z-20"
                >
                  <motion.button
                    type="button"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    animate={{
                      y: [0, -8, 0],
                      x: [0, 5, 0],
                      scale: isHovered ? 1.05 : 1
                    }}
                    transition={{
                      duration: 4 + node.delay * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: node.delay
                    }}
                    className={`w-24 h-18 rounded-2xl glass-card flex flex-col items-center justify-center p-2 text-center cursor-pointer select-none border transition-all duration-300 relative ${
                      isSandboxHighlighted
                        ? "border-accent shadow-[0_0_15px_rgba(151,206,255,0.3)] bg-primary/20"
                        : isHovered
                          ? "border-primary/50 bg-primary/5 shadow-lg"
                          : "border-white/5"
                    }`}
                  >
                    <span className="text-xl mb-0.5">{node.icon}</span>
                    <span className="text-[10px] font-bold tracking-wide text-foreground">{node.label}</span>
                    {/* Ring highlight for sandbox */}
                    {isSandboxHighlighted && (
                      <span className="absolute inset-0 rounded-2xl border border-accent animate-ping opacity-60 pointer-events-none" />
                    )}
                  </motion.button>
                </div>
              );
            })}

            {/* Node detail tooltip overlay */}
            <AnimatePresence>
              {(hoveredNode || selectedNode) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-4 left-4 right-4 z-30 glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl bg-slate-900/90 backdrop-blur-xl"
                >
                  {(() => {
                    const activeInfo = nodeDetailsMap[hoveredNode || selectedNode || ""];
                    if (!activeInfo) return null;
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-white">{activeInfo.title}</h4>
                            <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300 uppercase font-semibold">
                              {activeInfo.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {activeInfo.status === "missing" ? (
                              <span className="text-[9px] text-danger font-bold uppercase tracking-wider bg-danger/15 px-2 py-0.5 rounded-full border border-danger/30">
                                MISSING ({activeInfo.confidence}%)
                              </span>
                            ) : (
                              <span className="text-[9px] text-success font-bold uppercase tracking-wider bg-success/15 px-2 py-0.5 rounded-full border border-success/30">
                                {activeInfo.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-normal">{activeInfo.details}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 border-t border-white/5 pt-1.5 mt-1">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>Last trace: {activeInfo.lastSeen}</span>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="text-[10px] text-slate-500 font-mono mt-3">
            *Hover or tap nodes in the map above to inspect live memory anchors.
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Query Playground */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 bg-gradient-to-b from-transparent via-primary/2 to-transparent">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-3">Live Simulation Sandbox</h3>
          <p className="text-slate-400 text-sm">Experience the cognitive retrieval logic in real-time. Choose a query below to fire the neural tracer.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Query Selection & Logs Panel */}
          <div className="md:col-span-6 flex flex-col justify-between glass-panel rounded-3xl border border-white/5 p-6 backdrop-blur-md">
            <div>
              <h4 className="font-extrabold text-sm text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                Select Cognitive Request
              </h4>
              
              <div className="flex flex-col gap-2 mb-6">
                {sandboxQueries.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => runSandboxSimulation(item.id)}
                    disabled={isSandboxRunning}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-bold flex items-center justify-between cursor-pointer ${
                      activeQueryId === item.id 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/15" 
                        : "border-white/5 bg-white/2 text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.buttonLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Live Console Log Terminal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-b border-white/5 pb-2">
                <span>SEMANTIC RETRIEVAL PROCESSOR</span>
                <span className="animate-pulse text-primary font-bold">READY</span>
              </div>
              
              <div className="bg-black/40 rounded-xl p-4 min-h-[160px] font-mono text-[11px] text-slate-300 leading-normal flex flex-col gap-2 border border-white/5">
                <div className="text-slate-500 italic mb-1">
                  &gt; Query: "{activeQuery.queryText}"
                </div>
                {sandboxLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-1.5"
                  >
                    <span className="text-primary font-bold">&gt;&gt;</span>
                    <span>{log}</span>
                  </motion.div>
                ))}
                {isSandboxRunning && (
                  <div className="flex items-center gap-1.5 text-accent animate-pulse">
                    <span>█</span>
                    <span className="text-[10px]">Processing cognitive synapses...</span>
                  </div>
                )}
                {!isSandboxRunning && sandboxLogs.length === 0 && (
                  <div className="text-slate-500 italic mt-6 text-center">
                    Select a query above to trace the graph connections.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Result Visual Panel */}
          <div className="md:col-span-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {showSandboxResult ? (
                <motion.div
                  key={activeQueryId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel rounded-3xl border border-primary/20 shadow-2xl p-6.5 relative overflow-hidden bg-gradient-to-tr from-background to-primary/5 flex flex-col justify-between h-full"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  
                  {/* Category badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-primary/15 border border-primary/30 text-accent font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {activeQuery.result.badge}
                    </span>
                    <span className="text-2xl">{activeQuery.result.icon}</span>
                  </div>

                  {/* Highlight Result */}
                  <div className="my-6">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estimated Object Location</span>
                    <h4 className="text-2xl font-extrabold text-white tracking-tight">{activeQuery.result.location}</h4>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-lg text-accent text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-accent" />
                        <span>{activeQuery.result.confidence} Confidence</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Calculated by cognitive anchor map</span>
                    </div>
                  </div>

                  {/* Reasoning block */}
                  <div className="border-t border-white/5 pt-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">AI Synthesis Reasoning</span>
                    <p className="text-slate-300 text-xs leading-relaxed italic">
                      "{activeQuery.result.reason}"
                    </p>
                  </div>

                  {/* Sandbox CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      <span>Data nodes: {activeQuery.nodes.length} mapped</span>
                    </div>
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="text-xs text-accent hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Try with your own data <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-panel rounded-3xl border border-white/5 p-6 h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <Cpu className="w-12 h-12 text-primary/50 animate-spin mb-4" />
                  <h4 className="font-extrabold text-sm text-foreground mb-1">Executing Query Model</h4>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Analyzing node paths, receipt ledger markers, and geolocation logs. Result outputs in seconds...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
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
              desc: "Relive forgotten moments with detail extraction, visual parsing, and semantic timeline search.", 
              color: "text-primary" 
            },
            { 
              title: "🔍 Lost Object Recovery", 
              desc: "Trace what you misplaced using spatial probabilistic forecasting based on visual evidence.", 
              color: "text-accent" 
            },
            { 
              title: "📊 Memory Intelligence", 
              desc: "Identify structural behavior correlation patterns and check transaction ledger history.", 
              color: "text-success" 
            },
            { 
              title: "🕸 Memory Graph Map", 
              desc: "Explore a dynamic SVG network diagram connecting places, objects, notes, and photos.", 
              color: "text-warning" 
            }
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl p-6.5 border border-white/5 flex flex-col justify-between h-52 backdrop-blur-md"
            >
              <div>
                <h4 className="font-bold text-base text-foreground mb-2">{feat.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
              <div 
                onClick={() => setActiveTab("dashboard")}
                className="mt-4 flex items-center gap-1 text-xs text-accent font-semibold cursor-pointer hover:underline"
              >
                Launch dashboard <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Neural Memory Loop</h3>
          <p className="text-slate-400 text-sm">How our system turns unstructured records into spatial certainty.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Bar on Desktop */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-primary/10 via-accent/20 to-primary/10 z-0" />

          {[
            {
              step: "Step 1",
              title: "Upload Memories",
              items: ["Camera Photos", "Store Receipts", "Voice/Text Notes"],
              icon: UploadCloud,
              color: "border-primary"
            },
            {
              step: "Step 2",
              title: "Cognitive Parsing",
              items: ["OCR Processing", "Object Detection", "Timestamp Anchors"],
              icon: Cpu,
              color: "border-accent"
            },
            {
              step: "Step 3",
              title: "Graph Synthesis",
              items: ["Neural Entity Mapping", "Location Clusters", "Sequence Correlation"],
              icon: Brain,
              color: "border-success"
            },
            {
              step: "Step 4",
              title: "Spatial Search",
              items: ["Probability Heatmaps", "Confidence Indexing", "Reasoning Logs"],
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
                
                <span className="text-[10px] text-accent font-bold tracking-widest uppercase mb-1">{item.step}</span>
                <h4 className="font-bold text-foreground mb-3 text-sm">{item.title}</h4>
                
                <div className="flex flex-col gap-1 text-[11px] text-slate-400">
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
          <div className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-white/10 relative p-1 shadow-2xl bg-slate-900/90">
            <button
              onClick={() => setShowDemoVideo(false)}
              className="absolute top-4 right-4 bg-white/5 border border-white/10 rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-50 cursor-pointer text-xs"
            >
              ✕
            </button>
            <div className="aspect-video w-full bg-background flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <Brain className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h4 className="text-xl font-bold text-white mb-2">ShadowMe Interactive Demonstration</h4>
              <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                This sandbox portal demonstrates cognitive memory graph queries, location confidence analysis, and optical receipt scanning. Launch the console to try it yourself.
              </p>
              <button
                onClick={() => {
                  setShowDemoVideo(false);
                  setActiveTab("dashboard");
                }}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer text-xs"
              >
                Launch App Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-xs text-slate-500 relative z-10">
        © 2026 ShadowMe AI. Built for the Premium Memory Reconstruction Hackathon. All rights reserved.
      </footer>
    </div>
  );
};
