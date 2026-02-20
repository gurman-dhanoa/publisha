"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

export default function TermsOfServicePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 pt-20">
      <Container className="max-w-3xl">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-12">Effective Date: February 20, 2026</p>

          <div className="prose prose-stone max-w-none text-gray-600 leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Publisha, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">2. Intellectual Property & Author Rights</h2>
              <p>
                <strong>You own your content.</strong> Publisha claims no ownership rights over the articles, texts, or images you create and publish on our platform. By publishing on Publisha, you grant us a worldwide, non-exclusive, royalty-free license to distribute, display, and promote your content across our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">3. Acceptable Use</h2>
              <p>You agree not to use the platform to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Publish content that is unlawful, harmful, threatening, or abusive.</li>
                <li>Impersonate any person or entity, or falsely state your affiliation with a person or entity.</li>
                <li>Utilize our AI tools to generate mass spam or purposefully deceptive information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-4">4. Termination</h2>
              <p>
                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}