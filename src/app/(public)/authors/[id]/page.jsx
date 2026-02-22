// @/app/authors/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Tabs, Tab, Image, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Twitter, Github, BookOpen, Users, FolderHeart, Clock, TrendingUp } from "lucide-react";

import Container from "@/components/shared/Container";
import AuthorArticles from "@/components/author/AuthorArticles";
import AuthorCollections from "@/components/author/AuthorCollections";
import AuthorService from "@/services/author.service";
import { decodeId } from "@/lib/hashids";

// Helper for large numbers (e.g., 13100 -> 13.1K)
const formatStat = (num) => num > 999 ? (num / 1000).toFixed(1) + 'K' : num;

export default function AuthorProfilePage() {
  const params = useParams();
  const realAuthorId = decodeId(params.id);

  const [author, setAuthor] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!realAuthorId) return;

    const fetchAuthorData = async () => {
      try {
        const [authorData, statsData] = await Promise.all([
          AuthorService.getById(realAuthorId),
          AuthorService.getStats(realAuthorId)
        ]);
        setAuthor(authorData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [realAuthorId]);

  if (!realAuthorId) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl">Profile Not Found</div>;
  if (loading) return <ProfileSkeleton />;

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint">
      
      {/* 1. COVER IMAGE & PROFILE HEADER */}
      <section className="relative">
        <div className="w-full h-[250px] md:h-[320px] bg-surface-dark overflow-hidden border-b border-border">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--brand-blue)_0%,_transparent_70%)] opacity-20" />
        </div>

        <Container className="relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row gap-6 md:gap-10 -mt-16 md:-mt-20 relative z-10 items-center md:items-start text-center md:text-left">
            
            <div className="rounded-full p-2 bg-background shadow-sm shrink-0">
              <Avatar src={author.avatar_url} name={author.name} className="w-32 h-32 md:w-40 md:h-40 text-4xl font-bold bg-foreground text-background ring-4 ring-background" />
            </div>

            <div className="flex-1 pt-2 md:pt-24 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-serif font-bold text-foreground mb-2">{author.name}</h1>
                <p className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><LinkIcon size={14} className="text-brand-blue" /> @{author.name.replace(/\s+/g, '').toLowerCase()}</span>
                  <span className="flex items-center gap-3 ml-2">
                    <Twitter size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                    <Github size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                  </span>
                </p>

                {/* API Driven Categories */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {author.preferred_categories?.map((cat) => (
                    <span key={cat.id} className="px-3 py-1 bg-card border border-border text-[10px] font-bold tracking-widest text-muted-foreground rounded-full uppercase">
                      {cat.name}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                  {author.bio || `A valued contributor to the Publisha collective, writing primarily about ${author.preferred_categories?.[0]?.name || 'various topics'}.`}
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[160px] shrink-0">
                <Button radius="full" className="bg-foreground text-background font-bold tracking-widest uppercase text-xs h-12 shadow-md">Follow</Button>
                <Button radius="full" variant="bordered" className="border-border text-foreground font-bold tracking-widest uppercase text-xs h-12 hover:bg-card">Message</Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. STATS BAR */}
      <Container className="mt-12 mb-16">
        <div className="flex flex-wrap items-center justify-center md:justify-between md:max-w-3xl md:mx-auto gap-12 py-8 border-y border-border/60">
          <Stat icon={<BookOpen size={18} />} value={formatStat(stats?.published_articles || 0)} label="Articles" />
          {/* Mock followers since API doesn't return it yet, but fits the design */}
          <Stat icon={<Users size={18} />} value={formatStat(stats?.total_likes || 0)} label="Likes" />
          <Stat icon={<TrendingUp size={18} />} value={formatStat(stats?.total_views || 0)} label="Total Views" />
        </div>
      </Container>

      {/* 3. CONTENT TABS */}
      <Container>
        <Tabs 
          aria-label="Author Content" 
          variant="underlined"
          classNames={{
            tabList: "gap-8 w-full relative rounded-none p-0 border-b border-border",
            cursor: "w-full bg-foreground",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-foreground text-muted-foreground font-serif text-lg"
          }}
        >
          <Tab key="latest" title={<div className="flex items-center space-x-2"><Clock size={16} /><span>Latest Work</span></div>}>
            {/* The infinite scroll logic is safely contained inside this component */}
            <AuthorArticles authorId={realAuthorId} />
          </Tab>
          <Tab key="collections" title={<div className="flex items-center space-x-2"><FolderHeart size={16} /><span>Collections</span></div>}>
             {/* The collection fetching logic is safely contained inside this component */}
            <AuthorCollections authorId={realAuthorId} />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const Stat = ({ icon, value, label }) => (
  <div className="flex items-center gap-3">
    <div className="text-brand-blue">{icon}</div>
    <div>
      <p className="text-2xl font-serif font-bold text-foreground leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{label}</p>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="w-full h-[320px] bg-muted animate-pulse" />
    <Container className="relative -mt-20">
      <div className="flex gap-10">
        <Skeleton className="w-40 h-40 rounded-full" />
        <div className="flex-1 pt-24 space-y-4">
          <Skeleton className="w-1/3 h-10" />
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </Container>
  </div>
);