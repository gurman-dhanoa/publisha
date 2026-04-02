"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Added Link
import { Avatar, Button, Divider, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin, TrendingUp, Layers } from "lucide-react";
import Container from "@/components/shared/Container";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleService from "@/services/article.service";
import CollectionService from "@/services/collection.service";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import ReviewSection from "@/components/reviews/ReviewSection";
import { encodeId } from "@/lib/hashids";

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await ArticleService.getBySlug(slug);
        setArticle(data);
      } catch (error) {
        console.error("Failed to load article", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSidebarData = async () => {
      try {
        const [articles, collections] = await Promise.all([
          ArticleService.getArticles({ sort: "trending", limit: 5 }),
          CollectionService.getPopular(5),
        ]);
        setTrendingArticles(articles.articles || []);
        setTrendingCollections(collections);
      } catch (error) {
        console.error("Sidebar data fetch failed", error);
      } finally {
        setSidebarLoading(false);
      }
    };

    fetchArticle();
    fetchSidebarData();
  }, [slug]);

  if (loading) return <ArticleDetailSkeleton />;
  if (!article)
    return <div className="py-20 text-center">Article not found.</div>;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Container>
        <main className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">
          {/* LEFT COLUMN */}
          <motion.div
            className="w-full lg:w-[65%]"
            initial="hidden"
            animate="visible"
          >
            {/* ... (Existing Article Content) ... */}
            <motion.div
              variants={fadeIn}
              className="text-xs text-muted-foreground font-medium mb-6"
            >
              Home / Blog /{" "}
              <span className="text-foreground">{article.title}</span>
            </motion.div>
            <motion.h1
              variants={fadeIn}
              className="text-5xl lg:text-6xl font-serif mb-8"
            >
              {article.title}
            </motion.h1>

            {/* Author Metadata */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 text-xs text-muted-foreground"
            >
              <Link href={`/authors/${encodeId(article.author_id)}`} className="flex items-center gap-3">
                <Avatar
                  src={article.author_avatar}
                  name={article.author_name}
                  size="md"
                  className="w-10 h-10 border border-border"
                />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {article.author_name}
                  </p>
                  <p>Editorial Contributor</p>
                </div>
              </Link>

              <div className="hidden sm:block w-px h-8 bg-border" />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p>{dayjs(article.published_at).format("MMMM DD, YYYY")}</p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <p>
                  Categories:{" "}
                  {article.categories?.map((c) => c.name).join(", ")}
                </p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <p>{article.views_count} Views</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <Image
                width={900}
                height={800}
                alt={article.title}
                src={article.image_url}
                className="w-full h-auto max-h-[600px] object-cover rounded-none"
              />
            </motion.div>

            {/* Article Body - Rendering HTML from Backend */}
            <motion.article
              variants={fadeIn}
              className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed
                                       prose-h2:text-xl prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-foreground
                                       prose-strong:text-foreground prose-li:marker:text-brand-blue"
            >
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </motion.article>
          </motion.div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <motion.aside
            className="w-full lg:w-[35%] flex flex-col gap-10"
            initial="hidden"
            animate="visible"
          >
            {/* Social Follow */}
            <motion.div variants={fadeIn}>
              <h3 className="text-[10px] uppercase font-bold tracking-widest mb-4 opacity-60">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <SocialIcon Icon={Twitter} />
                <SocialIcon Icon={Linkedin} />
                <SocialIcon Icon={Instagram} />
              </div>
            </motion.div>

            <Divider className="opacity-50" />

            {/* Summary Widget */}
            <motion.div
              variants={fadeIn}
              className="bg-card p-6 border border-border"
            >
              <h3 className="text-[10px] uppercase font-bold tracking-widest mb-3 text-brand-blue">
                In Brief
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                "{article.summary}"
              </p>
            </motion.div>

            {/* Dynamic Trending Articles */}
            <motion.div variants={fadeIn}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Trending Stories
                </h3>
              </div>
              <ul className="flex flex-col gap-5">
                {sidebarLoading
                  ? [1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-none" />
                    ))
                  : trendingArticles.map((art) => (
                      <ListItem
                        key={art.id}
                        text={art.title}
                        href={`/articles/${art.slug}`}
                      />
                    ))}
              </ul>
            </motion.div>

            <Divider className="opacity-50" />

            {/* Dynamic Trending Collections */}
            <motion.div variants={fadeIn}>
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} className="text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Popular Collections
                </h3>
              </div>
              <ul className="flex flex-col gap-5">
                {sidebarLoading
                  ? [1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-none" />
                    ))
                  : trendingCollections.map((col) => (
                      <ListItem
                        key={col.id}
                        text={col.name}
                        href={`/collections/${col.slug}`}
                        subtext={`${col.articles_count} Articles`}
                      />
                    ))}
              </ul>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div variants={fadeIn} className="sticky top-24">
              <div className="bg-foreground p-8 text-center shadow-2xl">
                <h3 className="text-background text-2xl font-serif mb-2">
                  The Collective
                </h3>
                <p className="text-background/60 text-[10px] uppercase tracking-widest mb-6">
                  Exclusive Editorial Insight
                </p>
                <Button
                  radius="none"
                  fullWidth
                  className="bg-background text-foreground font-bold text-xs uppercase tracking-widest py-6"
                >
                  Subscribe Now
                </Button>
              </div>
            </motion.div>
          </motion.aside>
        </main>
        {article?.id && (
          <ReviewSection
            articleId={article.id}
            articleAuthorId={article.author_id}
          />
        )}
      </Container>
      <RelatedArticles currentArticleId={article.id} />
    </div>
  );
}

const ArticleDetailSkeleton = () => (
  <Container className="py-16">
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-[65%] space-y-8">
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-full h-16" />
        <div className="flex gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-1/2 h-12" />
        </div>
        <Skeleton className="w-full h-[400px]" />
        <Skeleton className="w-full h-64" />
      </div>
      <div className="hidden lg:block w-[35%] space-y-8">
        <Skeleton className="w-full h-32" />
        <Skeleton className="w-full h-64" />
      </div>
    </div>
  </Container>
);

const SocialIcon = ({ Icon }) => (
  <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all">
    <Icon size={16} />
  </button>
);

const ListItem = ({ text, href, subtext }) => {
  return (
    <li className="group cursor-pointer">
      <Link href={href || "#"} className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
          {text}
        </span>
        {subtext && (
          <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
            {subtext}
          </span>
        )}
      </Link>
    </li>
  );
};
