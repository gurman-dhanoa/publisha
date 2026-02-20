"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Mail } from "lucide-react";
import Container from "@/components/shared/Container";

export default function AccessibilityPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 pt-20">
      <Container className="max-w-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Accessibility Statement</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-12">Committed to an inclusive web.</p>

          <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">Our Commitment</h2>
              <p>
                Publisha is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards to ensure our platform is readable, navigable, and usable by all.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">Conformance Status</h2>
              <p>
                The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Publisha is partially conformant with WCAG 2.1 level AA.
              </p>
              <p className="mt-4">Our ongoing efforts include:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Ensuring sufficient color contrast across all reading modes.</li>
                <li>Providing structural markup for screen readers (ARIA labels on inputs, navs, and icons).</li>
                <li>Ensuring full keyboard navigability through the article feed and editor.</li>
              </ul>
            </section>

            <section className="bg-white p-8 rounded-2xl border border-gray-200 mt-12">
              <h2 className="text-xl font-serif font-bold text-[#1a1a1a] mb-2">Feedback & Support</h2>
              <p className="mb-6">
                We welcome your feedback on the accessibility of Publisha. Please let us know if you encounter accessibility barriers on our platform so we can address them immediately.
              </p>
              <Button 
                radius="full" 
                className="bg-[#1a1a1a] text-white font-bold tracking-widest uppercase text-xs px-6"
                startContent={<Mail size={16} />}
              >
                accessibility@publisha.com
              </Button>
            </section>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}