"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Avatar, Button, Divider, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin, TrendingUp, Layers, PlayCircle, ListVideo, CheckCircle2 } from "lucide-react";
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
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get("collection");

  // States
  const [article, setArticle] = useState(null);
  const [collection, setCollection] = useState(null);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [trendingCollections, setTrendingCollections] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  // Mobile Playlist Modal Disclosure
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    // 1. PRIORITY FETCH: Get the article first to unblock the main UI
    const fetchPrimaryArticle = async () => {
      try {
        const data = await ArticleService.getBySlug(slug);
        setArticle(data);
        
        // 2. SECONDARY FETCH: Once main article is loaded, fetch everything else in parallel
        fetchSecondaryData(data.id);
      } catch (error) {
        console.error("Failed to load article", error);
      } finally {
        setLoading(false);
      }
    };

    // Parallel background fetch for sidebar and playlist context
    const fetchSecondaryData = async (articleId) => {
      try {
        const promises = [
          ArticleService.getArticles({ sort: "trending", limit: 5 }),
          CollectionService.getPopular(5)
        ];

        // Only fetch collection details if the user came from a collection
        if (collectionSlug) {
          promises.push(CollectionService.getBySlug(collectionSlug));
        }

        // Wait for all secondary data to resolve
        const results = await Promise.all(promises);
        
        setTrendingArticles(results[0]?.articles || []);
        setTrendingCollections(results[1] || []);
        
        if (collectionSlug && results[2]) {
          setCollection(results[2]);
        }
      } catch (error) {
        console.error("Secondary data fetch failed", error);
      } finally {
        setSidebarLoading(false);
      }
    };

    fetchPrimaryArticle();
  }, [slug, collectionSlug]);

  if (loading) return <ArticleDetailSkeleton />;
  if (!article) return <div className="py-20 text-center font-serif text-2xl">Article not found.</div>;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Sub-component: Playlist UI used in both Desktop Sidebar and Mobile Modal
  const SeriesPlaylist = () => {
    if (!collection || !collection.articles) return null;
    
    // Find current article index to show "1 of 3"
    const currentIndex = collection.articles.findIndex(a => a.id === article.id);

    return (
      <div className="bg-surface-dark border border-border shadow-md">
        <div className="p-5 border-b border-border bg-foreground text-background">
          <p className="text-[10px] uppercase font-bold tracking-widest text-background/70 mb-1">Playing from Series</p>
          <h3 className="text-lg font-serif font-bold leading-tight line-clamp-2">{collection.name}</h3>
          <p className="text-xs mt-2 opacity-80">{currentIndex + 1} / {collection.articles.length} Articles</p>
        </div>
        <div className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar bg-card">
          {collection.articles.map((art, index) => {
            const isCurrent = art.id === article.id;
            return (
              <Link 
                key={art.id} 
                // Append collection parameter to persist playlist state on next page
                href={`/articles/${art.slug}?collection=${collection.slug}`}
                className={`flex gap-4 p-4 border-b border-border/50 transition-colors ${isCurrent ? 'bg-muted/50 pointer-events-none' : 'hover:bg-muted/30 group'}`}
              >
                <div className="shrink-0 pt-0.5">
                  {isCurrent ? (
                    <PlayCircle size={16} className="text-brand-blue" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-bold group-hover:text-foreground">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isCurrent ? 'text-brand-blue' : 'text-foreground group-hover:text-brand-blue'}`}>
                    {art.title}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 font-bold flex items-center gap-1">
                    {isCurrent ? "Now Reading" : `${art.views_count} Views`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <Container>
        <main className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">
          
          {/* LEFT COLUMN: Main Article Content */}
          <motion.div className="w-full lg:w-[65%]" initial="hidden" animate="visible">
            
            <motion.div variants={fadeIn} className="text-xs text-muted-foreground font-medium mb-6">
              Home / Blog / <span className="text-foreground">{article.title}</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-serif mb-8 leading-tight">
              {article.title}
            </motion.h1>

            {/* Author Metadata */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 text-xs text-muted-foreground">
              <Link href={`/authors/${encodeId(article.author_id)}`} className="flex items-center gap-3 group">
                <Avatar src={article.author_avatar} name={article.author_name} size="md" className="w-10 h-10 border border-border group-hover:border-brand-blue transition-colors" />
                <div>
                  <p className="text-sm text-foreground font-medium group-hover:text-brand-blue transition-colors">{article.author_name}</p>
                  <p>Editorial Contributor</p>
                </div>
              </Link>
              <div className="hidden sm:block w-px h-8 bg-border" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p>{dayjs(article.published_at).format("MMMM DD, YYYY")}</p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <p>Categories: {article.categories?.map((c) => c.name).join(", ")}</p>
                <div className="w-1 h-1 rounded-full bg-border" />
                <p>{article.views_count} Views</p>
              </div>
            </motion.div>

            {/* Optimized Cover Image Render */}
            <motion.div variants={fadeIn} className="mb-12">
              <Image
                priority={true} // HIGHEST PRIORITY FIX
                fetchPriority="high" // HIGHEST PRIORITY FIX
                width={900}
                height={600}
                alt={article.title}
                src={article.image_url}
                className="w-full h-auto max-h-[600px] object-cover bg-muted"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </motion.div>

            {/* Article Body */}
            <motion.article
              variants={fadeIn}
              className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed prose-h2:text-2xl prose-h2:font-bold prose-h2:font-serif prose-h2:text-foreground prose-strong:text-foreground prose-li:marker:text-brand-blue"
            >
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </motion.article>
          </motion.div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <motion.aside className="w-full lg:w-[35%] flex flex-col gap-10" initial="hidden" animate="visible">
            
            {/* DESKTOP ONLY: Series Playlist (Hides on Mobile, handled by FAB) */}
            {collection && !sidebarLoading && (
              // <motion.div variants={fadeIn} className="hidden lg:block sticky top-24 z-10">
                <SeriesPlaylist />
              // </motion.div>
            )}

            {/* Social Follow */}
            <motion.div variants={fadeIn} className={collection ? "lg:mt-6" : ""}>
              <h3 className="text-[10px] uppercase font-bold tracking-widest mb-4 opacity-60">Follow Us</h3>
              <div className="flex gap-3">
                <SocialIcon Icon={Twitter} />
                <SocialIcon Icon={Linkedin} />
                <SocialIcon Icon={Instagram} />
              </div>
            </motion.div>

            <Divider className="opacity-50" />

            {/* Summary Widget */}
            <motion.div variants={fadeIn} className="bg-card p-6 border border-border">
              <h3 className="text-[10px] uppercase font-bold tracking-widest mb-3 text-brand-blue">In Brief</h3>
              <p className="text-sm text-foreground/80 leading-relaxed italic">"{article.summary}"</p>
            </motion.div>

            {/* Trending Articles */}
            <motion.div variants={fadeIn}>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Trending Stories</h3>
              </div>
              <ul className="flex flex-col gap-5">
                {sidebarLoading
                  ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-none" />)
                  : trendingArticles.map((art) => (
                      <ListItem key={art.id} text={art.title} href={`/articles/${art.slug}`} />
                    ))}
              </ul>
            </motion.div>

            <Divider className="opacity-50" />

            {/* Trending Collections */}
            <motion.div variants={fadeIn}>
              <div className="flex items-center gap-2 mb-6">
                <Layers size={16} className="text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Popular Collections</h3>
              </div>
              <ul className="flex flex-col gap-5">
                {sidebarLoading
                  ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-none" />)
                  : trendingCollections.map((col) => (
                      <ListItem key={col.id} text={col.name} href={`/collections/${col.slug}`} subtext={`${col.articles_count} Articles`} />
                    ))}
              </ul>
            </motion.div>
          </motion.aside>
        </main>

        {article?.id && <ReviewSection articleId={article.id} articleAuthorId={article.author_id} />}
      </Container>
      
      <RelatedArticles currentArticleId={article.id} />

      {/* MOBILE ONLY: Floating Action Button for Series Playlist */}
      {collection && !sidebarLoading && (
        <>
          <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center lg:hidden pointer-events-none">
            <Button 
              onPress={onOpen}
              className="pointer-events-auto bg-foreground text-background font-bold tracking-widest uppercase text-[10px] shadow-2xl border-2 border-background px-6 h-12"
              radius="full"
              startContent={<ListVideo size={16} />}
            >
              View Series Context
            </Button>
          </div>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="bottom" classNames={{ base: "m-0 rounded-b-none sm:m-auto sm:rounded-lg" }}>
            <ModalContent>
              <ModalBody className="p-0">
                 <SeriesPlaylist />
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}

// Sub-components
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
        <Skeleton className="w-full h-[300px] border border-border" /> {/* Playlist Placeholder */}
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

const ListItem = ({ text, href, subtext }) => (
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