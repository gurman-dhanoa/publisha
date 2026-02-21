"use client";
import React, { useEffect, useState } from "react";
import AuthorService from "@/services/author.service";
import { AuthorCard, AuthorSkeleton } from "@/components/shared/Author";
import Container from "@/components/shared/Container";
import { Button } from "@heroui/react";

export default function AuthorsSection() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await AuthorService.getTrending(3);
        setAuthors(data);
      } catch (error) {
        console.error("Authors fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <section className="py-24">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Brilliant Minds</h2>
          <p className="text-muted-foreground text-lg">Meet the experts and storytellers shaping the conversation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => <AuthorSkeleton key={i} />)
          ) : (
            authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))
          )}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Button
            variant="bordered" 
            radius="none"
            className="border-foreground text-foreground font-bold text-xs uppercase tracking-widest px-10 hover:bg-foreground hover:text-background transition-all h-12"
          >
            View Directory
          </Button>
        </div>
      </Container>
    </section>
  );
}