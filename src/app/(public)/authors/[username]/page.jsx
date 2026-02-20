"use client";

import React from "react";
import { Avatar, Button, Tabs, Tab, Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Github, 
  BookOpen, 
  Users, 
  FolderHeart,
  Clock,
  TrendingUp
} from "lucide-react";

import Container from "@/components/shared/Container";
import { VerticalArticleCard } from "@/components/shared/Article";
import Link from "next/link";

// --- DUMMY DATA FOR CARDS ---
const sampleArticles = [
  {
    title: "Building the Kingmaker: Next.js & Complex Data Extraction",
    excerpt: "Dive deep into the architecture of modern political strategy platforms and rendering blazing-fast dashboards.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    author: "Basroop",
    tags: ["nextjs", "sql", "data"],
    commentsCount: 42,
    likesCount: 315
  },
  {
    title: "AWS Cost Optimization: S3 Archiving Strategies",
    excerpt: "Stop overpaying for static assets. A comprehensive guide to lifecycle rules and Glacier transitions.",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800",
    author: "Basroop",
    tags: ["aws", "cloud", "cost"],
    commentsCount: 12,
    likesCount: 89
  },
  {
    title: "Troubleshooting Electron.js Render Pipelines",
    excerpt: "Solving screen rendering glitches and integrating push notifications seamlessly into desktop apps.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800",
    author: "Basroop",
    tags: ["electron", "javascript"],
    commentsCount: 24,
    likesCount: 115
  }
];

export default function AuthorProfilePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint">
      
      {/* 1. COVER IMAGE & PROFILE HEADER */}
      <section className="relative">
        <div className="w-full h-[250px] md:h-[320px] bg-surface-dark overflow-hidden">
          <Image
            removeWrapper
            alt="Author Cover"
            src="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <Container className="relative">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col md:flex-row gap-6 md:gap-10 -mt-16 md:-mt-20 relative z-10 items-center md:items-start text-center md:text-left"
          >
            {/* Avatar Container */}
            <div className="rounded-full p-2 bg-background shadow-sm">
              <Avatar 
                src="https://i.pravatar.cc/150?u=basroop" 
                className="w-32 h-32 md:w-40 md:h-40 text-large ring-4 ring-background" 
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 pt-2 md:pt-24 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                  Basroop
                </h1>
                <p className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-blue" /> Punjab, India</span>
                  <span className="flex items-center gap-1"><LinkIcon size={14} className="text-brand-blue" /> basroop.dev</span>
                  <span className="flex items-center gap-3 ml-2">
                    <Twitter size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                    <Github size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                  </span>
                </p>

                {/* Categories / Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {["Next.js", "SQL Architecture", "AWS Cloud", "UI/UX"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-card border border-border text-[10px] font-bold tracking-widest text-muted-foreground rounded-full uppercase">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  Full-stack developer and technical writer specializing in modern web architecture and application state management. Creator of the <span className="text-foreground font-bold italic underline decoration-brand-mint">Kingmaker</span> political strategy platform.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-[160px]">
                <Button radius="full" className="bg-foreground text-background font-bold tracking-widest uppercase text-xs h-12">
                  Follow
                </Button>
                <Button radius="full" variant="bordered" className="border-border text-foreground font-bold tracking-widest uppercase text-xs h-12 hover:bg-card">
                  Message
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. STATS BAR */}
      <Container className="mt-12 mb-16">
        <div className="flex flex-wrap items-center justify-center md:justify-between md:max-w-3xl md:mx-auto gap-12 py-8 border-y border-border/60">
          <Stat icon={<BookOpen size={18} />} value="42" label="Articles" />
          <Stat icon={<Users size={18} />} value="12.4K" label="Followers" />
          <Stat icon={<TrendingUp size={18} />} value="850K" label="Total Views" />
        </div>
      </Container>

      {/* 3. CONTENT TABS */}
      <Container>
        <Tabs 
          aria-label="Author Content" 
          variant="underlined"
          classNames={{
            tabList: "gap-8 w-full relative rounded-none p-0 border-b border-border",
            cursor: "w-full bg-foreground",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-foreground text-muted-foreground font-serif text-lg"
          }}
        >
          <Tab 
            key="latest" 
            title={
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Latest Work</span>
              </div>
            }
          >
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
            >
              {sampleArticles.map((article, idx) => (
                <VerticalArticleCard key={idx} article={article} />
              ))}
            </motion.div>
          </Tab>

          <Tab 
            key="collections" 
            title={
              <div className="flex items-center space-x-2">
                <FolderHeart size={16} />
                <span>Collections</span>
              </div>
            }
          >
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <CollectionCard 
                title="Mastering Next.js App Router" 
                count={12} 
                image="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800" 
              />
              <CollectionCard 
                title="Political Data Strategies" 
                count={8} 
                image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" 
              />
            </motion.div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const Stat = ({ icon, value, label }) => (
  <div className="flex items-center gap-3">
    <div className="text-brand-blue">{icon}</div>
    <div>
      <p className="text-2xl font-serif font-bold text-foreground leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{label}</p>
    </div>
  </div>
);

const CollectionCard = ({ title, count, image }) => (
  <Card as={Link} href={"/collection/slug"} shadow="none" className="border border-border bg-card rounded-xl overflow-hidden group cursor-pointer hover:border-brand-blue/30 transition-all">
    <CardBody className="p-0 flex flex-row h-32">
      <div className="w-1/3 h-full overflow-hidden">
        <Image
          removeWrapper
          alt={title}
          src={image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="w-2/3 p-6 flex flex-col justify-center">
        <h3 className="font-serif font-bold text-lg text-foreground mb-2 leading-snug">{title}</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <BookOpen size={12} className="text-brand-blue" /> {count} Articles
        </p>
      </div>
    </CardBody>
  </Card>
);