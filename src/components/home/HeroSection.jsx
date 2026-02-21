"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Search, Feather, TrendingUp } from "lucide-react";
import CategoryService from "@/services/category.service";
import Container from "@/components/shared/Container"; // Adjust path as needed

export default function HeroSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <Container className="flex flex-col items-center justify-center text-center">
        <motion.div 
          initial="hidden" animate="visible" 
          className="relative z-10 w-full max-w-3xl flex flex-col items-center"
        >
          <motion.span className="text-brand-mint mb-4">
            <Feather size={32} className="text-muted-foreground" />
          </motion.span>
          
          <motion.h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-8">
            Discover extraordinary <br className="hidden md:block" />
            ideas & stories.
          </motion.h1>

          <div className="w-full relative rounded-full bg-card group shadow-sm">
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
          </div>

          {/* Trending Searches */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground flex items-center gap-2 font-medium">
              <TrendingUp size={16} /> Trending:
            </span>
            
            {isLoading ? (
              // Skeleton loaders for a smoother production feel
              [...Array(8)].map((_,idx) => (
                <Skeleton key={idx} className="w-24 h-8 rounded-full bg-default-200" />
              ))
            ) : (
              categories.map((cat) => (
                <button 
                  key={cat.id} 
                  className="px-4 py-1.5 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors bg-card/50 backdrop-blur-sm"
                  onClick={() => window.location.href = `/category/${cat.slug}`}
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