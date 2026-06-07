"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Brain, 
  Compass, 
  Clock, 
  MapPin, 
  CornerDownLeft, 
  Search,
  MessageSquare,
  Paperclip,
  ArrowUp,
  FileText,
  Image as ImageIcon,
  StickyNote
} from "lucide-react";
import { useMemory, ChatMessage, Memory } from "@/context/MemoryContext";

export const ChatView: React.FC = () => {
  const { chatHistory, sendChatMessage, memories } = useMemory();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle typing simulation
  useEffect(() => {
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].sender === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    sendChatMessage(inputText);
    setInputText(inputText); // Save query context
    setInputText("");
  };

  const getMemoryIcon = (type: Memory["type"]) => {
    switch (type) {
      case "photo": return <ImageIcon className="w-3.5 h-3.5 text-accent" />;
      case "receipt": return <FileText className="w-3.5 h-3.5 text-success" />;
      case "note": return <StickyNote className="w-3.5 h-3.5 text-warning" />;
      default: return <FileText className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const triggerPreset = (text: string) => {
    if (isTyping) return;
    sendChatMessage(text);
  };

  const presets = [
    { label: "Where is my wallet?", query: "Where is my wallet?" },
    { label: "What did I do yesterday?", query: "What happened yesterday?" },
    { label: "Find coffee shop receipt", query: "Show receipts from last week." },
    { label: "Where is my laptop?", query: "Where is my laptop?" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6 text-foreground h-[calc(100vh-100px)] flex flex-col justify-between">
      {/* Title */}
      <div className="flex-shrink-0">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-500 bg-clip-text text-transparent">
          AI Memory Assistant
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Perplexity-style cognitive queries across your digital traces and location history.
        </p>
      </div>

      {/* Chat History Container */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
        {chatHistory.map((message) => {
          const isAI = message.sender === "assistant";
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 items-start ${isAI ? "p-5 rounded-3xl glass-panel relative" : "pl-14"}`}
            >
              {/* Message side glow for AI */}
              {isAI && (
                <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-accent/30" />
              )}

              {/* Sender Icon Badge */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isAI 
                  ? "bg-accent/10 border-accent/20 text-accent animate-pulse" 
                  : "bg-white/5 border-white/10 text-slate-300"
              }`}>
                {isAI ? <Brain className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </div>

              {/* Message Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isAI ? "ShadowMe Engine" : "You"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{message.timestamp}</span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                  {message.text}
                </p>

                {/* Sources references cited */}
                {isAI && message.sources && message.sources.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-accent" />
                      Sources Cited ({message.sources.length})
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((src, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white/3 border border-white/5 max-w-[200px]"
                        >
                          <div className="p-1 rounded bg-white/5">
                            {getMemoryIcon(src.type)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-foreground truncate block">{src.title}</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{src.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* AI Typing loading state */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-4 items-start p-5 rounded-3xl glass-panel relative"
            >
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-accent/30" />
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center">
                <Brain className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reconstructing Memory Traces...
                </span>
                <div className="flex gap-1.5 pt-1">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Triggers & Chat Input Panel */}
      <div className="flex-shrink-0 space-y-4">
        {/* Preset grid */}
        {chatHistory.length <= 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => triggerPreset(preset.query)}
                disabled={isTyping}
                className="p-3 bg-white/2 hover:bg-white/4 border border-white/5 hover:border-primary/20 rounded-2xl text-left text-xs text-slate-300 transition-all cursor-pointer disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Text Input Panel */}
        <form onSubmit={handleSubmit} className="relative glass-panel rounded-2xl border border-white/10 p-2 flex items-center">
          <button 
            type="button" 
            className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Ask anything about your logs, locations, or files..."
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-foreground px-3 placeholder-foreground/45"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-all shadow-md shadow-primary/20 disabled:opacity-30 disabled:scale-100 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
