// components/sections/TrendingSection.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import ArticleService from "@/services/article.service";
import { useAuth } from "@/hooks/useAuth"; // Import your hook
import {
  HorizontalArticleCard,
  HorizontalCardSkeleton,
  VerticalArticleCard,
  VerticalCardSkeleton,
} from "@/components/shared/Article";
import Container from "../shared/Container";
import Link from "next/link";

export default function TrendingSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadTrending = async () => {
      if (articles.length === 0) setLoading(true);
      try {
        setLoading(true);
        const data = await ArticleService.getArticles({
          sort: "trending",
          limit: 7,
        });
        console.log(data)
        setArticles(data?.articles || []);
      } catch (err) {
        console.error("Error loading trending articles", err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadTrending();
  }, [isAuthenticated]);

  if (loading && isInitialLoad) return <TrendingSkeleton />;

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <section className="py-16">
      <Container>
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground">
            Trending Now
          </h2>
          <Button
            as={Link}
            href="/articles"
            variant="light"
            endContent={<ArrowRight size={16} />}
          >
            View all
          </Button>
        </div>

        <div className="flex flex-col gap-12">
          {featuredArticle && (
            <div className="w-full flex justify-center">
              <HorizontalArticleCard article={featuredArticle} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article) => (
              <VerticalArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// Simple Skeleton for better UX
const TrendingSkeleton = () => (
  <section className="py-16">
    <Container className="space-y-12">
      <HorizontalCardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <VerticalCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  </section>
);
