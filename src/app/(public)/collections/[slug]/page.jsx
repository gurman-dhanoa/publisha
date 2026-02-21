"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Image, Divider, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, Clock, Share2, BookmarkPlus, BookOpen } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

import Container from "@/components/shared/Container";
import { VerticalArticleCard, HorizontalArticleCard } from "@/components/shared/Article";
import CollectionService from "@/services/collection.service";

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await CollectionService.getBySlug(slug);
        setCollection(data);
      } catch (error) {
        console.error("Failed to load collection", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [slug]);

  if (loading) return <CollectionDetailSkeleton />;
  if (!collection) return <div className="py-20 text-center">Collection not found.</div>;

  const firstArticle = collection.articles?.[0];
  const otherArticles = collection.articles?.slice(1) || [];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* 1. HEADER SECTION */}
      <section className="pt-10 pb-16 bg-card border-b border-border">
        <Container>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} />
              Back to Explore
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full lg:w-1/2">
              <motion.div variants={fadeUp} className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest mb-4">
                <FolderOpen size={16} />
                <span>Curated Series</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-serif font-bold leading-[1.15] mb-6">
                {collection.name}
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
                {collection.description || "A deep dive into the complexities of " + collection.name}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-3">
                  <Avatar name={collection.author_name} className="w-10 h-10 border border-border" />
                  <div>
                    <p className="text-foreground font-medium">By {collection.author_name}</p>
                    <p className="text-xs uppercase tracking-tighter">Collection Lead</p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-border" />
                <div className="flex items-center gap-4 font-medium">
                  <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-brand-blue" /> {collection.articles_count} Articles</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-brand-blue" /> {dayjs(collection.updated_at).format('MMM YYYY')}</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex gap-4">
                <Button as={Link} href={`/articles/${firstArticle?.slug}`} size="lg" radius="none" className="bg-foreground text-background font-bold tracking-widest uppercase text-xs px-8 h-14">
                  Start Reading
                </Button>
                <Button isIconOnly radius="none" variant="bordered" className="border-border h-14 w-14"><Share2 size={20} /></Button>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full lg:w-1/2">
               <Image removeWrapper alt={collection.name} src={firstArticle?.image_url} className="w-full aspect-[4/3] object-cover border border-border" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 2. ARTICLES ROADMAP */}
      <section className="py-20">
        <Container>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-serif font-bold text-foreground">Series Roadmap</h2>
            <Divider className="flex-1 bg-border/60" />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col gap-16">
            {firstArticle && (
              <motion.div variants={fadeUp} className="relative">
                <div className="mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-2 py-1 bg-brand-mint/20 rounded-md">Sequence 01 / Introduction</span>
                </div>
                <HorizontalArticleCard article={firstArticle} />
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-border/60">
              {otherArticles.map((article, index) => (
                <motion.div key={article.id} variants={fadeUp} className="flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l-2 border-brand-mint">
                    Sequence 0{index + 2}
                  </span>
                  <VerticalArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

// --- Skeleton for Loading State ---
const CollectionDetailSkeleton = () => (
  <Container className="py-20 space-y-12">
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 space-y-6">
        <Skeleton className="w-1/4 h-4" />
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-full h-32" />
        <div className="flex gap-4"><Skeleton className="w-12 h-12 rounded-full"/><Skeleton className="w-1/2 h-12"/></div>
      </div>
      <Skeleton className="flex-1 aspect-[4/3]" />
    </div>
    <div className="space-y-8">
      <Skeleton className="w-1/3 h-8" />
      <Skeleton className="w-full h-64" />
    </div>
  </Container>
);