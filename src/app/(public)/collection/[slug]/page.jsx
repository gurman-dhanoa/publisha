"use client";

import React from "react";
import { Avatar, Button, Image, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FolderOpen, 
  Clock, 
  Share2, 
  BookmarkPlus,
  BookOpen
} from "lucide-react";
import Link from "next/link";

import Container from "@/components/shared/Container";
import { VerticalArticleCard, HorizontalArticleCard } from "@/components/shared/Article";

// --- DUMMY DATA FOR THIS SPECIFIC COLLECTION ---
const collectionMeta = {
  title: "Building the Kingmaker: Next.js & Political Data Architecture",
  description: "A comprehensive series diving into the architecture behind modern data-heavy applications. Learn how to extract complex election data, optimize SQL database queries, and render blazing-fast dashboards using Next.js App Router and React Server Components.",
  author: "Basroop",
  authorRole: "Full-Stack Developer",
  authorAvatar: "https://i.pravatar.cc/150?u=basroop",
  articleCount: 8,
  updatedAt: "Feb 2026",
  coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
};

const collectionArticles = [
  {
    title: "Part 1: The Core Architecture of Political Dashboards",
    excerpt: "Setting up the foundation with Next.js 15, handling server-side state, and defining the data layer for high-concurrency election night traffic.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    author: "Basroop",
    tags: ["architecture", "nextjs"],
    commentsCount: 24,
    likesCount: 156
  },
  {
    title: "Part 2: Complex SQL JOINs for Voter Sentiment",
    excerpt: "How to structure your relational database to handle millions of data points while maintaining sub-second query performance during live swings.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800",
    author: "Basroop",
    tags: ["sql", "database"],
    commentsCount: 12,
    likesCount: 89
  },
  {
    title: "Part 3: Real-time Data Extraction with AWS Lambda",
    excerpt: "Automating the pipeline to scrape and process election results from official commission sources directly into your Kingmaker engine.",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800",
    author: "Basroop",
    tags: ["aws", "cloud"],
    commentsCount: 8,
    likesCount: 67
  }
];

export default function CollectionDetailPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint selection:text-black">
      
      {/* ================================================================= */}
      {/* 1. COLLECTION HEADER SECTION                                      */}
      {/* ================================================================= */}
      <section className="pt-10 pb-16 bg-card border-b border-border">
        <Container>
          {/* Back Navigation */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
            <Link href="/authors/slug" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} />
              Back to Profile
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
            
            {/* Left: Collection Details */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="w-full lg:w-1/2 flex flex-col justify-center"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest mb-4">
                <FolderOpen size={16} />
                <span>Article Collection</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold leading-[1.15] mb-6 text-foreground">
                {collectionMeta.title}
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
                {collectionMeta.description}
              </motion.p>

              {/* Author & Meta */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-3">
                  <Avatar src={collectionMeta.authorAvatar} className="w-10 h-10 border border-border" />
                  <div>
                    <p className="text-foreground font-medium">Curated by {collectionMeta.author}</p>
                    <p className="text-xs uppercase tracking-tighter">{collectionMeta.authorRole}</p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-border" />
                <div className="flex items-center gap-4 font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-brand-blue" /> {collectionMeta.articleCount} Articles</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-brand-blue" /> Updated {collectionMeta.updatedAt}</span>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={fadeUp} className="flex gap-4">
                <Button size="lg" radius="full" className="bg-foreground text-background font-bold tracking-widest uppercase text-xs px-8 h-14 shadow-md">
                  Start Reading
                </Button>
                <Button size="lg" isIconOnly radius="full" variant="bordered" className="border-border text-foreground hover:bg-card h-14 w-14">
                  <BookmarkPlus size={20} />
                </Button>
                <Button size="lg" isIconOnly radius="full" variant="bordered" className="border-border text-foreground hover:bg-card h-14 w-14">
                  <Share2 size={20} />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Featured Cover Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border border-border aspect-[4/3] group">
                <Image
                  removeWrapper
                  alt="Abstract Data Architecture"
                  src={collectionMeta.coverImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 2. COLLECTION ARTICLES LIST                                       */}
      {/* ================================================================= */}
      <section className="py-20">
        <Container>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground">Series Roadmap</h2>
            <Divider className="flex-1 bg-border/60" />
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="flex flex-col gap-16"
          >
            {/* Part 1 (Horizontal Highlight) */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -left-4 md:-left-8 top-8 w-1 h-24 bg-brand-blue rounded-r-full hidden md:block" />
              <div className="mb-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2 py-1 bg-brand-mint/20 rounded-md">Sequence 01 / Introduction</span>
              </div>
              <HorizontalArticleCard article={collectionArticles[0]} />
            </motion.div>

            {/* Subsequent Parts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-border/60">
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l-2 border-brand-mint">Sequence 02</span>
                <VerticalArticleCard article={collectionArticles[1]} />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l-2 border-brand-mint">Sequence 03</span>
                <VerticalArticleCard article={collectionArticles[2]} />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l-2 border-brand-mint">Sequence 04</span>
                {/* Reusing Part 1 dummy for visual placeholder */}
                <VerticalArticleCard article={collectionArticles[0]} />
              </motion.div>
            </div>
            
            {/* Completion / Load More */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-6 mt-10">
               <Divider className="max-w-xs bg-border/60" />
               <Button 
                radius="full" 
                variant="bordered" 
                className="border-border text-foreground hover:bg-foreground hover:text-background transition-all font-bold tracking-widest uppercase text-[10px] px-10 h-14"
              >
                Explore Remaining Chapters
              </Button>
            </motion.div>

          </motion.div>
        </Container>
      </section>

    </div>
  );
}