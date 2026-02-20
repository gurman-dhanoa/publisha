"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HeartHandshake, X } from "lucide-react";
import Link from "next/link";
import AuthModal from "../modal/AuthModal";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="p-2 w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-card border border-transparent hover:border-border transition-all text-foreground"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
    </button>
  );
};

const Navbar = () => {

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        if (window.innerWidth >= 768 && desktopInputRef.current) {
          desktopInputRef.current.focus();
        } else if (mobileInputRef.current) {
          mobileInputRef.current.focus();
        }
      }, 100);
    }
  }, [isSearchOpen]);

  return (
    <nav className="w-full bg-background border-b border-gray-200/50 sticky top-0 z-50 flex flex-col">
      
      {/* ========================================================== */}
      {/* TOP MAIN ROW (Always visible)                              */}
      {/* ========================================================== */}
      <div className="h-20 px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer shrink-0">
          <HeartHandshake size={28} className="text-brand-blue" strokeWidth={1.5} />
          <span className="text-xl sm:text-2xl font-sans font-black tracking-wide text-foreground uppercase mt-1">
            Publisha
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 ml-4">
          {/* Search Toggle Icon */}
          <AnimatePresence mode="wait">
            {!isSearchOpen && (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground hover:text-gray-600 transition-colors p-2 shrink-0"
                aria-label="Open search"
              >
                <Search size={20} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* DESKTOP Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                key="desktop-search"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "240px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:flex overflow-hidden items-center justify-end"
              >
                <Input
                  ref={desktopInputRef}
                  radius="full"
                  placeholder="Search articles..."
                  size="sm"
                  startContent={<Search size={14} className="text-gray-400" />}
                  endContent={
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-400 hover:text-gray-800 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  }
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 shadow-sm h-10 w-full",
                    input: "text-sm",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ThemeToggle />
          
          {/* Join Button */}
          <AuthModal buttonText="Join" />
        </div>
      </div>

      {/* ========================================================== */}
      {/* MOBILE SEARCH ROW                                          */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background"
          >
            <div className="px-4 pb-4">
              <Input
                ref={mobileInputRef}
                radius="full"
                placeholder="Search articles..."
                size="md"
                startContent={<Search size={16} className="text-gray-400" />}
                endContent={
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-gray-400 hover:text-gray-800 transition-colors shrink-0 p-1"
                  >
                    <X size={18} />
                  </button>
                }
                classNames={{
                  inputWrapper: "bg-white border border-gray-200 shadow-sm h-12 w-full",
                  input: "text-base", 
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </nav>
  );
};

export default Navbar;