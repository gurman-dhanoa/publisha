"use client";
import React, { useEffect, useState } from "react";
import CollectionService from "@/services/collection.service";
import Container from "@/components/shared/Container";
import { CollectionCard, CollectionSkeleton } from "@/components/shared/CollectionCard";

export default function CollectionsSection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await CollectionService.getPopular(3);
        setCollections(data);
      } catch (error) {
        console.error("Collections fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <section className="py-24 bg-card border-y border-border">
      <Container>
        <div className="text-center mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4 block">Deep Dives</span>
          <h2 className="text-4xl font-serif font-bold text-foreground">Curated Collections</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Explore comprehensive series grouped by topic, from full-stack architecture to cultural deep dives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            [1, 2, 3].map((i) => <CollectionSkeleton key={i} />)
          ) : (
            collections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
}