// @/components/author/AuthorArticles.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowUp, FileText } from "lucide-react";
import { Button } from "@heroui/react";
import { VerticalArticleCard } from "@/components/shared/Article";
import { VerticalCardSkeleton } from "@/components/shared/Article";
import ArticleService from "@/services/article.service";
import AuthorService from "@/services/author.service";

export default function AuthorArticles({ authorId }) {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  const fetchArticles = async (pageNum = 1) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);
      const res = await AuthorService.getPublishedArticles(authorId, { page: pageNum, limit: 6 });
      const fetchedArticles = res.articles || [];
      setArticles(prev => pageNum === 1 ? fetchedArticles : [...prev, ...fetchedArticles]);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load author articles", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, [authorId]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && pagination.page < pagination.pages && !loadingMore) {
        fetchArticles(pagination.page + 1);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [pagination, loadingMore]);

  // --- Scroll to Top Handler ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => <VerticalCardSkeleton key={i} />)}
    </div>
  );

  if (articles.length === 0) return <div className="py-20 text-center text-muted-foreground italic font-serif">No articles published yet.</div>;

  return (
    <div className="py-10 flex flex-col gap-10">
      
      {/* 1. LOADED ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {articles.map((article) => (
          <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <VerticalArticleCard article={article} />
          </motion.div>
        ))}
      </div>
      
      {/* 2. INFINITE SCROLL TRIGGER & SKELETON ROW */}
      <div ref={loaderRef} className="w-full">
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Skeleton 1: Always visible (Mobile, Tablet, Desktop) */}
            <div className="block">
              <VerticalCardSkeleton />
            </div>
            
            {/* Skeleton 2: Visible on Tablet and Desktop only */}
            <div className="hidden md:block">
              <VerticalCardSkeleton />
            </div>
            
            {/* Skeleton 3: Visible on Desktop only */}
            <div className="hidden lg:block">
              <VerticalCardSkeleton />
            </div>
            
          </div>
        )}
      </div>
      
      {/* 3. REACHED END SECTION */}
      {!loadingMore && pagination.page >= pagination.pages && articles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 py-12 flex flex-col items-center justify-center text-center border-t border-border/50"
        >
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            <FileText size={20} />
          </div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">
            End of articles
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-8">
            You have viewed all the articles published by this author.
          </p>
          <Button 
            onPress={scrollToTop}
            variant="bordered"
            radius="full"
            startContent={<ArrowUp size={16} />}
            className="bg-card font-bold uppercase tracking-widest text-xs border-border hover:bg-foreground hover:text-background transition-colors px-6"
          >
            Back to top
          </Button>
        </motion.div>
      )}

    </div>
  );
}