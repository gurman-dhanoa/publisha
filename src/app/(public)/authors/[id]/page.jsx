// @/app/authors/[id]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Tabs, Tab, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Link as LinkIcon, Twitter, Github, BookOpen, Users, FolderHeart, Clock, TrendingUp, Star } from "lucide-react";

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
  
  // --- NEW: Manual Tab State ---
  const [activeTab, setActiveTab] = useState("latest");

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
                <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{author.name}</h1>
                {/* <p className="text-muted-foreground mb-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><LinkIcon size={14} className="text-brand-blue" /> @{author.name.replace(/\s+/g, '').toLowerCase()}</span>
                  <span className="flex items-center gap-3 ml-2">
                    <Twitter size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                    <Github size={16} className="hover:text-brand-blue cursor-pointer transition-colors" />
                  </span>
                </p> */}

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

              {/* <div className="flex flex-col gap-3 min-w-[160px] shrink-0">
                <Button radius="full" className="bg-foreground text-background font-bold tracking-widest uppercase text-xs h-12 shadow-md">Follow</Button>
                <Button radius="full" variant="bordered" className="border-border text-foreground font-bold tracking-widest uppercase text-xs h-12 hover:bg-card">Message</Button>
              </div> */}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. STATS BAR */}
      <Container className="mt-12 mb-16">
        <div className="flex flex-wrap items-center justify-center md:justify-between md:max-w-3xl md:mx-auto gap-12 py-8 border-y border-border/60">
          <div className="flex items-center gap-2"><BookOpen size={18} /> <span className="font-bold">{formatStat(stats?.published_articles || 0)}</span> <span className="text-muted-foreground">Articles</span></div>
          <div className="flex items-center gap-2"><Users size={18} /> <span className="font-bold">{formatStat(stats?.total_likes || 0)}</span> <span className="text-muted-foreground">Likes</span></div>
          <div className="flex items-center gap-2"><TrendingUp size={18} /> <span className="font-bold">{formatStat(stats?.total_views || 0)}</span> <span className="text-muted-foreground">Total Views</span></div>
          <div className="flex items-center gap-2"><Star size={18} /> <span className="font-bold">{formatStat(stats?.avg_rating || 0)}</span> <span className="text-muted-foreground">Avg. Rating</span></div>
        </div>
      </Container>

      {/* 3. CONTENT TABS */}
      <Container>
        {/* We use Tabs just for the UI, not for rendering the children panels */}
        <Tabs 
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          aria-label="Author Content" 
          variant="underlined"
          classNames={{
            tabList: "gap-8 w-full relative rounded-none p-0 border-b border-border",
            cursor: "w-full bg-foreground",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-foreground text-muted-foreground font-serif text-lg"
          }}
        >
          <Tab key="latest" title={<div className="flex items-center space-x-2"><Clock size={16} /><span>Latest Work</span></div>} />
          <Tab key="collections" title={<div className="flex items-center space-x-2"><FolderHeart size={16} /><span>Collections</span></div>} />
        </Tabs>

        {/* --- STATE-PRESERVING MOUNT AREA --- */}
        <div className="mt-6">
          <div className={activeTab === "latest" ? "block" : "hidden"}>
            <AuthorArticles authorId={realAuthorId} />
          </div>
          
          <div className={activeTab === "collections" ? "block" : "hidden"}>
            <AuthorCollections authorId={realAuthorId} />
          </div>
        </div>
        
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

// --- SKELETON COMPONENT ---
const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* 1. Cover Skeleton */}
      <Skeleton className="w-full h-[250px] md:h-[320px] rounded-none" />

      <Container className="relative">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 -mt-16 md:-mt-20 relative z-10 items-center md:items-start text-center md:text-left">
          
          {/* Avatar Skeleton */}
          <div className="rounded-full p-2 bg-background shrink-0">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
          </div>

          <div className="flex-1 pt-2 md:pt-24 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 w-full">
            
            {/* Info Block Skeleton */}
            <div className="max-w-2xl w-full flex flex-col items-center md:items-start">
              <Skeleton className="w-64 h-10 mb-4 rounded-lg" />
              <Skeleton className="w-48 h-5 mb-6 rounded-lg" />
              
              {/* Category Chips */}
              <div className="flex gap-2 mb-6">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>

              {/* Bio */}
              <Skeleton className="w-full max-w-xl h-4 mb-2 rounded-lg" />
              <Skeleton className="w-3/4 max-w-xl h-4 mb-6 rounded-lg" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col gap-3 shrink-0 w-[160px]">
              <Skeleton className="w-full h-12 rounded-full" />
              <Skeleton className="w-full h-12 rounded-full" />
            </div>
          </div>
        </div>
      </Container>

      {/* 2. Stats Bar Skeleton */}
      <Container className="mt-12 mb-16">
        <div className="flex flex-wrap items-center justify-center md:justify-between md:max-w-3xl md:mx-auto gap-12 py-8 border-y border-border/60">
          <Skeleton className="w-24 h-6 rounded-lg" />
          <Skeleton className="w-24 h-6 rounded-lg" />
          <Skeleton className="w-32 h-6 rounded-lg" />
        </div>
      </Container>

      {/* 3. Tabs & Content Placeholder Skeleton */}
      <Container>
        {/* Tabs */}
        <div className="flex gap-8 border-b border-border pb-4 mb-10">
          <Skeleton className="w-32 h-8 rounded-lg" />
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
        
        {/* Content Area - Using the responsive Grid trick we used earlier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <div className="block"><Skeleton className="w-full h-[400px] rounded-2xl" /></div>
          <div className="hidden md:block"><Skeleton className="w-full h-[400px] rounded-2xl" /></div>
          <div className="hidden lg:block"><Skeleton className="w-full h-[400px] rounded-2xl" /></div>
        </div>
      </Container>
    </div>
  );
};