"use client";

import React from "react";
import { Input, Button, Avatar, Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Feather, 
  ArrowRight,
  BookOpen,
  Users,
  FolderHeart
} from "lucide-react";

// Import custom components
import Container from "@/components/shared/Container"; 
import { HorizontalArticleCard, VerticalArticleCard } from "@/components/shared/Article"; 
import Link from "next/link";

// --- DUMMY DATA ---
const trendingCategories = ["Next.js", "SQL Architecture", "Mythology", "Cinematography", "AWS Optimization"];

const featuredArticle = {
  title: "Building the Kingmaker: Swing Vote Calculations in SQL",
  excerpt: "A deep dive into structuring complex JOINs and handling massive datasets when analyzing constituency voting patterns for modern political strategy platforms.",
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  author: "Basroop",
  tags: ["sql", "data", "architecture"],
  commentsCount: 42,
  likesCount: 315
};

const recentArticles = [
  {
    title: "Optimizing Next.js: Server Components in 2026",
    excerpt: "Explore the new paradigms of web development, optimizing SEO, and achieving blazing-fast load times with App Router.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop",
    author: "Basroop",
    tags: ["react", "nextjs", "performance"],
    commentsCount: 18,
    likesCount: 142
  },
  {
    title: "The Odyssey: Cinematic Framing of the Trojan War",
    excerpt: "Analyzing the visual storytelling and framing techniques used to convey the sheer scale and terror of ancient Greek epics.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    author: "Homer",
    tags: ["mythology", "cinema", "history"],
    commentsCount: 56,
    likesCount: 420
  },
  {
    title: "AWS Cost Optimization: S3 Archiving Strategies",
    excerpt: "Stop overpaying for storage. A comprehensive guide to lifecycle rules and estimating long-term Glacier transitions.",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop",
    author: "Jane Hopper",
    tags: ["aws", "cloud", "devops"],
    commentsCount: 12,
    likesCount: 89
  }
];

const topAuthors = [
  { 
    name: "Basroop", 
    role: "Full-Stack Developer", 
    bio: "Creator of Kingmaker, specializing in Next.js, complex data extraction, and application state management.",
    image: "https://i.pravatar.cc/150?u=basroop",
    stats: { articles: 42, followers: "12.4K" }
  },
  { 
    name: "Helen Kotovski", 
    role: "Visual Artist", 
    bio: "Capturing the essence of culture and crafting cinematic multi-image compositions and portraits.",
    image: "https://i.pravatar.cc/150?u=helen",
    stats: { articles: 89, followers: "45K" }
  },
  { 
    name: "Jane Hopper", 
    role: "Cloud Architect", 
    bio: "AWS cost optimization expert, specializing in EC2 pipelines and long-term S3 archiving strategies.",
    image: "https://i.pravatar.cc/150?u=jane",
    stats: { articles: 31, followers: "8.2K" }
  },
];

