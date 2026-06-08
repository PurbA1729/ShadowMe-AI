"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Memory {
  id: string;
  type: "photo" | "receipt" | "note" | "document";
  title: string;
  content: string;
  timestamp: string; // ISO String or display time
  displayDate: string; // e.g. "June 7, 2026"
  displayTime: string; // e.g. "02:30 PM"
  location: string;
  tags: string[];
  confidence: number;
  imageUrl?: string;
}

export interface PredictedLocation {
  name: string;
  probability: number;
  reasoning: string[];
}

export interface LostObject {
  id: string;
  name: string;
  status: "lost" | "recovered";
  lastSeen: string;
  predictedLocations: PredictedLocation[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  sources?: Memory[];
}

export interface User {
  name: string;
  email?: string;
  phone?: string;
}

export type TabType = 
  | "landing"
  | "auth"
  | "dashboard" 
  | "upload" 
  | "replay" 
  | "lost-objects" 
  | "graph" 
  | "chat" 
  | "settings";

interface MemoryContextProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  memories: Memory[];
  lostObjects: LostObject[];
  chatHistory: ChatMessage[];
  addMemory: (memory: Omit<Memory, "id" | "timestamp" | "displayDate" | "displayTime">) => void;
  markAsRecovered: (id: string) => void;
  sendChatMessage: (text: string) => void;
  isProcessingUpload: boolean;
  processingStep: number; // 0: Idle, 1: Uploading, 2: OCR, 3: Object Detection, 4: Memory Created
  simulateUpload: (fileName: string, fileType: "photo" | "receipt" | "note" | "document") => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: "dark" | "cyberpunk" | "minimal";
  setTheme: (theme: "dark" | "cyberpunk" | "minimal") => void;
  retentionDays: number;
  setRetentionDays: (days: number) => void;
  isLoggedIn: boolean;
  user: User | null;
  login: (credentials: { email?: string; phone?: string; password?: string }) => Promise<void>;
  register: (profile: { name: string; email?: string; phone?: string; password?: string }) => Promise<void>;
  logout: () => void;
}

const MemoryContext = createContext<MemoryContextProps | undefined>(undefined);

const INITIAL_MEMORIES: Memory[] = [
  {
    id: "mem-1",
    type: "photo",
    title: "Office Meeting Whiteboard",
    content: "Whiteboard notes showing Q3 roadmap targets, API schema diagrams, and project distribution plan. Main timeline items include 'Launch v2.0 in July' and 'Beta release mid-June'. Left laptop on the desk nearby.",
    timestamp: "2026-06-07T14:30:00Z",
    displayDate: "June 7, 2026",
    displayTime: "02:30 PM",
    location: "Office - Meeting Room B",
    tags: ["Work", "Roadmap", "Laptop", "Whiteboard"],
    confidence: 96,
    imageUrl: "/mock-whiteboard.jpg",
  },
  {
    id: "mem-2",
    type: "receipt",
    title: "Blue Bottle Coffee Receipt",
    content: "1x Double Espresso, 1x Avocado Toast. Paid $14.50 with Visa ending in 4242. Keys placed on the counter near the espresso machine while waiting.",
    timestamp: "2026-06-07T10:15:00Z",
    displayDate: "June 7, 2026",
    displayTime: "10:15 AM",
    location: "Coffee Shop - Blue Bottle",
    tags: ["Personal", "Finance", "Keys", "Coffee"],
    confidence: 89,
    imageUrl: "/mock-coffee.jpg",
  },
  {
    id: "mem-3",
    type: "note",
    title: "Weekly Planning Draft",
    content: "Self-reminder notes: Clean study table tonight. Put wallet in the black backpack front pocket before heading out tomorrow. Pick up keys from the entryway console.",
    timestamp: "2026-06-07T09:00:00Z",
    displayDate: "June 7, 2026",
    displayTime: "09:00 AM",
    location: "Home - Study Room",
    tags: ["Personal", "Todo", "Wallet", "Keys"],
    confidence: 92,
  },
  {
    id: "mem-4",
    type: "photo",
    title: "Living Room Sofa Table Setup",
    content: "Visual snapshot of the coffee table. Mug of tea, current book, and TV remote present. Wallet is resting on the side shelf of the console table in the entryway background.",
    timestamp: "2026-06-06T18:15:00Z",
    displayDate: "June 6, 2026",
    displayTime: "06:15 PM",
    location: "Home - Living Room",
    tags: ["Home", "Wallet", "Tea"],
    confidence: 94,
    imageUrl: "/mock-living-room.jpg",
  },
  {
    id: "mem-5",
    type: "document",
    title: "Grocery Shopping List & Receipt",
    content: "Grocery shopping completed. Bought apples, milk, cereal, detergent, organic honey. Total paid: $48.20. Backpack was left on the kitchen island bench.",
    timestamp: "2026-06-06T12:00:00Z",
    displayDate: "June 6, 2026",
    displayTime: "12:00 PM",
    location: "Home - Kitchen",
    tags: ["Shopping", "Food", "Backpack"],
    confidence: 98,
    imageUrl: "/mock-kitchen.jpg",
  }
];

