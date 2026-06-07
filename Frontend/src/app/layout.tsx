import type { Metadata } from "next";
import "./globals.css";
import { MemoryProvider } from "@/context/MemoryContext";

const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata: Metadata = {
  title: "ShadowMe AI - Memory Reconstruction Engine",
  description: "An AI memory engine that remembers when you can't. Reconstruct memories and predict lost object locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MemoryProvider>
          {children}
        </MemoryProvider>
      </body>
    </html>
  );
}
