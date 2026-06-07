"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemory } from "@/context/MemoryContext";
import { Sidebar } from "@/components/Sidebar";
import { AIOrb } from "@/components/AIOrb";

// Import view components
import { LandingView } from "@/components/views/LandingView";
import { DashboardView } from "@/components/views/DashboardView";
import { UploadView } from "@/components/views/UploadView";
import { ReplayView } from "@/components/views/ReplayView";
import { LostObjectsView } from "@/components/views/LostObjectsView";
import { GraphView } from "@/components/views/GraphView";
import { ChatView } from "@/components/views/ChatView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const { activeTab } = useMemory();

  // Route/Tab switcher mapping
  const renderActiveView = () => {
    switch (activeTab) {
      case "landing":
        return <LandingView />;
      case "dashboard":
        return <DashboardView />;
      case "upload":
        return <UploadView />;
      case "replay":
        return <ReplayView />;
      case "lost-objects":
        return <LostObjectsView />;
      case "graph":
        return <GraphView />;
      case "chat":
        return <ChatView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // If we are on landing, render full screen view without layout shell
  if (activeTab === "landing") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen"
        >
          <LandingView />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Application Layout Console Shell (Dashboard / Subpages)
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans select-none relative">
      {/* Background Neon Grid Art */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Floating radial glow backgrounds */}
      <div className="absolute top-[-25%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-accent/3 blur-[100px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Console Content Window */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
        <main className="flex-1 py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Neural AI Orb Assistant */}
      <AIOrb />
    </div>
  );
}
