"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Link as HeroLink,
  useDisclosure
} from "@heroui/react";
import { Mail, Lock, Github, Chrome, Sparkles, ArrowRight } from "lucide-react";

export default function AuthModal({ 
  mode = "button", 
  buttonText = "Join", 
  className 
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [authMode, setAuthMode] = useState("login");

  const toggleMode = () => setAuthMode(authMode === "login" ? "signup" : "login");

  return (
    <>
      {/* 1. THE TRIGGER ELEMENT */}
      {mode === "button" ? (
        <Button 
          onPress={onOpen}
          radius="full" 
          variant="bordered"
          className={className || "shrink-0 border-foreground text-foreground font-bold text-xs uppercase tracking-widest px-6 hover:bg-foreground hover:text-background transition-all"}
        >
          {buttonText}
        </Button>
      ) : (
        <button 
          onClick={onOpen}
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
        >
          {buttonText}
        </button>
      )}

      {/* 2. THE MODAL */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
        radius="none"
        backdrop="blur"
        classNames={{
          base: "bg-background border-none overflow-hidden",
          closeButton: "hover:bg-muted transition-colors z-50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0">
              <div className="flex flex-col md:flex-row min-h-[500px]">
                
                {/* BRANDING SIDE */}
                <div className="hidden md:flex w-5/12 bg-surface-dark p-12 flex-col justify-between text-white relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--brand-blue)_0%,_transparent_60%)] opacity-20" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                      <Sparkles className="text-brand-mint" size={24} />
                      <span className="font-serif font-bold tracking-widest uppercase">Publisha</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold leading-tight mb-4">
                      {authMode === "login" ? "Welcome back to the journal." : "Start your writing journey."}
                    </h2>
                  </div>
                  <div className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                    Premium Editorial Collective
                  </div>
                </div>

                {/* FORM SIDE */}
                <div className="w-full md:w-7/12 p-8 md:p-12 bg-card flex flex-col justify-center">
                  <div className="mb-8">
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {authMode === "login" ? "Sign In" : "Create Account"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {authMode === "login" ? "New here?" : "Already have an account?"}{" "}
                      <button onClick={toggleMode} className="text-brand-blue font-bold hover:underline">
                        {authMode === "login" ? "Join the club" : "Sign in instead"}
                      </button>
                    </p>
                  </div>

                  <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    {authMode === "signup" && (
                      <Input
                        label="Full Name"
                        placeholder="Basroop"
                        labelPlacement="outside"
                        classNames={{ inputWrapper: "bg-background border-border", label: "text-[10px] uppercase font-bold tracking-widest" }}
                      />
                    )}
                    
                    <Input
                      type="email"
                      label="Email Address"
                      labelPlacement="outside"
                      startContent={<Mail size={16} className="text-muted-foreground" />}
                      classNames={{ inputWrapper: "bg-background border-border", label: "text-[10px] uppercase font-bold tracking-widest" }}
                    />

                    <div className="space-y-1">
                      <Input
                        type="password"
                        label="Password"
                        labelPlacement="outside"
                        startContent={<Lock size={16} className="text-muted-foreground" />}
                        classNames={{ inputWrapper: "bg-background border-border", label: "text-[10px] uppercase font-bold tracking-widest" }}
                      />
                    </div>

                    <Button 
                      className="w-full bg-foreground text-background font-bold tracking-widest uppercase text-xs h-12 mt-4"
                      radius="none"
                      endContent={<ArrowRight size={14} />}
                      onClick={() => {
                         // Add your login logic here
                         onClose();
                      }}
                    >
                      {authMode === "login" ? "Enter Dashboard" : "Create Account"}
                    </Button>
                  </form>

                  {/* SOCIAL AUTH */}
                  <div className="mt-8">
                    <div className="relative flex items-center mb-6">
                      <div className="flex-grow border-t border-border"></div>
                      <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Or continue with</span>
                      <div className="flex-grow border-t border-border"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="bordered" radius="none" className="border-border text-[10px] font-bold uppercase tracking-widest" startContent={<Chrome size={16} />}>Google</Button>
                      <Button variant="bordered" radius="none" className="border-border text-[10px] font-bold uppercase tracking-widest" startContent={<Github size={16} />}>Github</Button>
                    </div>
                  </div>
                </div>

              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}