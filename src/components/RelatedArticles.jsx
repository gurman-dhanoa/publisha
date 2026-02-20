"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import { VerticalArticleCard } from "@/components/shared/Article";

// --- DUMMY DATA ---
// Formatted to match the ArticleData interface
const relatedArticles = [
  {
    title: "Mastering React Server Components",
    excerpt: "A deep dive into how RSCs change the way we build Next.js applications, optimizing payload size and SEO.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop",
    author: "Basroop",
    tags: ["nextjs", "react", "architecture"],
    commentsCount: 24,
    likesCount: 156,
  },
  {
    title: "The Fall of Troy: Cinematic Analysis",
    excerpt: "Breaking down the visual framing of the Trojan Horse sequence and how scale dictates tension.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=800&auto=format&fit=crop",
    author: "Homer",
    tags: ["mythology", "cinema"],
    commentsCount: 89,
    likesCount: 420,
  },
  {
    title: "AWS Glacier vs S3 Standard: A Cost Breakdown",
    excerpt: "When does it make sense to transition your static assets to cold storage? A mathematical approach to your AWS bill.",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop",
    author: "Jane Hopper",
    tags: ["aws", "cloud", "devops"],
    commentsCount: 12,
    likesCount: 67,
  },
];

export default function RelatedArticles() {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    // Using bg-card (white) here gives a nice contrast against the bg-background (off-white) of the main article body!
    <section className="w-full bg-card py-24 border-t border-border mt-16">
      <Container>
        {/* Section Heading */}
        <div className="text-center mb-14">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4 block">
            Keep Reading
          </span>
          <h2 className="text-4xl font-serif font-bold text-foreground">
            Related Articles
          </h2>
        </div>

        {/* Articles Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {relatedArticles.map((article, index) => (
            <motion.div key={index} variants={cardVariants} className="w-full">
              <VerticalArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}