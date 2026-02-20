"use client";

import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { 
  Search, 
  ArrowLeft, 
  Home, 
  BookOpen,
  Feather
} from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // Subtle floating animation for the massive background text
  const float = {
    hidden: { y: 0 },
    visible: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-background text-foreground font-sans px-6 relative overflow-hidden">
      
      {/* Background massive 404 text - Using foreground with ultra-low opacity */}
      <motion.div 
        initial="hidden" animate="visible" variants={float}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0"
      >
        <span className="text-[30vw] font-serif font-bold tracking-tighter">
          404
        </span>
      </motion.div>

      <motion.div 
        initial="hidden" animate="visible" variants={staggerContainer}
        className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center"
      >
        {/* Brand Icon */}
        <motion.div variants={fadeUp} className="mb-8 p-4 rounded-full bg-card shadow-sm border border-border inline-block">
          <Feather size={32} className="text-brand-blue" />
        </motion.div>

        {/* Heading */}
        <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
          This story seems to <br className="hidden md:block" /> have vanished.
        </motion.h1>

        {/* Description */}
        <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
          We can't find the page you're looking for. It might have been moved, renamed, or perhaps it never existed in our archives.
        </motion.p>

        {/* Actionable Search Bar */}
        <motion.div variants={fadeUp} className="w-full max-w-md relative shadow-md rounded-full bg-card group mb-12">
          <Input
            radius="full"
            size="lg"
            placeholder="Search our articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="text-muted-foreground ml-2" />}
            endContent={
              <Button radius="full" className="bg-foreground text-background px-6 font-bold text-[10px] tracking-widest uppercase h-10 min-w-unit-20">
                Find
              </Button>
            }
            classNames={{
              inputWrapper: "h-14 bg-card border-2 border-transparent focus-within:border-border group-hover:border-border transition-all px-2 shadow-none",
              input: "text-base text-foreground placeholder:text-muted-foreground ml-2",
            }}
          />
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button 
            as={Link} 
            href="/"
            radius="full" 
            size="lg"
            className="bg-foreground text-background font-bold tracking-widest uppercase text-[10px] px-8 w-full sm:w-auto h-12"
            startContent={<Home size={16} />}
          >
            Back to Home
          </Button>

          <Button 
            as={Link} 
            href="/articles"
            radius="full" 
            size="lg"
            variant="bordered"
            className="border-border text-foreground hover:bg-card transition-colors font-bold tracking-widest uppercase text-[10px] px-8 w-full sm:w-auto h-12"
            startContent={<BookOpen size={16} />}
          >
            Browse Articles
          </Button>
        </motion.div>
        
        {/* Go back plain text link */}
        <motion.button 
          variants={fadeUp}
          onClick={() => window.history.back()}
          className="mt-12 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Go Back to Previous Page
        </motion.button>

      </motion.div>
    </div>
  );
}