"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCcw, 
  MousePointer, 
  Sparkles,
  Layers,
  Info,
  Home,
  Wallet,
  Key,
  Coffee,
  Briefcase,
  Laptop,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  type: "place" | "object" | "trace";
  details: string;
}

interface Link {
  from: string;
  to: string;
}

export const GraphView: React.FC = () => {
  const { memories } = useMemory();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Interactive zoom & pan states
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to render node vector icons
  const getNodeIcon = (nodeId: string, className = "w-4 h-4") => {
    switch (nodeId) {
      case "home":
        return <Home className={`${className} text-primary`} />;
      case "wallet":
        return <Wallet className={`${className} text-accent`} />;
      case "keys":
        return <Key className={`${className} text-success`} />;
      case "coffee":
        return <Coffee className={`${className} text-warning`} />;
      case "office":
        return <Briefcase className={`${className} text-primary`} />;
      case "laptop":
        return <Laptop className={`${className} text-accent`} />;
      case "whiteboard":
        return <ImageIcon className={`${className} text-slate-400`} />;
      default:
        return <FileText className={`${className} text-slate-300`} />;
    }
  };

  // Nodes definition
  const nodes: Node[] = [
    { id: "home", label: "Home", x: 300, y: 220, icon: "🏠", type: "place", details: "Your primary residence. Maps activities across the kitchen, study table, and living room console table." },
    { id: "wallet", label: "Wallet", x: 120, y: 150, icon: "💳", type: "object", details: "Brown leather wallet (status: MISSING). Last verified photo trace shows it on the entryway console shelf. Estimated to be on your study table." },
    { id: "keys", label: "Keys", x: 160, y: 350, icon: "🔑", type: "object", details: "House keyring (status: MISSING). Last traced to Blue Bottle Coffee at 10:14 AM. Estimated to be in the kitchen." },
    { id: "coffee", label: "Coffee Shop", x: 480, y: 320, icon: "☕", type: "place", details: "Blue Bottle Coffee on Market St. Visited yesterday morning to pick up an espresso and toast." },
    { id: "office", label: "Office", x: 550, y: 140, icon: "💼", type: "place", details: "Corporate office location. Synced with Room B whiteboard brainstorming notes uploaded today." },
    { id: "laptop", label: "Laptop", x: 360, y: 380, icon: "💻", type: "object", details: "Work laptop (status: LOCATED). Visually verified under the whiteboard on the desk in meeting Room B." },
    { id: "whiteboard", label: "Whiteboard", x: 500, y: 230, icon: "📸", type: "trace", details: "Photo trace (mem-1). Brainstorming notes showing database layout plans and meeting notes." },
  ];

  // Links definition
  const links: Link[] = [
    { from: "wallet", to: "home" },
    { from: "keys", to: "home" },
    { from: "keys", to: "coffee" },
    { from: "wallet", to: "laptop" },
    { from: "laptop", to: "office" },
    { from: "office", to: "whiteboard" },
    { from: "laptop", to: "whiteboard" },
    { from: "coffee", to: "office" },
  ];

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking background, not nodes
    if ((e.target as HTMLElement).tagName === "svg" || (e.target as HTMLElement).id === "bg-layer") {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslate({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const newScale = e.deltaY < 0 ? scale + zoomFactor : scale - zoomFactor;
    setScale(Math.max(0.5, Math.min(2, newScale)));
  };

  const zoomIn = () => setScale(prev => Math.min(2, prev + 0.15));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.15));
  const resetViewport = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Helper to check if a node/link is highlighted
  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNode) return true;
    if (selectedNode === nodeId) return true;
    return links.some(
      l => (l.from === selectedNode && l.to === nodeId) || (l.to === selectedNode && l.from === nodeId)
    );
  };

  const isLinkHighlighted = (link: Link) => {
    if (!selectedNode) return true;
    return link.from === selectedNode || link.to === selectedNode;
  };

  const getSelectedNodeDetails = () => {
    return nodes.find(n => n.id === selectedNode);
  };

  // Find matching memories for selected node
  const getAssociatedMemories = () => {
    if (!selectedNode) return [];
    const nodeObj = nodes.find(n => n.id === selectedNode);
    if (!nodeObj) return [];
    
    return memories.filter(m => 
      m.title.toLowerCase().includes(nodeObj.label.toLowerCase()) || 
      m.tags.some(t => t.toLowerCase() === nodeObj.id.toLowerCase() || t.toLowerCase() === nodeObj.label.toLowerCase()) ||
      m.content.toLowerCase().includes(nodeObj.label.toLowerCase()) ||
      m.location.toLowerCase().includes(nodeObj.label.toLowerCase())
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 text-foreground h-[calc(100vh-100px)] flex flex-col">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
            Connection Map
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            A visual map of semantic connections between your places, items, and records.
          </p>
        </div>
      </div>

      {/* Main Graph Playground Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* SVG Editor Area */}
        <div className="lg:col-span-8 flex flex-col bg-white/2 rounded-3xl border border-white/5 relative overflow-hidden h-full min-h-[350px]">
          {/* Background scanner net */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_75%)] pointer-events-none" />
          
          {/* Zoom/Pan Toolbar */}
          <div className="absolute top-4 left-4 z-20 flex bg-background/80 backdrop-blur border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={zoomIn}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetViewport}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              title="Reset Viewport"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-background/60 border border-white/5 px-2.5 py-1 rounded-full text-[9px] text-slate-400">
            <MousePointer className="w-3 h-3 text-accent" />
            Drag canvas to pan • Scroll to zoom
          </div>

          {/* Interactive Graph Canvas */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="flex-1 w-full h-full cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "none" }}
          >
            <svg
              id="bg-layer"
              className="w-full h-full"
              style={{ pointerEvents: "all" }}
            >
              {/* Definition tags */}
              <defs>
                <linearGradient id="lineGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1036D6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#97CEFF" stopOpacity="0.5" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Viewport Scale/Translate Group */}
              <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
                
                {/* Draw connection lines */}
                {links.map((link, idx) => {
                  const fromNode = nodes.find(n => n.id === link.from);
                  const toNode = nodes.find(n => n.id === link.to);
                  if (!fromNode || !toNode) return null;
                  
                  const isHighlighted = isLinkHighlighted(link);
                  
                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="url(#lineGlowGrad)"
                        strokeWidth={isHighlighted ? "2" : "0.5"}
                        className="transition-all duration-300"
                        style={{ opacity: isHighlighted ? 1 : 0.15 }}
                      />
                      {/* Flowing electric dot */}
                      {isHighlighted && (
                        <motion.circle
                          r="2.5"
                          fill="#97CEFF"
                          filter="url(#neonGlow)"
                          animate={{
                            cx: [fromNode.x, toNode.x],
                            cy: [fromNode.y, toNode.y]
                          }}
                          transition={{
                            duration: 4 + (idx % 3) * 0.7,
                            repeat: Infinity,
                            ease: "linear",
                            delay: (idx % 5) * 0.4
                          }}
                        />
                      )}
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {nodes.map((node) => {
                  const isHighlighted = isNodeHighlighted(node.id);
                  const isSelected = selectedNode === node.id;
                  
                  return (
                    <g
                      key={node.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node.id);
                      }}
                      className="cursor-pointer group"
                      style={{ opacity: isHighlighted ? 1 : 0.2, transition: "opacity 0.3s" }}
                    >
                      {/* Outer Ring glow */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="26"
                        fill="rgba(5, 8, 22, 0.6)"
                        stroke={isSelected ? "#97CEFF" : "rgba(255, 255, 255, 0.08)"}
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:stroke-primary"
                        style={{ filter: isSelected ? "drop-shadow(0 0 8px rgba(34, 211, 238, 0.4))" : "none" }}
                      />
                      {/* Inner Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        className="fill-white/5 hover:fill-white/8 transition-colors"
                      />
                      {/* Icon */}
                      <foreignObject
                        x={node.x - 9}
                        y={node.y - 9}
                        width="18"
                        height="18"
                        className="pointer-events-none"
                      >
                        <div className="flex items-center justify-center w-full h-full text-foreground group-hover:scale-110 transition-transform">
                          {getNodeIcon(node.id, "w-4.5 h-4.5")}
                        </div>
                      </foreignObject>
                      {/* Label Text */}
                      <text
                        x={node.x}
                        y={node.y + 38}
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-[10px] font-semibold tracking-wide"
                        style={{ pointerEvents: "none" }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="lg:col-span-4 h-full overflow-y-auto">
          {selectedNode ? (
            <div className="glass-panel rounded-3xl p-5 border border-white/5 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="p-2 rounded-xl bg-white/3 border border-white/5">
                    {getNodeIcon(selectedNode, "w-6 h-6")}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      {getSelectedNodeDetails()?.label}
                    </h3>
                    <span className="text-[10px] text-accent font-semibold tracking-wider uppercase block mt-0.5">
                      {getSelectedNodeDetails()?.type} node
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Details
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {getSelectedNodeDetails()?.details}
                  </p>
                </div>

                {/* List Associated Memories */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Recent References
                  </h4>
                  
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {getAssociatedMemories().map((m, idx) => (
                      <div key={idx} className="p-3 bg-white/1 border border-white/5 rounded-xl text-left text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-foreground truncate max-w-[130px] font-mono">{m.title}</span>
                          <span className="text-[9px] text-slate-500 font-medium">{m.displayDate}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 font-medium">{m.content}</p>
                      </div>
                    ))}
                    {getAssociatedMemories().length === 0 && (
                      <span className="text-[10px] text-slate-500 italic">No references mapped.</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-full text-center text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 py-2.5 rounded-xl transition-all bg-white/2 cursor-pointer mt-4"
              >
                Clear Node Selection
              </button>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-5 border border-white/5 h-full flex flex-col items-center justify-center text-center text-slate-400 p-8">
              <Sparkles className="w-8 h-8 text-primary mb-3 animate-pulse" />
              <h3 className="font-bold text-sm text-foreground mb-1">Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs font-medium">
                Select any node on the connection map to view details, linked traces, and verified locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
