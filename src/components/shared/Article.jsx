"use client";

import React from "react";
import { Card, CardBody, Image, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Bookmark, Send } from "lucide-react";
import Link from "next/link";

// --- VERTICAL CARD ---
export const VerticalArticleCard = ({ article }) => {
  return (
    <motion.div whileHover={{ y: -4 }} className="w-full h-full max-w-[400px]">
      <Card shadow="sm" radius="none" className="bg-card border border-border h-full flex flex-col">
        <Link href={`/articles/${article.slug}`}>
          <Image
            removeWrapper
            alt={article.title}
            className="w-full h-[240px] object-cover rounded-none"
            src={article.image_url || "https://via.placeholder.com/400x240?text=No+Image"}
          />
        </Link>
        <CardBody className="p-6 flex flex-col gap-4 flex-grow">
          <Link href={`/authors/${article.author_id}`} className="text-sm text-muted-foreground font-medium">
            {article.author_name}
          </Link>

          <Link href={`/articles/${article.slug}`} className="flex flex-col gap-3 flex-grow">
            <h3 className="text-lg font-serif font-bold text-foreground tracking-wide uppercase leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          </Link>

          {/* Categories mapped from API */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 font-medium">
            {article.categories?.map((cat) => (
              <span key={cat.id} className="hover:text-brand-blue cursor-pointer">#{cat.slug}</span>
            ))}
          </div>

          {/* Actions - Using real API counts */}
          <div className="flex items-center gap-6 mt-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle strokeWidth={1.5} size={20} />
              <span className="text-sm">{article.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart strokeWidth={1.5} size={20} />
              <span className="text-sm">{article.likes_count || 0}</span>
            </div>
            <div className="flex-grow" />
            <Bookmark strokeWidth={1.5} size={20} className="cursor-pointer" />
            <Send strokeWidth={1.5} size={20} className="cursor-pointer" />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// --- HORIZONTAL CARD ---
// --- HORIZONTAL CARD (Updated for API consistency) ---
export const HorizontalArticleCard = ({ article }) => {
  if (!article) return null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full"
    >
      <Card
        shadow="sm"
        radius="none"
        className="flex flex-col md:flex-row bg-card border border-border overflow-hidden"
      >
        {/* Image Section */}
        <Link href={`/articles/${article.slug}`} className="w-full md:w-5/12 shrink-0">
          <Image
            removeWrapper
            alt={article.title}
            className="w-full h-full min-h-[300px] md:min-h-[400px] object-cover rounded-none"
            src={article.image_url || "https://via.placeholder.com/600x400?text=Publisha+Editorial"}
          />
        </Link>

        {/* Content Section */}
        <CardBody className="w-full p-8 md:p-12 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <Link href={`/articles/${article.slug}`} className="flex flex-col gap-4">
              {/* Badge for the first category */}
              {article.categories?.[0] && (
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-blue">
                  {article.categories[0].name}
                </span>
              )}
              
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-wide uppercase leading-tight">
                {article.title}
              </h3>
              
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </Link>

            {/* Tags & Author Info */}
            <div className="flex justify-between items-center py-4 border-y border-border/50">
              <div className="flex gap-3 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                {article.categories?.map((cat) => (
                  <span key={cat.id} className="hover:text-foreground cursor-pointer transition-colors">
                    #{cat.slug}
                  </span>
                ))}
              </div>
              <Link 
                href={`/authors/${article.author_id}`} 
                className="text-xs font-bold uppercase tracking-widest hover:text-brand-blue transition-colors"
              >
                By {article.author_name}
              </Link>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2 group cursor-default">
              <MessageCircle strokeWidth={1.5} size={22} className="group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium">{article.views_count || 0}</span>
            </div>
            
            <button className="flex items-center gap-2 group hover:text-danger transition-colors">
              <Heart strokeWidth={1.5} size={22} className="group-hover:fill-danger/10" />
              <span className="text-sm font-medium">{article.likes_count || 0}</span>
            </button>

            <div className="flex-grow" />

            <div className="flex items-center gap-4">
              <button className="hover:text-foreground transition-all active:scale-90">
                <Bookmark strokeWidth={1.5} size={22} />
              </button>
              <button className="hover:text-foreground transition-all active:scale-90">
                <Send strokeWidth={1.5} size={22} />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export const HorizontalCardSkeleton = () => {
  return (
    <Card shadow="sm" radius="none" className="w-full flex flex-col md:flex-row bg-card border border-border overflow-hidden">
      {/* Image Section */}
      <Skeleton className="w-full md:w-5/12 h-[300px] md:min-h-[400px] rounded-none" />

      {/* Content Section */}
      <CardBody className="w-full p-8 md:p-12 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {/* Category Badge */}
            <Skeleton className="w-24 h-3 rounded-full" />
            
            {/* Massive Title lines */}
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-3/4 h-10 rounded-md" />
            
            {/* Summary lines */}
            <div className="space-y-3 mt-2">
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-full h-4 rounded-full" />
              <Skeleton className="w-1/2 h-4 rounded-full" />
            </div>
          </div>

          {/* Author/Tags Bordered Section */}
          <div className="flex justify-between items-center py-4 border-y border-border/50">
            <div className="flex gap-3">
              <Skeleton className="w-16 h-3 rounded-full" />
              <Skeleton className="w-16 h-3 rounded-full" />
            </div>
            <Skeleton className="w-24 h-3 rounded-full" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-8">
          <Skeleton className="w-12 h-6 rounded-md" />
          <Skeleton className="w-12 h-6 rounded-md" />
          <div className="flex-grow" />
          <div className="flex gap-4">
            <Skeleton className="w-6 h-6 rounded-md" />
            <Skeleton className="w-6 h-6 rounded-md" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const VerticalCardSkeleton = () => {
  return (
    <Card shadow="sm" radius="none" className="w-full max-w-[400px] bg-card border border-border h-full flex flex-col">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-[240px] rounded-none" />
      
      <CardBody className="p-6 flex flex-col gap-4 flex-grow">
        {/* Author line */}
        <Skeleton className="w-1/3 h-3 rounded-full" />
        
        {/* Title and Summary lines */}
        <div className="flex flex-col gap-3 flex-grow">
          <Skeleton className="w-full h-6 rounded-md" />
          <Skeleton className="w-5/6 h-6 rounded-md" />
          <div className="space-y-2 mt-2">
            <Skeleton className="w-full h-3 rounded-full" />
            <Skeleton className="w-full h-3 rounded-full" />
            <Skeleton className="w-2/3 h-3 rounded-full" />
          </div>
        </div>

        {/* Categories/Tags */}
        <div className="flex gap-3 mt-2">
          <Skeleton className="w-12 h-3 rounded-full" />
          <Skeleton className="w-12 h-3 rounded-full" />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-6 mt-4">
          <Skeleton className="w-8 h-5 rounded-md" />
          <Skeleton className="w-8 h-5 rounded-md" />
          <div className="flex-grow" />
          <Skeleton className="w-5 h-5 rounded-md" />
          <Skeleton className="w-5 h-5 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
};