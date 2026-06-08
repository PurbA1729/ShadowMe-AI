"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  KeyRound,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useMemory } from "@/context/MemoryContext";
import confetti from "canvas-confetti";

export const AuthView: React.FC = () => {
  const { login, register, setActiveTab } = useMemory();
  
  // UI and flow states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP array (6 digits)
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(60);
  
  // Input refs for automatic OTP focus shifting
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Count down OTP resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple front-end validations
    if (authMode === "register" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (loginMethod === "email" && !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (loginMethod === "phone" && phone.length < 8) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call for code generation
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStep("otp");
      setOtpTimer(60);
      setOtp(new Array(6).fill(""));
    } catch (err: any) {
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    
    try {
      if (authMode === "login") {
        await login({
          email: loginMethod === "email" ? email : undefined,
          phone: loginMethod === "phone" ? phone : undefined,
          password
        });
      } else {
        await register({
          name,
          email: loginMethod === "email" ? email : undefined,
          phone: loginMethod === "phone" ? phone : undefined,
          password
        });
      }
      
      // Trigger canvas-confetti burst on success!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1036D6", "#97CEFF", "#10B981", "#FFFFFF"]
      });
      
      // Navigate to Console Dashboard
      setActiveTab("dashboard");
    } catch (err: any) {
      setError("Invalid verification code. Please check and try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate Google auth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await login({
        email: "google.user@gmail.com",
        password: "google-oauth-token-dummy"
      });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1036D6", "#97CEFF", "#10B981", "#FFFFFF"]
      });
      
      setActiveTab("dashboard");
    } catch (err) {
      setError("Google sign-in was cancelled or failed.");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto submit if complete
    if (newOtp.join("").length === 6) {
      // Small timeout to allow input rendering
      setTimeout(() => {
        // Find submit button trigger
        handleVerifyOTP();
      }, 100);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        // Focus previous input if current is empty
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Neural Grid Art */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Soft Neon Blur Circles */}
      <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-accent/8 blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Back to landing */}
      <button 
        onClick={() => setActiveTab("landing")}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-primary transition-colors cursor-pointer group glass-panel px-3.5 py-2 rounded-xl"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Landing
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center border border-white/10 shadow-lg shadow-primary/25 mb-4">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-slate-400 bg-clip-text text-transparent">
            {step === "otp" ? "Secure Verification" : authMode === "login" ? "Sign In to ShadowMe" : "Create Memory Vault"}
          </h2>
          <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
            {step === "otp" 
              ? `Verification code sent to your ${loginMethod === "email" ? "email" : "mobile number"}`
              : "Reconstruct your spatial behavior history and locate lost objects."}
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden bg-background/40 backdrop-blur-xl">
          {/* Subtle line glow */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.div
                key="input-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Login/Register Sliding Tabs */}
                <div className="relative p-1 bg-white/5 border border-white/5 rounded-2xl flex mb-6">
                  <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-primary rounded-xl transition-all duration-300 shadow-md shadow-primary/20" 
                    style={{ transform: authMode === "register" ? "translateX(100%)" : "translateX(0)" }}
                  />
                  <button
                    type="button"
                    onClick={() => { setAuthMode("login"); setError(null); }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-colors z-10 cursor-pointer ${authMode === "login" ? "text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("register"); setError(null); }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-colors z-10 cursor-pointer ${authMode === "register" ? "text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Register
                  </button>
                </div>

                {/* Email / Mobile number toggle */}
                <div className="flex justify-center gap-6 mb-6 border-b border-white/5 pb-3">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("email")}
                    className={`text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${loginMethod === "email" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("phone")}
                    className={`text-xs font-semibold pb-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${loginMethod === "phone" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-200"}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile Number
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSendCode} className="space-y-4">
                  {/* Name field (Register only) */}
                  {authMode === "register" && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Input based on Email vs Mobile */}
                  {loginMethod === "email" ? (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                      {authMode === "login" && (
                        <a href="#" className="text-[10px] font-semibold text-primary hover:underline">Forgot?</a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/8 transition-all focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Error Notification */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-2xl text-xs text-danger"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {authMode === "login" ? "Sign In" : "Register Vault"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-[1px] bg-white/5" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or connect via</span>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                {/* Social Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full glass-panel hover:bg-white/5 text-foreground font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all border border-card-border hover:border-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.88 3C6.04 7.76 8.78 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.52 12.28c0-.88-.08-1.72-.24-2.52H12v4.8h6.48c-.28 1.48-1.12 2.72-2.36 3.56l3.68 2.84c2.16-2 3.4-4.96 3.4-8.68z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.12 14.72c-.28-.8-.44-1.68-.44-2.6s.16-1.8.44-2.6L1.24 6.52C.44 8.16 0 10.04 0 12s.44 3.84 1.24 5.48l3.88-3.76z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.68-2.84c-1.1.74-2.52 1.2-4.28 1.2-3.22 0-5.96-2.72-6.88-5.68l-3.88 3C3.2 20.27 7.24 23 12 23z"
                    />
                  </svg>
                  <span className="text-xs font-semibold">Continue with Google</span>
                </button>

                {/* Policy terms */}
                <p className="text-[10px] text-center text-slate-500 mt-6 leading-relaxed">
                  By clicking connect, you consent to establish a secure spatial database. All uploads undergo local OCR privacy checks.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Visual OTP Icon badge */}
                <div className="flex justify-center my-2">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                    <ShieldCheck className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent"></span>
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-bold text-sm text-foreground">Enter 6-Digit Code</h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                    We sent a verification code to <span className="font-semibold text-slate-200">{loginMethod === "email" ? email : phone}</span>.
                  </p>
                </div>

                {/* 6 Digit Grid inputs */}
                <div className="flex justify-between gap-2.5 my-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-11 h-13 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-extrabold focus:outline-none focus:border-primary focus:bg-white/10 transition-all focus:ring-4 focus:ring-primary/10"
                    />
                  ))}
                </div>

                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-2xl text-xs text-danger"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleVerifyOTP()}
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Access Console
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs px-1">
                    <button
                      type="button"
                      onClick={() => setStep("input")}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Change Details
                    </button>
                    {otpTimer > 0 ? (
                      <span className="text-slate-500 font-mono">Resend code in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendCode}
                        className="text-primary hover:underline font-bold transition-colors cursor-pointer"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
