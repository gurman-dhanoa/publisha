"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { ArrowUp, Layers } from "lucide-react";
import CollectionService from "@/services/collection.service";
import { CollectionCard, CollectionSkeleton } from "../shared/CollectionCard";

export default function AuthorCollections({ authorId }) {
  // --- States ---
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const loaderRef = useRef(null);

  // --- Data Fetching ---
  const fetchCollections = async (currentPage) => {
    try {
      if (currentPage === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await CollectionService.getByAuthor(authorId, { 
        page: currentPage, 
        limit: 10 
      });
      
      const fetchedCollections = res?.collections || [];
      const pagination = res?.pagination || { page: 1, pages: 1 };

      if (currentPage === 1) {
        setCollections(fetchedCollections);
      } else {
        setCollections((prev) => [...prev, ...fetchedCollections]);
      }

      setHasMore(pagination.page < pagination.pages);
    } catch (err) {
      console.error("Failed to load collections", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetch when page or authorId changes
  useEffect(() => {
    if (authorId) {
      fetchCollections(page);
    }
  }, [authorId, page]);

  // --- Infinite Scroll Observer ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, loadingMore]);

  // --- Scroll to Top Handler ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Render Initial Loading ---
  if (loading) {
    return (
      <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <CollectionSkeleton />
        <div className="hidden md:block"><CollectionSkeleton /></div>
        <div className="hidden lg:block"><CollectionSkeleton /></div>
      </div>
    );
  }

  // --- Render Empty State ---
  if (collections.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground italic font-serif">
        No series curated yet.
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    <div className="py-10 flex flex-col gap-10">
      
      {/* 1. Loaded Collections Grid */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch"
      >
        <AnimatePresence mode="popLayout">
          {collections.map((col) => (
            <motion.div 
              key={col.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CollectionCard collection={col} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 2. Infinite Scroll Trigger & Skeleton Row */}
      <div ref={loaderRef} className="w-full">
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch mt-4">
            <div className="block"><CollectionSkeleton /></div>
            <div className="hidden md:block"><CollectionSkeleton /></div>
            <div className="hidden lg:block"><CollectionSkeleton /></div>
          </div>
        )}
      </div>

      {/* 3. Reached End Section */}
      {!hasMore && !loadingMore && collections.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 py-12 flex flex-col items-center justify-center text-center border-t border-border/50"
        >
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            <Layers size={20} />
          </div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">
            End of series
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-8">
            You have viewed all the series curated by this author.
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