const INITIAL_LOST_OBJECTS: LostObject[] = [
  {
    id: "obj-1",
    name: "Wallet",
    status: "lost",
    lastSeen: "June 6, 2026 (Living Room Sofa Table Photo)",
    predictedLocations: [
      {
        name: "Study Table",
        probability: 74,
        reasoning: [
          "Wallet was detected on the living room shelf yesterday, but notes at 09:00 AM state you planned to put it in the black backpack.",
          "High behavioral correlation: Wallet is usually moved to the Study Table when charging the phone next to the computer.",
          "Text logs indicate you cleaned your study table later in the evening."
        ]
      },
      {
        name: "Backpack",
        probability: 18,
        reasoning: [
          "Your planning notes mentioned moving the wallet to the black backpack front pocket.",
          "No photos confirm if it was successfully transferred."
        ]
      },
      {
        name: "Kitchen",
        probability: 8,
        reasoning: [
          "You unpacked groceries on the kitchen island at 12:00 PM, which is a secondary drop point for daily carry items."
        ]
      }
    ]
  },
  {
    id: "obj-2",
    name: "Keys",
    status: "lost",
    lastSeen: "June 7, 2026 (Coffee Shop Receipt)",
    predictedLocations: [
      {
        name: "Kitchen",
        probability: 68,
        reasoning: [
          "Receipt from Blue Bottle Coffee shows keys were on the counter, but you returned home afterwards.",
          "Kitchen island is the nearest counter when entering from the garage with groceries."
        ]
      },
      {
        name: "Bedroom",
        probability: 22,
        reasoning: [
          "Keys are often kept in your jeans pocket, which were placed in the laundry basket in the bedroom."
        ]
      },
      {
        name: "Living Room",
        probability: 10,
        reasoning: [
          "Resting near the TV console where you sat after coffee."
        ]
      }
    ]
  },
  {
    id: "obj-3",
    name: "Laptop",
    status: "recovered",
    lastSeen: "June 7, 2026 (Office Whiteboard Photo)",
    predictedLocations: [
      {
        name: "Office - Meeting Room B",
        probability: 95,
        reasoning: [
          "Clearly visible in the background of the whiteboard photo uploaded at 02:30 PM today."
        ]
      }
    ]
  }
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "chat-1",
    sender: "assistant",
    text: "Hello, I am **ShadowMe**. I've reconstructed your memory graph from 5 uploaded traces. Ask me anything about where things are, what you did, or receipts you've scanned.",
    timestamp: "19:45 PM"
  }
];

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>("landing");
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [lostObjects, setLostObjects] = useState<LostObject[]>(INITIAL_LOST_OBJECTS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [theme, setTheme] = useState<"dark" | "cyberpunk" | "minimal">("minimal");
  const [retentionDays, setRetentionDays] = useState(30);
  
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("shadowme_user");
      const storedLoggedIn = localStorage.getItem("shadowme_is_logged_in");
      if (storedLoggedIn === "true" && storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = async (credentials: { email?: string; phone?: string; password?: string }) => {
    // Simulate network latency for a high-end feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockUser: User = {
      name: credentials.email 
        ? credentials.email.split("@")[0].charAt(0).toUpperCase() + credentials.email.split("@")[0].slice(1)
        : "User " + (credentials.phone || "").slice(-4),
      email: credentials.email,
      phone: credentials.phone
    };
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem("shadowme_user", JSON.stringify(mockUser));
    localStorage.setItem("shadowme_is_logged_in", "true");
  };

  const register = async (profile: { name: string; email?: string; phone?: string; password?: string }) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockUser: User = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone
    };
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem("shadowme_user", JSON.stringify(mockUser));
    localStorage.setItem("shadowme_is_logged_in", "true");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("shadowme_user");
    localStorage.removeItem("shadowme_is_logged_in");
    setActiveTab("landing");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("dark", "cyberpunk", "minimal");
      root.classList.add(theme);
    }
  }, [theme]);

  const addMemory = (newMem: Omit<Memory, "id" | "timestamp" | "displayDate" | "displayTime">) => {
    const now = new Date();
    const createdMem: Memory = {
      ...newMem,
      id: `mem-${Date.now()}`,
      timestamp: now.toISOString(),
      displayDate: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      displayTime: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMemories(prev => [createdMem, ...prev]);

    // If memory content mentions certain objects, update or add to lost objects
    const contentLower = newMem.content.toLowerCase();
    const titleLower = newMem.title.toLowerCase();
    
    // Check if new object is lost/mentioned
    if (contentLower.includes("lost") || contentLower.includes("where is") || contentLower.includes("misplaced")) {
      const match = contentLower.match(/(?:lost|misplaced|find my)\s+([a-z0-9\s]{3,15})(?:\s+|$)/i);
      if (match && match[1]) {
        const objectName = match[1].trim();
        // Capitalize first letter
        const capitalizedName = objectName.charAt(0).toUpperCase() + objectName.slice(1);
        
        // Add as a new lost object if it doesn't exist
        if (!lostObjects.some(o => o.name.toLowerCase() === objectName.toLowerCase())) {
          const newLostObj: LostObject = {
            id: `obj-${Date.now()}`,
            name: capitalizedName,
            status: "lost",
            lastSeen: `${createdMem.displayDate} (${createdMem.title})`,
            predictedLocations: [
              {
                name: createdMem.location || "Study Room",
                probability: 80,
                reasoning: [`Detected near ${createdMem.title} uploaded today.`, `Last seen location reported as ${createdMem.location}`]
              },
              {
                name: "Living Room",
                probability: 15,
                reasoning: ["Common alternate location based on daily movement patterns."]
              },
              {
                name: "Bedroom",
                probability: 5,
                reasoning: ["Default night-time drop off zone."]
              }
            ]
          };
          setLostObjects(prev => [newLostObj, ...prev]);
        }
      }
    }
  };

  const markAsRecovered = (id: string) => {
    setLostObjects(prev => prev.map(obj => {
      if (obj.id === id) {
        return { ...obj, status: "recovered" };
      }
      return obj;
    }));
  };

  const simulateUpload = async (fileName: string, fileType: "photo" | "receipt" | "note" | "document") => {
    setIsProcessingUpload(true);
    setProcessingStep(1); // Uploading
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep(2); // OCR Complete
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep(3); // Object Detection Complete
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep(4); // Memory Created
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine values based on upload
    let title = "Uploaded File Memory";
    let content = "Automatically processed memory trace from uploaded document.";
    let tags = ["Uploaded"];
    let location = "Home";
    
    if (fileType === "photo") {
      title = `Snapshot: ${fileName.replace(/\.[^/.]+$/, "")}`;
      content = "Visual analysis of the image reveals a black leather wallet sitting on the entryway table next to a stack of letters. A coffee mug is visible on the right.";
      tags = ["Photo", "Wallet", "Entryway"];
      location = "Home - Entryway";
    } else if (fileType === "receipt") {
      title = `Receipt: ${fileName.replace(/\.[^/.]+$/, "")}`;
      content = "Transaction record. Starbucks Coffee. 1x Cafe Latte, 1x Blueberry Scone. Total: $9.85. Payment: Mastercard. Backpack was seen resting on the chair next to the window.";
      tags = ["Receipt", "Finance", "Backpack", "Coffee"];
      location = "Coffee Shop - Starbucks";
    } else if (fileType === "note") {
      title = `Note: ${fileName.replace(/\.[^/.]+$/, "")}`;
      content = "Text memo: 'Remember to leave the charger on the study table. Keys are in the jacket hanging in the hallway wardrobe.'";
      tags = ["Note", "Keys", "Jacket"];
      location = "Home - Hallway";
    } else {
      title = `Document: ${fileName.replace(/\.[^/.]+$/, "")}`;
      content = "Scanned lease document summary. Details address 742 Evergreen Terrace. Signed yesterday. Left document folder in the office cabinet drawer.";
      tags = ["Document", "Office", "Paperwork"];
      location = "Office - Study Room";
    }

    addMemory({
      type: fileType,
      title,
      content,
      location,
      tags,
      confidence: Math.floor(Math.random() * 15) + 85, // 85-99%
    });

    setIsProcessingUpload(false);
    setProcessingStep(0);
  };

  const sendChatMessage = (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-u`,
      sender: "user",
      text,
      timestamp: timeStr
    };
    
    setChatHistory(prev => [...prev, userMsg]);

    // Simulate smart AI response based on query
    setTimeout(() => {
      let responseText = "I checked all your uploaded memory traces. I couldn't find a direct match. Could you upload a receipt or photo related to this?";
      let matchedSources: Memory[] = [];

      const query = text.toLowerCase();
      if (query.includes("wallet")) {
        responseText = "According to your memory graph, your **Wallet** was last detected on the **Study Table** with **74% confidence**.\n\nHere is what I found:\n- Yesterday evening, you uploaded a living room photo where the wallet was visible in the entryway background.\n- However, your notes from 09:00 AM today say you clean the study table and planned to pack it. Our predictive engine puts it on your **Study Table** near your charging station.";
        matchedSources = memories.filter(m => m.tags.includes("Wallet") || m.content.toLowerCase().includes("wallet"));
      } else if (query.includes("key") || query.includes("keys")) {
        responseText = "Your **Keys** are likely in the **Kitchen** (**68% confidence**).\n\nDetails:\n- Today at 10:15 AM, your coffee receipt shows you had them at Blue Bottle Coffee.\n- Your behavioral patterns show you return home from coffee and drop items on the **kitchen island** bench while unpacking groceries, which matches your kitchen receipt at 12:00 PM.";
        matchedSources = memories.filter(m => m.tags.includes("Keys") || m.content.toLowerCase().includes("keys"));
      } else if (query.includes("receipt") || query.includes("spend") || query.includes("buy")) {
        responseText = "I found 2 transactions in your memory graph:\n1. **Blue Bottle Coffee** on June 7 ($14.50 for Espresso and Toast)\n2. **Grocery Shopping** on June 6 ($48.20 at Kitchen)\n\nTotal tracked spending is **$62.70**.";
        matchedSources = memories.filter(m => m.type === "receipt" || m.tags.includes("Finance") || m.tags.includes("Shopping"));
      } else if (query.includes("yesterday") || query.includes("happen")) {
        responseText = "Yesterday (June 6), you spent the afternoon at home:\n- At **12:00 PM**, you did grocery shopping and left your backpack in the kitchen.\n- At **06:15 PM**, you relaxed in the living room and placed your wallet on the entryway table.";
        matchedSources = memories.filter(m => m.displayDate.includes("June 6"));
      } else if (query.includes("laptop")) {
        responseText = "Your **Work Laptop** was last seen at the **Office - Meeting Room B** (**95% confidence**).\n\nIt is clearly visible in the background of your Meeting Whiteboard photo uploaded at 02:30 PM today.";
        matchedSources = memories.filter(m => m.tags.includes("Laptop") || m.content.toLowerCase().includes("laptop"));
      }

      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now()}-a`,
        sender: "assistant",
        text: responseText,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        sources: matchedSources.length > 0 ? matchedSources : undefined
      };
      
      setChatHistory(prev => [...prev, assistantMsg]);
    }, 1200);
  };

  return (
    <MemoryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        memories,
        lostObjects,
        chatHistory,
        addMemory,
        markAsRecovered,
        sendChatMessage,
        isProcessingUpload,
        processingStep,
        simulateUpload,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        retentionDays,
        setRetentionDays,
        isLoggedIn,
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};
