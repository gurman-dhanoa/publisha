"use client";
import React from "react";
import { Card, CardBody, Avatar, Skeleton, Button } from "@heroui/react";
import Link from "next/link";
import { encodeId } from "@/lib/hashids";
import { formatCompactNumber } from "@/lib/utils";

export const AuthorCard = ({ author }) => {
  return (
    <Card 
      as={Link} 
      href={`/authors/${encodeId(author.id)}`} 
      shadow="sm" 
      radius="none"
      className="bg-card border border-border h-full flex flex-col group hover:border-foreground/30 transition-all duration-300"
    >
      <CardBody className="p-8 flex flex-col items-center text-center flex-grow">
        {/* Avatar with initials fallback */}
        <Avatar 
          src={author.avatar_url} 
          name={author.name}
          className="w-24 h-24 mb-6 text-xl font-bold bg-foreground text-background" 
        />
        
        <h4 className="font-serif font-bold text-xl text-foreground mb-1 group-hover:text-brand-blue transition-colors">
          {author.name}
        </h4>
        
        {/* Role/Bio - Handling null bios */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue mb-4">
          Contributor
        </p>
        
        <p className="text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-3 mb-8">
          {author.bio || "An insightful contributor to the Publisha collective, sharing deep dives into complex narratives."}
        </p>
        
        {/* Stats Section */}
        <div className="w-full flex justify-center gap-8 pt-6 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-lg leading-none">
              {author.total_articles}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
              Articles
            </span>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-lg leading-none">
              {formatCompactNumber(author.total_likes || 0)}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
              Likes
            </span>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-lg leading-none">
              {formatCompactNumber(author.total_views || 0)}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
              Views
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const AuthorSkeleton = () => (
  <Card radius="none" shadow="sm" className="bg-card border border-border h-[400px]">
    <CardBody className="p-8 flex flex-col items-center">
      <Skeleton className="w-24 h-24 rounded-full mb-6" />
      <Skeleton className="w-3/4 h-6 mb-4" />
      <Skeleton className="w-1/2 h-3 mb-8" />
      <div className="w-full space-y-3 mb-8">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-5/6 h-3 mx-auto" />
      </div>
      <div className="w-full flex justify-around pt-6 border-t border-border">
        <Skeleton className="w-12 h-8" />
        <Skeleton className="w-12 h-8" />
      </div>
    </CardBody>
  </Card>
);