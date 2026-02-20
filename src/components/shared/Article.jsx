"use client";

import React from "react";
import { Card, CardBody, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Bookmark, Send } from "lucide-react";
import Link from "next/link";

// --- VERTICAL CARD ---
export const VerticalArticleCard = ({ article }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full h-full max-w-[400px]"
    >
      <Card
        shadow="sm"
        radius="none"
        className="bg-card border border-border overflow-hidden h-full flex flex-col"
      >
        <Link
          href={"/articles/slug"}
        >
          <Image
            removeWrapper
            alt={article.title}
            className="w-full h-[240px] object-cover rounded-none"
            src={article.image}
          />
        </Link>
        <CardBody className="p-6 flex flex-col gap-4 flex-grow">
          {/* Author */}
          <Link href={"/authors/slug"} className="text-sm text-muted-foreground font-medium">
            {article.author}
          </Link>

          {/* Title & Excerpt */}
          <Link href={"/articles/slug"} className="flex flex-col gap-3 flex-grow">
            <h3 className="text-lg font-serif font-bold text-foreground tracking-wide uppercase leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 font-medium">
            {article.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-6 mt-4 text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <MessageCircle strokeWidth={1.5} size={20} />
              <span className="text-sm">{article.commentsCount}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-danger transition-colors">
              <Heart strokeWidth={1.5} size={20} />
              <span className="text-sm">{article.likesCount}</span>
            </button>
            <div className="flex-grow" />
            <button className="hover:text-foreground transition-colors">
              <Bookmark strokeWidth={1.5} size={20} />
            </button>
            <button className="hover:text-foreground transition-colors">
              <Send strokeWidth={1.5} size={20} />
            </button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

// --- HORIZONTAL CARD ---
export const HorizontalArticleCard = ({ article }) => {
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
        <Link href={"/articles/slug"} className="w-full md:w-5/12 shrink-0">
          <Image
            removeWrapper
            alt={article.title}
            className="w-full h-full min-h-[250px] object-cover rounded-none"
            src={article.image}
          />
        </Link>

        {/* Content Section */}
        <CardBody className="w-full p-8 flex flex-col justify-between gap-6">
          <Link href={"/articles/slug"} className="flex flex-col gap-4">
            <h3 className="text-xl font-serif font-bold text-foreground tracking-wide uppercase">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {article.excerpt}
            </p>
          </Link>

          <div className="flex flex-col gap-6 mt-2">
            {/* Tags & Author */}
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="flex gap-3 text-muted-foreground text-xs">
                {article.tags.map((tag, index) => (
                  <span key={index}>#{tag}</span>
                ))}
              </div>
              <Link href={"/authors/slug"} className="text-muted-foreground">{article.author}</Link>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-6 text-muted-foreground">
              <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                <MessageCircle strokeWidth={1.5} size={20} />
                <span className="text-sm">{article.commentsCount}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-danger transition-colors">
                <Heart strokeWidth={1.5} size={20} />
                <span className="text-sm">{article.likesCount}</span>
              </button>
              <button className="hover:text-foreground transition-colors ml-2">
                <Bookmark strokeWidth={1.5} size={20} />
              </button>
              <button className="hover:text-foreground transition-colors ml-2">
                <Send strokeWidth={1.5} size={20} />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};