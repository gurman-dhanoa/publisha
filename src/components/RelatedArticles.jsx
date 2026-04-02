"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";
import {
  VerticalArticleCard,
  VerticalCardSkeleton,
} from "@/components/shared/Article";
import ArticleService from "@/services/article.service";

export default function RelatedArticles({ currentArticleId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Fetching trending articles as a placeholder for related content
        const { articles } = await ArticleService.getArticles({
          sort: "trending",
          limit: 4,
        });

        // Filter out the current article if its ID is provided
        const filtered = articles ? articles
          .filter((art) => art.id !== currentArticleId)
          .slice(0, 3) : [];
        setArticles(filtered);
      } catch (error) {
        console.error("Failed to fetch related articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentArticleId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full bg-card py-24 border-t border-border mt-16">
      <Container>
        <div className="text-center mb-14">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4 block">
            Keep Reading
          </span>
          <h2 className="text-4xl font-serif font-bold text-foreground">
            Related Articles
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {loading
            ? // Show Skeletons while loading
              [...Array(3)].map((_, i) => <VerticalCardSkeleton key={i} />)
            : articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={cardVariants}
                  className="w-full"
                >
                  <VerticalArticleCard article={article} />
                </motion.div>
              ))}
        </motion.div>

        {!loading && articles.length === 0 && (
          <p className="text-center text-muted-foreground">
            No related articles found.
          </p>
        )}
      </Container>
    </section>
  );
}
