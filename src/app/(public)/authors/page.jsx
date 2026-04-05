"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Avatar, Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowRight, Eye, Heart, FileText, ArrowUp } from "lucide-react";
import debounce from "lodash/debounce";
import Link from "next/link";
import dayjs from "dayjs";
import { encodeId } from "@/lib/hashids";
import Container from "@/components/shared/Container";
import AuthorService from "@/services/author.service";
import CategoryService from "@/services/category.service";
import { formatCompactNumber } from "@/lib/utils";

export default function AuthorsListingPage() {
  // --- UI States ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const searchInputRef = useRef(null);
  const observerTarget = useRef(null); // Ref for IntersectionObserver

  // --- Filter & Data States ---
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "All" });
  
  // --- Pagination & Loading States ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 1. Fetch Metadata (Categories)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const cats = await CategoryService.getAll();
        setCategories(cats.categories || []);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch Authors Logic
  const fetchAuthors = async (currentFilters, currentPage) => {
    try {
      if (currentPage === 1) setLoading(true);
      else setLoadingMore(true);

      const params = {
        categoryId: currentFilters.category === "All" ? undefined : currentFilters.category,
        search: currentFilters.search || undefined,
        page: currentPage,
        limit: 6,
      };

      const res = await AuthorService.getAll(params);
      const fetchedAuthors = res?.authors || [];
      const pagination = res?.pagination || { page: 1, pages: 1 };

      if (currentPage === 1) {
        setAuthors(fetchedAuthors);
      } else {
        setAuthors((prev) => [...prev, ...fetchedAuthors]);
      }

      setHasMore(pagination.page < pagination.pages);
    } catch (err) {
      console.error("Authors fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 3. Debounced Search Integration (Only for Filter Changes -> Resets to Page 1)
  const debouncedFetch = useCallback(
    debounce((f) => {
      setPage(1);
      fetchAuthors(f, 1);
    }, 500),
    []
  );

  // Trigger debounced fetch when filters change
  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  // Trigger immediate fetch when Page increments (Infinite Scroll)
  useEffect(() => {
    if (page > 1) {
      fetchAuthors(filters, page);
    }
  }, [page]);

  // 4. Intersection Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the target is visible, and we have more items, and we aren't currently loading anything
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 } // Trigger slightly before it comes fully into view
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore]);

  // --- Handlers ---
  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      updateFilter("search", "");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const CATEGORY_LIMIT = 7;
  const displayedCategories = showAllCategories ? categories : categories.slice(0, CATEGORY_LIMIT);
  const hasMoreCategories = categories.length > CATEGORY_LIMIT;

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* 1. HEADER & SEARCH SECTION */}
      <section className="pt-24 pb-10 bg-card border-b border-border shadow-sm z-30">
        <Container>
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 pb-8 border-b border-border">
            <div className="text-left w-full max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-4 tracking-tighter"
              >
                Our Brilliant Minds
              </motion.h1>
              <p className="text-muted-foreground text-lg italic">
                Discover the experts and storytellers shaping the conversation.
              </p>
            </div>

            {/* Expanding Search Bar */}
            <div className="flex justify-end h-14 w-full md:w-auto">
              <motion.div
                initial={false}
                animate={{
                  width: isSearchOpen
                    ? typeof window !== "undefined" && window.innerWidth < 768
                      ? "100%"
                      : "350px"
                    : "56px",
                }}
                className={`relative flex items-center h-14 rounded-full transition-colors duration-300 ${
                  isSearchOpen
                    ? "bg-background border-2 border-foreground"
                    : "bg-background border border-border hover:border-foreground"
                }`}
              >
                <button
                  onClick={handleSearchToggle}
                  className="absolute left-0 top-0 w-14 h-14 flex items-center justify-center z-20 text-foreground rounded-full outline-none"
                >
                  <Search size={20} strokeWidth={isSearchOpen ? 2.5 : 1.5} />
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 left-14 right-14"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search authors..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full h-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* DYNAMIC CATEGORY PILLS */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-8">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mr-2">
              <Filter size={14} /> Expertise:
            </span>

            <button
              onClick={() => updateFilter("category", "All")}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all
                ${filters.category === "All" ? "bg-foreground text-background shadow-md" : "bg-background text-muted-foreground border border-border hover:border-foreground hover:text-foreground"}`}
            >
              All Experts
            </button>

            {displayedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter("category", cat.id)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all
                  ${filters.category === cat.id ? "bg-foreground text-background shadow-md" : "bg-background text-muted-foreground border border-border hover:border-foreground hover:text-foreground"}`}
              >
                {cat.name}
              </button>
            ))}

            {hasMoreCategories && !showAllCategories && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all bg-muted text-foreground border border-transparent hover:border-border"
              >
                + {categories.length - CATEGORY_LIMIT} More
              </button>
            )}
          </div>
        </Container>
      </section>

      {/* 2. AUTHORS LIST & INFINITE SCROLL */}
      <section className="py-16">
        <Container className="max-w-5xl">
          {loading ? (
            /* Initial Loading State */
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <AuthorHorizontalSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {authors.length > 0 ? (
                <>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {authors.map((author) => (
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

                  {/* Loading More State (2 Skeletons) */}
                  {loadingMore && (
                    <div className="flex flex-col gap-6 mt-6">
                      {[1, 2].map((i) => (
                        <div key={`loading-more-${i}`} className="opacity-60 animate-pulse">
                          <AuthorHorizontalSkeleton />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Invisible Target for Intersection Observer */}
                  <div ref={observerTarget} className="h-10 w-full mt-4" />

                  {/* Reached End Section */}
                  {!hasMore && !loadingMore && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-16 py-12 flex flex-col items-center justify-center text-center border-t border-border/50"
                    >
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                        <Filter size={20} />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                        You've reached the end
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-8">
                        You have viewed all the brilliant minds available under your current filters. Adjust your search to discover more.
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
                </>
              ) : (
                /* No Authors Found State */
                <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-border/50 bg-card/30 rounded-3xl">
                  <h3 className="text-2xl font-serif font-bold mb-2">
                    No authors found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or expertise filters.
                  </p>
                  <Button
                    variant="bordered"
                    radius="full"
                    className="font-bold uppercase tracking-widest text-[10px] px-8 border-border hover:bg-foreground hover:text-background transition-all"
                    onPress={() => setFilters({ search: "", category: "All" })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
}

export const AuthorHorizontalCard = ({ author }) => {
  // Use the first category as the "Primary Role", fallback to "Contributor"
  const primaryCategory = author.categories?.[0]?.name || "Contributor";
  const displayCategories = author.categories || [];

  return (
    <Card
      shadow="none"
      className="border border-border bg-card group hover:border-brand-blue/30 transition-all duration-300 rounded-none md:rounded-2xl"
    >
      <CardBody className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8">
        {/* Left: Avatar */}
        <div className="flex flex-col items-center text-center shrink-0 w-32">
          <Avatar
            src={author.avatar_url}
            name={author.name}
            className="w-24 h-24 md:w-28 md:h-28 text-large font-bold bg-foreground text-background ring-4 ring-background mb-4"
          />
        </div>

        {/* Center: Main Content */}
        <div className="flex-grow flex flex-col justify-center text-center md:text-left">
          <div className="mb-4">
            <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-brand-blue transition-colors">
              {author.name}
            </h3>
            <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mt-1">
              {primaryCategory} Specialist
            </p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl line-clamp-2 mb-4">
            {author.bio ||
              "An insightful contributor to the Publisha collective, focusing on deep industry trends."}
          </p>

          {/* API Driven Expertise Categories */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
            {displayCategories.map((cat) => (
              <Chip
                key={cat.id}
                size="sm"
                classNames={{
                  base: "border-border bg-background h-6",
                  content:
                    "text-[10px] font-bold uppercase tracking-tight text-muted-foreground",
                }}
              >
                {cat.name}
              </Chip>
            ))}
          </div>

          {/* Stats & Joined Date */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mt-4 pt-6 border-t border-border/50">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5" title="Total Articles">
                <FileText size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {formatCompactNumber(author.total_articles)} Articles
                </span>
              </div>
              <div className="flex items-center gap-1.5" title="Total Views">
                <Eye size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {formatCompactNumber(author.total_views)} Views
                </span>
              </div>
              <div className="flex items-center gap-1.5" title="Total Likes">
                <Heart size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {formatCompactNumber(author.total_likes)} Likes
                </span>
              </div>
            </div>
            
            <span className="hidden md:block w-1 h-1 rounded-full bg-border" />
            
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Joined {dayjs(author.created_at).format("MMM YYYY")}
            </p>
          </div>
        </div>

        {/* Right: Final Action */}
        <div className="flex flex-col justify-center items-center md:items-end shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
          <Button
            as={Link}
            href={`/authors/${encodeId(author.id)}`}
            radius="full"
            className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 group-hover:bg-brand-blue transition-colors shadow-sm"
            endContent={<ArrowRight size={14} />}
          >
            Profile
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

// --- SKELETON ---
export const AuthorHorizontalSkeleton = () => (
  <Card
    shadow="none"
    className="border border-border bg-card rounded-none md:rounded-2xl min-h-[240px]"
  >
    <CardBody className="p-8 flex flex-col md:flex-row items-center md:items-stretch gap-8">
      {/* Avatar Skeleton */}
      <div className="flex flex-col items-center shrink-0 w-32">
        <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full mb-4" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-grow flex flex-col justify-center w-full">
        <Skeleton className="w-1/3 h-8 mb-2 mx-auto md:mx-0" />
        <Skeleton className="w-1/4 h-3 mb-6 mx-auto md:mx-0" />
        
        <Skeleton className="w-full max-w-xl h-4 mb-2 mx-auto md:mx-0" />
        <Skeleton className="w-2/3 max-w-md h-4 mb-6 mx-auto md:mx-0" />
        
        <div className="flex justify-center md:justify-start gap-2 mb-4">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="flex justify-center md:justify-start gap-4 mt-auto pt-6 border-t border-border/50">
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="shrink-0 flex items-center justify-center md:justify-end border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
        <Skeleton className="w-32 h-10 rounded-full" />
      </div>
    </CardBody>
  </Card>
);
