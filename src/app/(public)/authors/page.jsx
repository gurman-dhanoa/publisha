"use client";

import React, { useState } from "react";
import { Input, Button, Avatar, Card, CardBody, Chip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Users,
  Filter,
  ArrowRight,
  MapPin
} from "lucide-react";

import Container from "@/components/shared/Container";
import Link from "next/link";

// --- DUMMY DATA ---
const categories = ["All", "Technology", "Mythology", "Culture", "Health", "Fiction", "Arts"];

const authors = [
  {
    id: 1,
    name: "Basroop",
    role: "Full-Stack Developer",
    category: "Technology",
    bio: "Specializing in Next.js, complex data extraction, and building robust political strategy platforms like Kingmaker.",
    image: "https://i.pravatar.cc/150?u=basroop",
    location: "Punjab, India",
    stats: { articles: 42, followers: "12.4K", views: "850K" }
  },
  {
    id: 2,
    name: "Helen Kotovski",
    role: "Music Historian",
    category: "Arts",
    bio: "Exploring the intricacies of classical instruments and the rich history of orchestral music and pianoforte evolution.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    location: "London, UK",
    stats: { articles: 128, followers: "45K", views: "1.2M" }
  },
  {
    id: 3,
    name: "Homer",
    role: "Epic Poet & Analyst",
    category: "Mythology",
    bio: "Breaking down the cinematic framing and storytelling of ancient Greek epics and the visual scale of the Trojan War.",
    image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=150&auto=format&fit=crop",
    location: "Ionia",
    stats: { articles: 14, followers: "8.2K", views: "300K" }
  },
  {
    id: 4,
    name: "Jane Hopper",
    role: "Fiction Writer",
    category: "Fiction",
    bio: "Weaving narratives that blend supernatural elements with 1980s nostalgia and deep character psychological studies.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    location: "Hawkins, IN",
    stats: { articles: 31, followers: "102K", views: "2.5M" }
  }
];

export default function AuthorsListingPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAuthors = authors.filter(author => {
    const matchesCategory = activeCategory === "All" || author.category === activeCategory;
    const matchesSearch = author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint selection:text-black">

      {/* 1. HEADER & SEARCH SECTION */}
      <section className="pt-20 pb-12 bg-card border-b border-border shadow-sm sticky top-20 z-30">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                Our Brilliant Minds
              </h1>
              <p className="text-muted-foreground">Discover experts shaping the conversation.</p>
            </div>

            <div className="w-full md:w-96 shrink-0">
              <Input
                radius="full"
                placeholder="Search authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="text-muted-foreground ml-1" size={18} />}
                classNames={{
                  inputWrapper: "bg-background border border-border h-14 focus-within:ring-2 ring-brand-mint transition-all",
                  input: "text-base",
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-8">
            <span className="text-muted-foreground mr-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <Filter size={14} /> Topics:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all
                  ${activeCategory === cat
                    ? "bg-foreground text-background shadow-md"
                    : "bg-background text-muted-foreground border border-border hover:border-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. AUTHORS LIST (Horizontal Cards) */}
      <section className="py-16">
        <Container className="max-w-5xl">
          {filteredAuthors.length > 0 ? (
            <motion.div
              initial="hidden" animate="visible" variants={staggerContainer}
              className="flex flex-col gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredAuthors.map((author) => (
                  <motion.div
                    key={author.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <AuthorHorizontalCard author={author} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-xl font-serif font-bold">No authors found</h3>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

// --- IMPROVED HORIZONTAL AUTHOR CARD ---

const AuthorHorizontalCard = ({ author }) => {
  // Mapping some of your specific categories for the demo
  const topCategories = ["Next.js", "SQL", "AWS", "AI Editor", "UI Design"];

  return (
    <Card
      shadow="none"
      className="border border-border bg-card group hover:border-brand-blue/30 transition-all duration-300 rounded-none md:rounded-2xl"
    >
      <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8">

        {/* Left: Avatar & Quick Info */}
        <div className="flex flex-col items-center text-center shrink-0 w-32">
          <Avatar
            src={author.image}
            className="w-24 h-24 md:w-28 md:h-28 text-large ring-4 ring-background mb-4"
          />
          <Chip
            size="sm"
            variant="flat"
            className="bg-brand-blue text-white font-bold text-[10px] uppercase tracking-wider"
          >
            {author.category}
          </Chip>
        </div>

        {/* Center: Main Content */}
        <div className="flex-grow flex flex-col justify-center text-center md:text-left">
          <div className="mb-4">
            <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-brand-blue transition-colors">
              {author.name}
            </h3>
            <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mt-1">
              {author.role}
            </p>
            <p className="text-muted-foreground text-xs flex items-center justify-center md:justify-start gap-1 mt-2">
              <MapPin size={12} /> {author.location}
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl line-clamp-2 mb-4">
            {author.bio}
          </p>

          {/* NEW: Top Expertise Categories */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
            {topCategories.map((cat) => (
              <Chip
                key={cat}
                size="sm"
                classNames={{
                  base: "border-border bg-background h-6",
                  content: "text-[10px] font-bold uppercase tracking-tight text-muted-foreground",
                  dot: "bg-brand-mint"
                }}
              >
                {cat}
              </Chip>
            ))}
          </div>

          {/* Stats for Tablet/Desktop */}
          <div className="hidden md:flex items-center gap-8 mt-4 pt-6 border-t border-border/50">
            <StatItem icon={<BookOpen size={14} />} value={author.stats.articles} label="Articles" />
            <StatItem icon={<Users size={14} />} value={author.stats.followers} label="Followers" />
            <div className="flex flex-col">
              <span className="text-foreground font-bold text-sm">{author.stats.views}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Views</span>
            </div>
          </div>
        </div>

        {/* Right: Final Action */}
        <div className="flex flex-col justify-center items-center md:items-end shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
          <Button
            as={Link}
            href="/authors/slug"
            radius="full"
            className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 group-hover:bg-brand-blue transition-colors shadow-sm"
            endContent={<ArrowRight size={14} />}
          >
            Profile
          </Button>

          {/* Mobile-only Stats Container */}
          <div className="flex md:hidden gap-6 mt-6">
            <StatItem icon={<BookOpen size={14} />} value={author.stats.articles} label="Articles" />
            <StatItem icon={<Users size={14} />} value={author.stats.followers} label="Followers" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const StatItem = ({ icon, value, label }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 text-foreground font-bold text-sm">
      {icon} {value}
    </div>
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
  </div>
);