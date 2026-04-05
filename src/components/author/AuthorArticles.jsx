// @/components/author/AuthorArticles.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
      
    </div>
  );
}