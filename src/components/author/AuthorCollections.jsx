// @/components/author/AuthorCollections.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Image, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import CollectionService from "@/services/collection.service";
import { CollectionCard } from "../shared/CollectionCard";

export default function AuthorCollections({ authorId }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await CollectionService.getByAuthor(authorId);
        setCollections(res);
      } catch (err) {
        console.error("Failed to load collections", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [authorId]);

  if (loading) return <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-32 rounded-xl"/><Skeleton className="h-32 rounded-xl"/></div>;
  if (collections.length === 0) return <div className="py-20 text-center text-muted-foreground italic font-serif">No collections curated yet.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {collections.map((col,index) => (
        // <Card key={col.id} as={Link} href={`/collections/${col.slug}`} shadow="none" className="border border-border bg-card rounded-xl overflow-hidden group cursor-pointer hover:border-brand-blue/30 transition-all">
        //   <CardBody className="p-0 flex flex-row h-32">
        //     <div className="w-1/3 h-full overflow-hidden bg-muted">
        //        {/* Using a placeholder since author-collections API doesn't return an image */}
        //       <Image removeWrapper alt={col.name} src={`https://via.placeholder.com/400x300?text=${col.name.charAt(0)}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
        //     </div>
        //     <div className="w-2/3 p-6 flex flex-col justify-center">
        //       <h3 className="font-serif font-bold text-lg text-foreground mb-2 leading-snug line-clamp-2">{col.name}</h3>
        //       <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        //         <BookOpen size={12} className="text-brand-blue" /> {col.articles_count} Articles
        //       </p>
        //     </div>
        //   </CardBody>
        // </Card>
        <CollectionCard key={index} collection={col} />
      ))}
    </motion.div>
  );
}