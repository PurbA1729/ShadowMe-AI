"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare, ArrowRight, BrainCircuit } from "lucide-react";
import { useMemory } from "@/context/MemoryContext";

export const AIOrb: React.FC = () => {
  const { activeTab, setActiveTab, sendChatMessage } = useMemory();
  const [isOpen, setIsOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");

  if (activeTab === "landing") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    sendChatMessage(quickQuery);
    setQuickQuery("");
    setIsOpen(false);
    setActiveTab("chat");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-80 glass-panel-glow rounded-2xl overflow-hidden p-4 text-foreground z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-accent animate-pulse" />
                <span className="font-semibold text-sm tracking-wide">Memory Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              I am monitoring your 5 active memories. Ask me where something is or what you did.
            </p>

            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Where is my wallet?..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-foreground placeholder-foreground/45"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bg-primary hover:bg-primary-hover w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <button 
                onClick={() => { setQuickQuery("Where is my wallet?"); }}
                className="text-[10px] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-accent border border-white/5 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
              >
                "Where is my wallet?"
              </button>
              <button 
                onClick={() => { setQuickQuery("Where are my keys?"); }}
                className="text-[10px] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-accent border border-white/5 rounded-full px-2.5 py-1 transition-colors cursor-pointer"
              >
                "Where are my keys?"
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer overflow-hidden border border-white/20"
      >
        {/* Glow Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
        
        {/* Animated Particles inside */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_60%)] animate-pulse" />

        <div className="relative z-10 flex items-center justify-center text-white">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </motion.button>
    </div>
  );
};
