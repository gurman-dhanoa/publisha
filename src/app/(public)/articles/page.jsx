"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2 } from "lucide-react";

import Container from "@/components/shared/Container";
// Importing the dynamic cards we finalized earlier
import { HorizontalArticleCard, VerticalArticleCard, ArticleData } from "@/components/shared/Article";

// --- DUMMY DATA ---
// Updated to perfectly match the ArticleData interface of your cards
const categories = ["All", "Development", "Politics", "Culture", "Mythology", "Cloud"];

const allArticles = [
  {
    id: 1,
    category: "Development",
    title: "Building the Kingmaker: Next.js & Complex Data Extraction",
    excerpt: "Dive deep into the architecture of modern political strategy platforms. Learn how to extract election data, optimize SQL queries, and render blazing-fast dashboards.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    author: "Basroop",
    tags: ["nextjs", "sql", "architecture"],
    commentsCount: 42,
    likesCount: 315,
    isFeatured: true
  },
  {
    id: 2,
    category: "Culture",
    title: "Portraits of Punjab: A Visual Renaissance",
    excerpt: "Exploring the vibrant, realistic depictions and the modern revival of traditional aesthetics in the heart of North India.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop",
    author: "Basroop",
    tags: ["culture", "art", "history"],
    commentsCount: 18,
    likesCount: 142,
    isFeatured: false
  },
  {
    id: 3,
    category: "Mythology",
    title: "The Odyssey: Cinematic Framing of Polyphemus",
    excerpt: "Analyzing the visual storytelling techniques used to convey the sheer scale and terror of the legendary cyclops in modern adaptations.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    author: "Homer",
    tags: ["mythology", "cinema", "epics"],
    commentsCount: 56,
    likesCount: 420,
    isFeatured: false
  },
  {
    id: 4,
    category: "Cloud",
    title: "AWS Cost Optimization: S3 Archiving Strategies",
    excerpt: "Stop overpaying for static assets. A comprehensive guide to lifecycle rules, Glacier transitions, and estimating long-term storage bills.",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop",
    author: "Jane Hopper",
    tags: ["aws", "cloud", "devops"],
    commentsCount: 12,
    likesCount: 89,
    isFeatured: false
  },
  {
    id: 5,
    category: "Development",
    title: "Troubleshooting Electron.js Render Pipelines",
    excerpt: "Solving screen rendering glitches and integrating push notifications seamlessly into your desktop applications.",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop",
    author: "Basroop",
    tags: ["electron", "desktop", "js"],
    commentsCount: 24,
    likesCount: 115,
    isFeatured: false
  },
  {
    id: 6,
    category: "Politics",
    title: "Swing Vote Calculations Logic in SQL",
    excerpt: "How to structure complex JOINs and handle specific character sets when analyzing constituency voting patterns.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    author: "Basroop",
    tags: ["sql", "data", "politics"],
    commentsCount: 33,
    likesCount: 210,
    isFeatured: false
  }
];

export default function ArticlesListingPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(3); // Start by showing 3 standard articles
  const loaderRef = useRef(null);

  // Filtering Logic
  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find(a => a.isFeatured);
  const standardArticles = filteredArticles.filter(a => !a.isFeatured);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < standardArticles.length) {
          // Simulate network delay for smooth UX, then load 3 more
          setTimeout(() => {
            setVisibleCount((prev) => prev + 3);
          }, 500);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the loader is visible
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, standardArticles.length]);

  // Reset visible count if user searches or filters
  useEffect(() => {
    setVisibleCount(3);
  }, [searchQuery, activeCategory]);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      
      {/* ================================================================= */}
      {/* 1. PAGE HEADER & FILTER BAR                                       */}
      {/* ================================================================= */}
      <section className="pt-20 pb-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-serif font-bold leading-tight mb-4 text-foreground">
                The Journal
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Insights, tutorials, and stories from our top authors. Explore everything from data architecture to cultural history.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="w-full md:w-80 shrink-0">
              <Input
                radius="full"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="text-muted-foreground ml-1" size={18} />}
                classNames={{
                  inputWrapper: "bg-card border-none shadow-sm h-14 focus-within:ring-2 ring-brand-mint transition-all",
                  input: "text-base text-foreground placeholder:text-muted-foreground",
                }}
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-8 pb-4">
            <span className="text-muted-foreground mr-2 hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
              <Filter size={14} /> Topics:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
                  ${activeCategory === cat 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-card text-muted-foreground border border-border hover:border-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 2. FEATURED ARTICLE                                               */}
      {/* ================================================================= */}
      <AnimatePresence>
        {featuredArticle && (
          <motion.section 
            initial="hidden" animate="visible" exit={{ opacity: 0, height: 0 }} variants={fadeUp}
            className="pb-16"
          >
            <Container>
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-brand-blue">
                  Featured
                </div>
                {/* Reusing your Horizontal Article Card */}
                <HorizontalArticleCard article={featuredArticle} />
              </div>
            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 3. STANDARD ARTICLES GRID                                         */}
      {/* ================================================================= */}
      <section>
        <Container>
          {standardArticles.length > 0 ? (
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
            >
              <AnimatePresence>
                {/* Only render up to the 'visibleCount' limit */}
                {standardArticles.slice(0, visibleCount).map((article) => (
                  <motion.div 
                    key={article.id} 
                    variants={fadeUp}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {/* Reusing your Vertical Article Card */}
                    <VerticalArticleCard article={article} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            !featuredArticle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              </motion.div>
            )
          )}

          {/* ================================================================= */}
          {/* 4. INFINITE SCROLL TRIGGER / LOADER                               */}
          {/* ================================================================= */}
          {standardArticles.length > 0 && (
            <div 
              ref={loaderRef} 
              className="mt-16 flex justify-center py-8 h-24"
            >
              {visibleCount < standardArticles.length ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-muted-foreground font-bold tracking-widest uppercase text-xs"
                >
                  <Loader2 className="animate-spin" size={16} /> Loading Stories...
                </motion.div>
              ) : (
                <div className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
                  You've reached the end
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

    </div>
  );
}