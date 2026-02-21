"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input, Select, SelectItem, Avatar, Chip, Button } from "@heroui/react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import debounce from "lodash/debounce";

import Container from "@/components/shared/Container";
import { VerticalArticleCard, VerticalCardSkeleton } from "@/components/shared/Article";
import ArticleService from "@/services/article.service";
import CategoryService from "@/services/category.service";
import AuthorService from "@/services/author.service";

export default function ArticlesListingPage() {
  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    author: "all",
    sort: "latest"
  });

  // Data States
  const [articles, setArticles] = useState([]);
  const [options, setOptions] = useState({ categories: [], authors: [] });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Filter Options (Categories & Authors)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cats, auths] = await Promise.all([
          CategoryService.getAll(),
          AuthorService.getAll()
        ]);
        setOptions({ categories: cats, authors: auths });
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    fetchOptions();
  }, []);

  // 2. Fetch Articles Logic
  const fetchArticles = async (currentFilters) => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 12,
        status: 'published',
        sort: currentFilters.sort,
        category: currentFilters.category === "all" ? undefined : currentFilters.category,
        author: currentFilters.author === "all" ? undefined : currentFilters.author,
        search: currentFilters.search || undefined
      };

      const res = await ArticleService.getArticles(params);
      setArticles(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Debounced Search
  const debouncedFetch = useCallback(
    debounce((f) => fetchArticles(f), 500),
    []
  );

  useEffect(() => {
    debouncedFetch(filters);
    return debouncedFetch.cancel;
  }, [filters, debouncedFetch]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "all", author: "all", sort: "latest" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* FILTER HEADER */}
      <section className="pt-16 pb-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-20 z-30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Search */}
            <div className="lg:col-span-4">
              <Input
                placeholder="Search archives..."
                variant="bordered"
                radius="none"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                startContent={<Search size={18} className="text-muted-foreground" />}
                classNames={{ inputWrapper: "border-border h-12 bg-background" }}
              />
            </div>

            {/* Category Select */}
            <div className="lg:col-span-3">
              <Select 
                placeholder="All Categories" 
                variant="bordered"
                radius="none"
                selectedKeys={[filters.category]}
                onSelectionChange={(keys) => updateFilter("category", Array.from(keys)[0])}
                classNames={{ trigger: "border-border h-12 bg-background" }}
              >
                <SelectItem key="all">All Categories</SelectItem>
                {options.categories.map((cat) => (
                  <SelectItem key={cat.slug}>{cat.name}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Author Select */}
            <div className="lg:col-span-3">
              <Select 
                placeholder="All Authors" 
                variant="bordered"
                radius="none"
                selectedKeys={[filters.author]}
                onSelectionChange={(keys) => updateFilter("author", Array.from(keys)[0])}
                classNames={{ trigger: "border-border h-12 bg-background" }}
              >
                <SelectItem key="all">All Authors</SelectItem>
                {options.authors.map((auth) => (
                  <SelectItem key={auth.id} textValue={auth.name}>
                    <div className="flex items-center gap-2">
                      <Avatar src={auth.avatar_url} size="sm" />
                      <span>{auth.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Sort */}
            <div className="lg:col-span-2">
              <Select 
                variant="bordered"
                radius="none"
                selectedKeys={[filters.sort]}
                onSelectionChange={(keys) => updateFilter("sort", Array.from(keys)[0])}
                startContent={<ArrowUpDown size={16} />}
                classNames={{ trigger: "border-border h-12 bg-background" }}
              >
                <SelectItem key="latest">Latest</SelectItem>
                <SelectItem key="popular">Popular</SelectItem>
                <SelectItem key="trending">Trending</SelectItem>
              </Select>
            </div>
          </div>

          {/* Active Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.category !== "all" && (
              <Chip radius="none" onClose={() => updateFilter("category", "all")} variant="flat" className="bg-brand-blue/10 text-brand-blue font-bold uppercase text-[10px]">
                Category: {filters.category}
              </Chip>
            )}
            {filters.author !== "all" && (
              <Chip radius="none" onClose={() => updateFilter("author", "all")} variant="flat" className="bg-brand-mint/10 text-brand-mint font-bold uppercase text-[10px]">
                Author: {options.authors.find(a => a.id.toString() === filters.author.toString())?.name}
              </Chip>
            )}
            {(filters.category !== "all" || filters.author !== "all" || filters.search) && (
              <Button size="sm" variant="light" onPress={clearFilters} className="text-[10px] font-bold uppercase tracking-widest px-0 ml-2">
                Clear All
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* ARTICLE GRID */}
      <Container className="pt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <VerticalCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((art) => (
                  <VerticalArticleCard key={art.id} article={art} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-border flex flex-col items-center">
                <Filter size={48} className="text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-serif font-bold">No results match your criteria</h3>
                <p className="text-muted-foreground mt-2">Try resetting your filters to see more stories.</p>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}