export default function HomePage() {
  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* ================================================================= */}
      {/* 1. HERO SEARCH SECTION                                              */}
      {/* ================================================================= */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <Container className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="relative z-10 w-full max-w-3xl flex flex-col items-center"
          >
            <motion.span variants={fadeUp} className="text-brand-mint mb-4">
              <Feather size={32} className="text-muted-foreground" />
            </motion.span>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8">
              Discover extraordinary <br className="hidden md:block" />
              ideas & stories.
            </motion.h1>

            <motion.div variants={fadeUp} className="w-full relative rounded-full bg-card group shadow-sm">
              <Input
                radius="full"
                size="lg"
                placeholder="Search by author, article, or topic..."
                startContent={<Search className="text-muted-foreground ml-2" />}
                variant="bordered"
                endContent={
                  <Button radius="full" className="bg-foreground text-background px-8 font-medium">
                    Search
                  </Button>
                }
                classNames={{
                  inputWrapper: "h-16 bg-card border-2 focus-within:border-border group-hover:border-border transition-all px-4 shadow-none",
                  input: "text-lg text-foreground placeholder:text-muted-foreground ml-2",
                }}
              />
            </motion.div>

            {/* Trending Searches */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="text-muted-foreground flex items-center gap-2 font-medium">
                <TrendingUp size={16} /> Trending:
              </span>
              {trendingCategories.map((cat) => (
                <button key={cat} className="px-4 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors bg-card/50 backdrop-blur-sm">
                  {cat}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 2. STATS SECTION                                                  */}
      {/* ================================================================= */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
        className="pb-20"
      >
        <Container className="max-w-[1000px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border/60">
            <StatBox icon={<BookOpen />} number="15k+" label="Published Articles" />
            <StatBox icon={<Users />} number="2.5M" label="Monthly Readers" />
            <StatBox icon={<Feather />} number="850+" label="Verified Authors" />
            <StatBox icon={<Sparkles />} number="100%" label="AI-Assisted Quality" />
          </div>
        </Container>
      </motion.section>

      {/* ================================================================= */}
      {/* 3. POPULAR ARTICLES SECTION (Dynamic)                               */}
      {/* ================================================================= */}
      <section className="py-16">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground">Trending Now</h2>
            <Button variant="light" endContent={<ArrowRight size={16} />} className="text-muted-foreground hover:text-foreground">
              View all
            </Button>
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="flex flex-col gap-12"
          >
            {/* Featured Horizontal Card */}
            <motion.div variants={fadeUp} className="w-full flex justify-center">
              <HorizontalArticleCard article={featuredArticle} />
            </motion.div>

            {/* Grid of Vertical Cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {recentArticles.map((article, index) => (
                <VerticalArticleCard key={index} article={article} />
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 4. NEW SECTION: CURATED COLLECTIONS                               */}
      {/* ================================================================= */}
      <section className="py-24 bg-card border-y border-border">
        <Container>
          <div className="text-center mb-16">
            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4 block">Deep Dives</span>
            <h2 className="text-4xl font-serif font-bold text-foreground">Curated Collections</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Explore comprehensive series grouped by topic, from full-stack architecture to cultural deep dives.</p>
          </div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <CollectionCard title="Mastering Next.js & React" count={12} image="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800" />
            <CollectionCard title="Political Data Strategies" count={8} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" />
            <CollectionCard title="Portraits of Punjab" count={5} image="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800" />
          </motion.div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 5. AI EDITOR / AUTHOR GLORIFICATION SECTION                       */}
      {/* ================================================================= */}
      <section className="py-24 bg-surface-dark text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-surface-darker to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        
        <Container className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="w-full lg:w-1/2"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-mint text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> For Authors
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold leading-[1.15] mb-6">
              Write smarter, not harder. <br />
              <span className="text-gray-400 italic">Powered by AI.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              We believe authors are the heartbeat of our platform. That's why we've integrated a state-of-the-art AI editor that helps you overcome writer's block, perfect your tone, and format your thoughts instantly.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4">
              <Button as={Link} href="/publish" size="lg" radius="full" className="bg-brand-mint text-black font-bold px-8">
                Start Writing Now
              </Button>
              <Button size="lg" radius="full" variant="bordered" className="border-gray-500 text-white hover:bg-white/5">
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
                <span className="ml-4 text-xs text-gray-500">editor.publisha.com</span>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-700/50 rounded w-3/4" />
                <div className="h-4 bg-gray-700/30 rounded w-full" />
                <div className="h-4 bg-gray-700/30 rounded w-5/6" />
                <div className="h-4 bg-brand-mint/20 border border-brand-mint/30 rounded w-4/6 flex items-center px-2 text-[10px] text-brand-mint">
                  <Sparkles size={10} className="mr-2" /> AI is refining this paragraph...
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 6. ENHANCED AUTHORS SECTION                                       */}
      {/* ================================================================= */}
      <section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Brilliant Minds</h2>
            <p className="text-muted-foreground text-lg">Meet the experts and storytellers shaping the conversation.</p>
          </div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topAuthors.map((author, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <Card as={Link} href={"/authors/slug"} shadow="sm" className="bg-card border border-border h-full flex flex-col group hover:border-foreground/30 transition-colors">
                  <CardBody className="p-8 flex flex-col items-center text-center flex-grow">
                    <Avatar src={author.image} className="w-24 h-24 mb-4 ring-4 ring-background" />
                    <h4 className="font-serif font-bold text-xl text-foreground mb-1">{author.name}</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-4">{author.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-3 mb-6">
                      {author.bio}
                    </p>
                    
                    {/* Author Stats inside the card */}
                    <div className="w-full flex justify-center gap-6 pt-6 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-foreground font-bold">{author.stats.articles}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Articles</span>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="flex flex-col">
                        <span className="text-foreground font-bold">{author.stats.followers}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Followers</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 flex justify-center">
            <Button variant="bordered" className="border-border text-foreground font-bold text-xs uppercase tracking-widest px-8">
              View Directory
            </Button>
          </div>
        </Container>
      </section>

    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatBox = ({ icon, number, label }) => (
  <div className="flex flex-col items-center justify-center text-center p-4">
    <div className="text-muted-foreground mb-3">{icon}</div>
    <h4 className="text-4xl font-serif font-bold text-foreground mb-1">{number}</h4>
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
  </div>
);

const CollectionCard = ({ title, count, image }) => (
  <Link href={"/collection/slug"} className="group cursor-pointer">
    <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-border">
      <Image
        removeWrapper
        alt={title}
        src={image}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </div>
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
      <FolderHeart size={14} className="text-brand-blue" />
      <span>{count} Articles</span>
    </div>
    <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-brand-blue transition-colors">{title}</h3>
  </Link>
);