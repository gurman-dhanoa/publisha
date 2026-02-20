"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

export default function CookiePolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 pt-20">
      <Container className="max-w-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Cookie Policy</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-12">Effective Date: February 20, 2026</p>

          <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Essential Cookies:</strong> These are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website.</li>
                <li><strong>Analytical/Performance Cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.</li>
                <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website, such as remembering your category preferences or light/dark mode settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">Managing Cookies</h2>
              <p>
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of the Publisha platform may become inaccessible or not function properly.
              </p>
            </section>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}