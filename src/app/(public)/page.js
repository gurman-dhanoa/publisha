"use client";

import React from "react";
import { Button, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { Sparkles, Feather, BookOpen, Users, FolderHeart } from "lucide-react";

// Import custom components
import Container from "@/components/shared/Container";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingArticles";
import CollectionsSection from "@/components/home/CollectionsSection";
import AuthorsSection from "@/components/home/AuthorsSection";

export default function HomePage() {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <HeroSection />

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="pb-20"
      >
        <Container className="max-w-[1000px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border/60">
            <StatBox
              icon={<BookOpen />}
              number="15k+"
              label="Published Articles"
            />
            <StatBox icon={<Users />} number="2.5M" label="Monthly Readers" />
            <StatBox
              icon={<Feather />}
              number="850+"
              label="Verified Authors"
            />
            <StatBox
              icon={<Sparkles />}
              number="100%"
              label="AI-Assisted Quality"
            />
          </div>
        </Container>
      </motion.section>

      <TrendingSection />

      <CollectionsSection />
      
      <section className="py-24 bg-surface-dark text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-surface-darker to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

        <Container className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="w-full lg:w-1/2"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-mint text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles size={14} /> For Authors
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-serif font-bold leading-[1.15] mb-6"
            >
              Write smarter, not harder. <br />
              <span className="text-gray-400 italic">Powered by AI.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg"
            >
              We believe authors are the heartbeat of our platform. That's why
              we've integrated a state-of-the-art AI editor that helps you
              overcome writer's block, perfect your tone, and format your
              thoughts instantly.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4">
              <Button
                as={Link}
                href="/publish"
                size="lg"
                radius="full"
                className="bg-brand-mint text-black font-bold px-8"
              >
                Start Writing Now
              </Button>
              <Button
                size="lg"
                radius="full"
                variant="bordered"
                className="border-gray-500 text-white hover:bg-white/5"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12"
          >
            {/* Mockup of the Editor */}
            <div className="bg-surface-darker border border-gray-700 rounded-xl p-6 shadow-2xl relative">
              <div className="flex items-center gap-2 border-b border-gray-700 pb-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs text-gray-500">
                  editor.publisha.com
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-700/50 rounded w-3/4" />
                <div className="h-4 bg-gray-700/30 rounded w-full" />
                <div className="h-4 bg-gray-700/30 rounded w-5/6" />
                <div className="h-4 bg-brand-mint/20 border border-brand-mint/30 rounded w-4/6 flex items-center px-2 text-[10px] text-brand-mint">
                  <Sparkles size={10} className="mr-2" /> AI is refining this
                  paragraph...
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
      
      <AuthorsSection />
    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatBox = ({ icon, number, label }) => (
  <div className="flex flex-col items-center justify-center text-center p-4">
    <div className="text-muted-foreground mb-3">{icon}</div>
    <h4 className="text-4xl font-serif font-bold text-foreground mb-1">
      {number}
    </h4>
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
  </div>
);
