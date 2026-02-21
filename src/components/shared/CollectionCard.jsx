"use client";
import React from "react";
import { Card, Image, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Play } from "lucide-react"; // Using Play icon to mimic the playlist feel
import Link from "next/link";

export const CollectionCard = ({ collection }) => {
  const articles = collection.preview_articles || [];

  // We'll show up to 3 layers (1 front + 2 back)
  const displayArticles = articles.slice(0, 3);

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      className="group cursor-pointer w-full max-w-[400px]"
    >
      <Link href={`/collections/${collection.slug}`}>
        {/* THE STACK CONTAINER */}
        <div className="relative h-[240px] w-full mb-4">
          {/* Layer 3 (Deepest) */}
          {displayArticles[2] && (
            <div className="absolute top-[-12px] left-[10%] right-[10%] h-full z-0 opacity-40 group-hover:top-[-16px] transition-all duration-300">
              <div className="w-full h-full bg-muted border border-border overflow-hidden">
                <Image
                  width={600}
                  height={500}
                  src={displayArticles[2].image_url}
                  className="w-full h-full object-cover blur-[1px]"
                  alt="stack-3"
                />
              </div>
            </div>
          )}

          {/* Layer 2 (Middle) */}
          {displayArticles[1] && (
            <div className="absolute top-[-6px] left-[5%] right-[5%] h-full z-10 opacity-70 group-hover:top-[-8px] transition-all duration-300">
              <div className="w-full h-full bg-muted border border-border overflow-hidden">
                <Image
                  width={600}
                  height={500}
                  src={displayArticles[1].image_url}
                  className="w-full h-full object-cover"
                  alt="stack-2"
                />
              </div>
            </div>
          )}

          {/* Layer 1 (Front - Main Cover) */}
          <Card
          radius="lg"
            className="relative z-20 w-full h-full overflow-hidden"
          >
            <Image
              height={500}
              width={600}
              alt={collection.name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              src={
                displayArticles[0]?.image_url ||
                "https://via.placeholder.com/400x240"
              }
            />

            {/* OVERLAY: Bottom Bar showing total articles (YouTube Style) */}
            {/* <div className="absolute bottom-0 right-0 left-0 bg-black/70 backdrop-blur-md p-3 flex justify-between items-center z-30">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                <Play size={14} fill="white" />
                <span>View Collection</span>
              </div>
              <span className="text-white/80 text-xs font-medium">
                {collection.articles_count} Articles
              </span>
            </div> */}
          </Card>
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-brand-blue transition-colors uppercase tracking-wide line-clamp-1">
            {collection.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">
              Curated by {collection.author_name}
            </p>
            <p className="text-[10px] text-brand-blue font-bold uppercase">
              {collection.total_collection_views} Views
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const CollectionSkeleton = () => (
  <div className="w-full max-w-[400px] space-y-4">
    {/* Stacked Skeleton */}
    <div className="relative h-[240px] w-full">
       <Skeleton className="absolute top-[-12px] left-[10%] right-[10%] h-full rounded-none opacity-20" />
       <Skeleton className="absolute top-[-6px] left-[5%] right-[5%] h-full rounded-none opacity-40" />
       <Skeleton className="relative z-20 w-full h-full rounded-none" />
    </div>
    <div className="space-y-2">
      <Skeleton className="w-3/4 h-5 rounded-none" />
      <div className="flex justify-between">
        <Skeleton className="w-1/3 h-3 rounded-none" />
        <Skeleton className="w-1/4 h-3 rounded-none" />
      </div>
    </div>
  </div>
);