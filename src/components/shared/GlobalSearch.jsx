"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, ModalContent, ModalBody, Avatar } from "@heroui/react";
import { Search, FolderOpen, X, Loader2, FileText, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import Link from "next/link";
import dayjs from "dayjs";
import { SearchService } from "@/services/search.service";
import { encodeId } from "@/lib/hashids";

export default function GlobalSearchModal({ isOpen, onOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // 1. GLOBAL KEYBOARD SHORTCUT (CMD+K / CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
      // Also close on Escape
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpen, onClose]);

  // 2. Focus Management
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // 3. API Logic
  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await SearchService.globalSearch(searchTerm, 12);
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(performSearch, 400), []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  // 4. Data Grouping
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={(open) => !open && onClose()}
      size="4xl"
      hideCloseButton
      backdrop="blur"
      placement="top"
      classNames={{ 
        base: "mt-16 md:mt-24 bg-background border border-border shadow-2xl rounded-2xl overflow-hidden",
      }}
    >
      <ModalContent>
        <ModalBody className="p-0">
          
          {/* SEARCH INPUT AREA */}
          <div className="flex items-center px-8 bg-card border-b border-border/60 h-24">
            <Search size={28} className="text-brand-blue mr-6 shrink-0" strokeWidth={2.5} />
            <input
              ref={inputRef}
              className="flex-grow bg-transparent text-3xl md:text-4xl font-serif outline-none placeholder:text-muted-foreground/40 text-foreground tracking-tight"
              placeholder="Search everything..."
              value={query}
              onChange={handleInput}
            />
            {isSearching ? (
              <Loader2 className="animate-spin text-muted-foreground shrink-0 ml-4" size={24} />
            ) : query ? (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground shrink-0 ml-4 p-2 transition-colors rounded-full hover:bg-muted">
                <X size={24} />
              </button>
            ) : (
              <div className="shrink-0 ml-4 flex gap-1 items-center bg-muted px-3 py-1.5 rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-widest border border-border/50 shadow-inner">
                <span>CTRL</span><span>K</span>
              </div>
            )}
          </div>

          {/* RESULTS AREA */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-background p-6">
            <AnimatePresence mode="wait">
              {query && results.length === 0 && !isSearching ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center flex flex-col items-center">
                  <Search size={32} className="text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-serif text-xl">No results found for "{query}"</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
                  
                  {/* ARTICLES GROUP */}
                  {groupedResults['article'] && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-3 mb-4 px-2">
                        Articles
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {groupedResults['article'].map((article) => (
                          <Link
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            onClick={onClose}
                            className="group flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <div className="shrink-0 w-16 h-12 rounded-md overflow-hidden bg-muted mr-5 border border-border/50">
                              {article.image_url ? (
                                <img src={article.image_url} alt={article.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><FileText size={16}/></div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h5 className="font-serif font-bold text-foreground text-lg leading-tight group-hover:text-brand-blue transition-colors line-clamp-1">
                                {article.name || article.title}
                              </h5>
                              <p className="text-xs text-muted-foreground mt-1 font-medium">
                                Published {dayjs(article.created_at).format("MMM DD, YYYY")}
                              </p>
                            </div>
                            <ArrowRight size={16} className="text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AUTHORS GROUP */}
                  {groupedResults['author'] && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-3 mb-4 px-2">
                        Authors
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {groupedResults['author'].map((author) => (
                          <Link
                            key={author.id}
                            href={`/authors/${encodeId(author.id)}`}
                            onClick={onClose}
                            className="group flex items-center p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                          >
                            <Avatar src={author.avatar_url} name={author.name} size="md" className="mr-4 ring-2 ring-transparent group-hover:ring-brand-blue transition-all" />
                            <div>
                              <h5 className="font-bold text-sm text-foreground group-hover:text-brand-blue transition-colors">
                                {author.name}
                              </h5>
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                                View Profile
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COLLECTIONS GROUP */}
                  {groupedResults['collection'] && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-3 mb-4 px-2">
                        Collections
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {groupedResults['collection'].map((col) => (
                          <Link
                            key={col.id}
                            href={`/collections/${col.slug}`}
                            onClick={onClose}
                            className="group flex items-center p-4 rounded-xl bg-card border border-border hover:border-brand-blue/50 hover:shadow-md transition-all"
                          >
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mr-5">
                              <FolderOpen size={18} />
                            </div>
                            <div className="flex-grow">
                              <h5 className="font-serif font-bold text-foreground text-lg group-hover:text-brand-blue transition-colors">
                                {col.name}
                              </h5>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                              Series
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            {/* EMPTY STATE / SUGGESTIONS */}
            {!query && (
               <div className="py-12 flex flex-col items-center">
                 <div className="flex gap-4 mb-8">
                   <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"><FileText size={20}/></div>
                   <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"><User size={20}/></div>
                   <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"><FolderOpen size={20}/></div>
                 </div>
                 <p className="text-muted-foreground text-sm font-medium mb-6">Type anything to search across the entire collective.</p>
               </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}