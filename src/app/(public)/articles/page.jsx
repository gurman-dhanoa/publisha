"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Input, 
  Avatar, 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem 
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowDownWideNarrow, X, ChevronDown } from "lucide-react";
import debounce from "lodash/debounce";

import Container from "@/components/shared/Container";
import { VerticalArticleCard, HorizontalArticleCard } from "@/components/shared/Article";
import { VerticalCardSkeleton, HorizontalCardSkeleton } from "@/components/shared/Article";
import ArticleService from "@/services/article.service";
import CategoryService from "@/services/category.service";
import AuthorService from "@/services/author.service";

export default function ArticlesListingPage() {
  // --- UI States ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const searchInputRef = useRef(null);

  // --- Filter & Data States ---
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    author: "All",
    sort: "latest"
  });

  // 1. Fetch Metadata (Categories & Authors)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, auths] = await Promise.all([
          CategoryService.getAll(),
          AuthorService.getAll()
        ]);
        setCategories(cats);
        setAuthors(auths);
      } catch (err) {
        console.error("Metadata fetch error:", err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch Articles Logic
  const fetchArticles = async (currentFilters) => {
    try {
      setLoading(true);
      const params = {
        status: 'published',
        sort: currentFilters.sort,
        category: currentFilters.category === "All" ? undefined : currentFilters.category,
        author: currentFilters.author === "All" ? undefined : currentFilters.author,
        search: currentFilters.search || undefined
      };
      
      const res = await ArticleService.getArticles(params);
      setArticles(res);
    } catch (err) {
      console.error("Articles fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Debounced Search Integration
  const debouncedFetch = useCallback(
    debounce((f) => fetchArticles(f), 500),
    []
  );

  useEffect(() => {
    debouncedFetch(filters);
    return debouncedFetch.cancel;
  }, [filters, debouncedFetch]);

  // --- Handlers ---
  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      updateFilter("search", ""); // Clear search on close
    }
  };

  // Determine which categories to show
  const CATEGORY_LIMIT = 7;
  const displayedCategories = showAllCategories ? categories : categories.slice(0, CATEGORY_LIMIT);
  const hasMoreCategories = categories.length > CATEGORY_LIMIT;

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Derived state to keep the layout clean
  const isDefaultView = filters.category === "All" && filters.author === "All" && !filters.search;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      
      {/* ========================================================== */}
      {/* 1. EDITORIAL HEADER & EXPANDING SEARCH                     */}
      {/* ========================================================== */}
      <section className="pt-24 pb-12">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-4 tracking-tighter"
              >
                The Journal
              </motion.h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-xl">
                Exploring the intersection of modern architecture, political data, and the digital renaissance.
              </p>
            </div>
            
            {/* Expanding Search Bar */}
            <div className="flex justify-end h-14 w-full md:w-auto mt-6 md:mt-0">
              <motion.div
                initial={false}
                animate={{ 
                  width: isSearchOpen ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "100%" : "350px") : "56px" 
                }}
                className={`relative flex items-center h-14 rounded-full transition-colors duration-300 ${
                  isSearchOpen ? "bg-card border-2 border-foreground" : "bg-card border border-border hover:border-foreground"
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
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 left-14 right-14"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search the archives..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="w-full h-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isSearchOpen && filters.search && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => updateFilter("search", "")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted rounded-full"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 2. ELEGANT FILTER CONTROLS                                 */}
          {/* ========================================================== */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8">
            
            {/* Left: Flex-Wrap Categories */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <span className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mr-2">
                  <Filter size={14} /> Topics:
                </span>
                
                <button
                  onClick={() => updateFilter("category", "All")}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all
                    ${filters.category === "All" ? "bg-foreground text-background shadow-md" : "bg-card border border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                >
                  All
                </button>
                
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter("category", cat.slug)}
                    className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all
                      ${filters.category === cat.slug ? "bg-foreground text-background shadow-md" : "bg-card border border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                  >
                    {cat.name}
                  </button>
                ))}

                {/* Load More Categories Pill */}
                {hasMoreCategories && !showAllCategories && (
                  <button
                    onClick={() => setShowAllCategories(true)}
                    className="px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all bg-muted text-foreground border border-transparent hover:border-border"
                  >
                    + {categories.length - CATEGORY_LIMIT} More
                  </button>
                )}
              </div>
            </div>

            {/* Right: Sort & Author Dropdowns */}
            <div className="flex items-center gap-4 shrink-0">
              
              {/* Author Dropdown */}
              <Dropdown placement="bottom-end" classNames={{ content: "min-w-[200px] rounded-none border-border" }}>
                <DropdownTrigger>
                  <Button variant="light" radius="none" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground px-2 data-[hover=true]:bg-transparent">
                    Author: {filters.author === "All" ? "All" : authors.find(a => a.id.toString() === filters.author)?.name.split(" ")[0]}
                    <ChevronDown size={14} className="ml-1" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Author Selection" 
                  variant="flat" 
                  selectedKeys={[filters.author]}
                  onSelectionChange={(keys) => updateFilter("author", Array.from(keys)[0])}
                  selectionMode="single"
                >
                  <DropdownItem key="All">All Authors</DropdownItem>
                  {authors.map((auth) => (
                    <DropdownItem key={auth.id.toString()} textValue={auth.name}>
                      <div className="flex items-center gap-3">
                        <Avatar src={auth.avatar_url} size="sm" className="w-6 h-6" />
                        <span className="font-medium text-sm">{auth.name}</span>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <div className="w-px h-4 bg-border" />

              {/* Sort Dropdown */}
              <Dropdown placement="bottom-end" classNames={{ content: "min-w-[150px] rounded-none border-border" }}>
                <DropdownTrigger>
                  <Button variant="light" radius="none" className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground px-2 data-[hover=true]:bg-transparent">
                    Sort: {filters.sort}
                    <ArrowDownWideNarrow size={14} className="ml-1" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Sort Order" 
                  variant="flat"
                  selectedKeys={[filters.sort]}
                  onSelectionChange={(keys) => updateFilter("sort", Array.from(keys)[0])}
                  selectionMode="single"
                >
                  <DropdownItem key="latest">Latest</DropdownItem>
                  <DropdownItem key="popular">Popular</DropdownItem>
                  <DropdownItem key="trending">Trending</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

          </div>
        </Container>
      </section>

      {/* ========================================================== */}
      {/* 3. ARTICLES CONTENT AREA                                   */}
      {/* ========================================================== */}
      <section className="pt-12">
        <Container>
          {loading ? (
            <div className="space-y-16">
              <HorizontalCardSkeleton />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3].map(i => <VerticalCardSkeleton key={i} />)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              <AnimatePresence mode="wait">
                {articles.length > 0 ? (
                  <motion.div 
                    key={JSON.stringify(filters)}
                    initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="flex flex-col gap-16"
                  >
                    {/* Hero Article (Only shows if no specific filters are applied) */}
                    {isDefaultView && articles[0] && (
                       <motion.div variants={fadeUp}>
                          <HorizontalArticleCard article={articles[0]} />
                       </motion.div>
                    )}

                    {/* Standard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                      {(isDefaultView ? articles.slice(1) : articles).map((art) => (
                        <motion.div key={art.id} variants={fadeUp} className="h-full">
                          <VerticalArticleCard article={art} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-border/50 bg-card/30"
                  >
                     <div className="w-16 h-16 mb-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Search size={24} />
                     </div>
                     <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No dispatches found</h3>
                     <p className="text-muted-foreground">We couldn't find any articles matching your current filters.</p>
                     <Button 
                        variant="bordered" 
                        radius="full"
                        className="mt-8 font-bold uppercase tracking-widest text-[10px] px-8 h-12 border-border hover:bg-foreground hover:text-background transition-all" 
                        onClick={() => setFilters({ search: "", category: "All", author: "All", sort: "latest" })}
                      >
                        Clear All Filters
                     </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </Container>
      </section>

    </div>
  );
}