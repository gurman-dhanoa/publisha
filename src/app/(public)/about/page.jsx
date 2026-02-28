"use client";

import React from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Sparkles, PenTool, Globe } from "lucide-react";
import Image from "next/image";

import Container from "@/components/shared/Container";

export default function AboutPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 selection:bg-[#c2e2e3] selection:text-black">
      
      <section className="pt-24 pb-16 text-center">
        <Container className="max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] mb-6">
              Empowering the voices <br className="hidden md:block" />
              that shape our world.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Phinity is more than a publishing platform. It's an ecosystem designed to remove the friction between a brilliant idea and the readers who need to hear it.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-16 items-center"
          >
            {/* Left: Image Grid */}
            <motion.div variants={fadeUp} className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 mt-12">
                <Image removeWrapper src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop" className="w-full h-[250px] object-cover rounded-xl" alt="Writing" />
                <Image removeWrapper src="https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=600&auto=format&fit=crop" className="w-full h-[200px] object-cover rounded-xl" alt="Coffee and notes" />
              </div>
              <div className="flex flex-col gap-4">
                <Image removeWrapper src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop" className="w-full h-[300px] object-cover rounded-xl" alt="Team collaborating" />
                <Image removeWrapper src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop" className="w-full h-[250px] object-cover rounded-xl" alt="Typing" />
              </div>
            </motion.div>

            {/* Right: Text Content */}
            <motion.div variants={fadeUp} className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1e44d6] mb-4">Our Story</span>
              <h2 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-6 leading-snug">
                Where technology meets human creativity.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We realized that the best writers were often bogged down by formatting, distribution, and battling complex CMS platforms. We wanted to change that. 
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                By integrating state-of-the-art AI tooling directly into our editor, we allow authors to focus purely on their narrative and ideas. Our platform handles the grammar, structure suggestions, and global distribution, ensuring that every story reaches its maximum potential audience.
              </p>
              
              <div className="flex gap-4">
                <Button radius="full" className="bg-[#1a1a1a] text-white px-8 font-bold text-xs uppercase tracking-widest h-12">
                  Read the Journal
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="py-24 bg-white border-y border-gray-200 mt-12">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#1a1a1a]">Our Core Pillars</h2>
          </div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <ValueCard 
              icon={<PenTool size={24} className="text-[#1e44d6]" />}
              title="Author First"
              desc="We believe the creator is the most important part of the equation. Our tools are built to serve writers, not hinder them."
            />
            <ValueCard 
              icon={<Sparkles size={24} className="text-[#1e44d6]" />}
              title="AI-Assisted Quality"
              desc="Our integrated AI doesn't write the story for you; it elevates your voice, catching errors and suggesting structural improvements."
            />
            <ValueCard 
              icon={<Globe size={24} className="text-[#1e44d6]" />}
              title="Global Reach"
              desc="Stories are meant to be shared. Our platform ensures rapid delivery, pristine SEO, and global accessibility."
            />
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

// Helper Component
const ValueCard = ({ icon, title, desc }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center text-center p-6">
    <div className="w-14 h-14 rounded-full bg-[#f7f5f0] flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
  </motion.div>
);