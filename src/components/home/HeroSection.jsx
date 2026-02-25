"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Search, Feather, TrendingUp } from "lucide-react";
import CategoryService from "@/services/category.service";
import Container from "@/components/shared/Container";
import GlobalSearchModal from "@/components/shared/GlobalSearch";

export default function HeroSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getTrending();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      
      {/* Include the Modal in the component tree */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onOpen={() => setIsSearchOpen(true)} />

      <Container className="flex flex-col items-center justify-center text-center">
        <motion.div initial="hidden" animate="visible" className="relative z-10 w-full max-w-3xl flex flex-col items-center">
          
          <motion.span className="text-brand-mint mb-4">
            <Feather size={32} className="text-muted-foreground" />
          </motion.span>
          
          <motion.h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8">
            Discover extraordinary <br className="hidden md:block" /> ideas & stories.
          </motion.h1>

          {/* THE FAKE SEARCH BAR 
            It looks like an input, but clicking it opens the Omni-Search Modal 
          */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-16 relative rounded-full bg-card border-2 border-border hover:border-foreground transition-all group shadow-sm flex items-center px-6 cursor-text"
          >
             <Search className="text-muted-foreground group-hover:text-foreground transition-colors" size={24} />
             <span className="text-lg text-muted-foreground ml-4 font-serif">
               Search by author, article, or topic...
             </span>
             <div className="absolute right-2 bg-foreground text-background px-6 py-2.5 rounded-full font-medium text-sm">
               Search
             </div>
          </motion.div>

          {/* Trending Searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground flex items-center gap-2 font-medium">
              <TrendingUp size={16} /> Trending:
            </span>
            
            {isLoading ? (
              [...Array(4)].map((_,idx) => (
                <Skeleton key={idx} className="w-24 h-8 rounded-full bg-default-200" />
              ))
            ) : (
              categories.map((cat) => (
                <button 
                  key={cat.id} 
                  className="px-4 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors bg-card/50 backdrop-blur-sm"
                  onClick={() => window.location.href = `/articles?category=${cat.slug}`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>

        </motion.div>
      </Container>
    </section>
  );
}