"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Modal, ModalContent, ModalBody, Button, Input, useDisclosure, Spinner
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import AuthService from "@/services/auth.service";
import { setCredentials } from "@/store/slices/authSlice";
import { AuthConstants } from "@/constants/auth.constants";
import Image from "next/image";

// Dummy Firebase Google Auth function (Replace with your actual implementation)
const signInWithGoogle = async () => {
  return new Promise(resolve => setTimeout(() => resolve({ token: "google-token", author: { name: "Google User" } }), 1000));
};

export default function AuthModal({ mode = "button", buttonText = "Join", className }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const dispatch = useDispatch();

  // View States: 'email' | 'otp'
  const [currentView, setCurrentView] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Data States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentView("email");
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
      }, 300); // Wait for exit animation
    }
  }, [isOpen]);

  // --- HANDLERS ---

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Please enter a valid email address.");
    }
    
    setIsLoading(true);
    try {
      const response = await AuthService.sendOTP({ email });
      if(response?.success){
        toast.success("Verification code sent to your email.");
        setCurrentView("otp");
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Please enter the 6-digit code.");

    setIsLoading(true);
    try {
      const response = await AuthService.verifyOTP({ email, otp: code });
      handleSuccessfulLogin(response?.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code.");
      // Clear OTP on failure
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await AuthService.loginWithGoogle({ 
        firebaseToken: idToken
      });
      handleSuccessfulLogin(response?.data);
    } catch (error) {
      toast.error("Google sign-in failed.");
      console.log(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    Cookies.set(AuthConstants.ACCESS_TOKEN, data.token, { expires: 7 });
    dispatch(setCredentials(data.author));
    toast.success("Welcome to Publisha!");
    onClose();
  };

  // --- OTP INPUT LOGIC ---
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Handle pasting a full code
    if (value.length > 1) {
        const pastedData = value.slice(0, 6).split("");
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        // Focus the next empty input, or the last one if full
        const nextEmptyIndex = newOtp.findIndex(val => val === "");
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        otpRefs.current[focusIndex]?.focus();
        
        // Auto-submit if full code pasted
        if (nextEmptyIndex === -1) {
            setTimeout(() => { document.getElementById("verify-btn")?.click() }, 100);
        }
        return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
    
    // Auto-submit if last digit entered
    if (value && index === 5) {
       setTimeout(() => { document.getElementById("verify-btn")?.click() }, 100);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace navigation
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // --- RENDER VIEWS ---

  const renderEmailView = () => (
    <motion.div
      key="email-view"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full justify-center space-y-8"
    >
      <div className="text-center space-y-1">
        <h3 className="text-3xl font-bold text-foreground">Join Publisha</h3>
        <p className="text-sm text-muted-foreground">Write. Improve. Publish.</p>
      </div>

      <div className="space-y-4">
        <Button 
          onPress={handleGoogleLogin}
          isLoading={isGoogleLoading}
          variant="bordered"
          className="w-full border-border text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-3"
          radius="sm"
        >
          {!isGoogleLoading && (
             <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 39.869 -11.514 38.739 -14.754 38.739 C -19.444 38.739 -23.494 41.439 -25.464 45.359 L -21.484 48.449 C -20.534 45.599 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          )}
          Continue with Google
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs font-medium uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            variant="bordered"
            radius="sm"
            // size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={{
              inputWrapper: "border-border hover:border-foreground focus-within:border-brand-blue bg-background transition-colors",
              input: "text-base font-medium"
            }}
          />
          <Button 
            type="submit"
            // size="sm"
            isLoading={isLoading}
            className="w-full bg-foreground text-background font-bold transition-transform hover:scale-[1.02] active:scale-95"
            radius="sm"
          >
            Continue with Email
          </Button>
        </form>
      </div>
    </motion.div>
  );

  const renderOtpView = () => (
    <motion.div
      key="otp-view"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col justify-center space-y-8"
    >
      <button 
        onClick={() => setCurrentView("email")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">Verify your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-bold text-foreground">{email}</span>.
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between gap-2 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6} // Allow pasting full code into any box
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-serif font-bold bg-background border border-border rounded-md outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
          ))}
        </div>

        <Button 
          id="verify-btn"
          onPress={handleVerifyOTP}
          isLoading={isLoading}
          className="w-full bg-foreground text-background font-bold transition-transform hover:scale-[1.02] active:scale-95"
          radius="sm"
        >
          Verify & Continue
        </Button>
      </div>
    </motion.div>
  );

  return (
    <>
      {mode === "button" ? (
        <Button onPress={onOpen} radius="full" variant="bordered" className={className || "shrink-0 border-border hover:border-foreground text-foreground font-bold text-xs uppercase tracking-widest px-6 transition-all"}>
          {buttonText}
        </Button>
      ) : (
        <button onClick={onOpen} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
          {buttonText}
        </button>
      )}

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="3xl" 
        radius="lg" 
        backdrop="blur" 
        classNames={{ 
          base: "bg-card border border-border overflow-hidden", 
          closeButton: "hover:bg-muted transition-colors z-50 right-4 top-4" 
        }}
      >
        <ModalContent>
          <ModalBody className="p-0">
            {/* The unified interface container */}
            <div className="flex flex-col min-h-[500px] relative p-8 sm:p-12">
              
              {/* Subtle Branding Top Right */}
              <div className="absolute top-8 left-8">
                 <Image height={200} width={200} src={"/icons/icon-512x512.png"} alt="Publisha" className="h-9 w-9 rounded-lg" />
              </div>

              {/* Main Content Area with Animation */}
              <div className="flex flex-col justify-center mx-auto max-w-md min-w-sm mt-8">
                <AnimatePresence mode="wait">
                  {currentView === "email" ? renderEmailView() : renderOtpView()}
                </AnimatePresence>
              </div>

            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}