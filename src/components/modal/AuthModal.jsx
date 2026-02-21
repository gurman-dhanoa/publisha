"use client";

import React, { useState } from "react";
import {
  Modal, ModalContent, ModalBody, Button, Input, useDisclosure
} from "@heroui/react";
import { Mail, Lock, Sparkles, ArrowRight, User } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthService from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import { AuthConstants } from "@/constants/auth.constants";

export default function AuthModal({ mode = "button", buttonText = "Join", className }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [authMode, setAuthMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const toggleMode = () => setAuthMode(authMode === "login" ? "signup" : "login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (authMode === "login") {
        response = await AuthService.login({ email: formData.email, password: formData.password });
      } else {
        response = await AuthService.register(formData);
      }
      const data = response.data;
      // 1. Set Cookie (ensure your API returns the token in data.token)
      Cookies.set(AuthConstants.ACCESS_TOKEN, data.token, { expires: 7 });
      
      // 2. Update Redux
      dispatch(setCredentials(data.author));
      
      toast.success(authMode === "login" ? "Welcome back!" : "Account created!");
      onClose();
    } catch (error) {
      // Errors handled by Axios interceptor (toast.error)
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = {
    label: "text-[10px] uppercase font-bold tracking-widest text-foreground/70",
    input: "text-sm",
    inputWrapper: [
      "bg-transparent",
      "border-b-2 border-border",
      "hover:border-foreground",
      "group-data-[focus=true]:border-brand-blue",
      "transition-colors",
      "px-0",
      "shadow-none",
      "rounded-none"
    ],
  };

  return (
    <>
      {mode === "button" ? (
        <Button onPress={onOpen} radius="full" variant="bordered" className={className || "shrink-0 border-foreground text-foreground font-bold text-xs uppercase tracking-widest px-6 hover:bg-foreground hover:text-background transition-all"}>
          {buttonText}
        </Button>
      ) : (
        <button onClick={onOpen} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
          {buttonText}
        </button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" radius="none" backdrop="blur" classNames={{ base: "bg-background border-none overflow-hidden", closeButton: "hover:bg-muted transition-colors z-50" }}>
        <ModalContent>
          <ModalBody className="p-0">
            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* BRANDING SIDE */}
              <div className="hidden md:flex w-5/12 bg-black p-12 flex-col justify-between text-white relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#3b82f6_0%,_transparent_60%)] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="text-blue-400" size={24} />
                    <span className="font-sans font-bold tracking-widest uppercase">Publisha</span>
                  </div>
                  <h2 className="text-3xl font-serif font-bold leading-tight mb-4">
                    {authMode === "login" ? "Welcome back to the journal." : "Start your writing journey."}
                  </h2>
                </div>
                <div className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Premium Editorial Collective</div>
              </div>

              {/* FORM SIDE */}
              <div className="w-full md:w-7/12 p-8 md:p-12 bg-card flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold">{authMode === "login" ? "Sign In" : "Create Account"}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {authMode === "login" ? "New here?" : "Already have an account?"}{" "}
                    <button onClick={toggleMode} className="text-blue-500 font-bold hover:underline">
                      {authMode === "login" ? "Join the club" : "Sign in instead"}
                    </button>
                  </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  {authMode === "signup" && (
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      variant="underlined"
                      labelPlacement="outside"
                      startContent={<User size={16} className="text-muted-foreground" />}
                      classNames={inputStyles}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      isRequired
                    />
                  )}
                  
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="email@example.com"
                    variant="underlined"
                    labelPlacement="outside"
                    startContent={<Mail size={16} className="text-muted-foreground" />}
                    classNames={inputStyles}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    isRequired
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    variant="underlined"
                    labelPlacement="outside"
                    startContent={<Lock size={16} className="text-muted-foreground" />}
                    classNames={inputStyles}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    isRequired
                  />

                  <Button 
                    type="submit"
                    isLoading={isLoading}
                    className="w-full bg-foreground text-background font-bold tracking-widest uppercase text-xs h-12 mt-4"
                    radius="none"
                    endContent={!isLoading && <ArrowRight size={14} />}
                  >
                    {authMode === "login" ? "Enter Dashboard" : "Create Account"}
                  </Button>
                </form>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}