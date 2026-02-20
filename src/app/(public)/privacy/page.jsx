"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

export default function PrivacyPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 pt-20">
      <Container className="max-w-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-12">Last Updated: February 20, 2026</p>

          <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">1. Introduction</h2>
              <p>
                At Publisha, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">2. The Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and location data.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                <li><strong>Content Data</strong> includes articles, drafts, and data processed by our AI writing assistants.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">3. AI and Data Processing</h2>
              <p>
                Publisha utilizes advanced Artificial Intelligence to assist authors with grammar, tone, and formatting. The text you input into our editor is processed by these AI models to provide real-time suggestions. We do not use your unpublished drafts to train public AI models without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">4. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or restriction of processing of your personal data.
              </p>
            </section>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}