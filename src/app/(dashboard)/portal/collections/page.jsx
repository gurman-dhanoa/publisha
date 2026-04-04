"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, Pagination, Spinner } from "@heroui/react";
import { Plus, Edit3, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";
import { encodeId } from "@/lib/hashids";

export default function CollectionsPage() {
  const { user } = useAuth();
  
  const [collections, setCollections] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      AuthorService.getCollections(user.id, { page, limit: 10 })
        .then(data => {
          setCollections(data.collections || []);
          setPaginationInfo(data.pagination || { page: 1, pages: 1 });
        })
        .catch(err => console.error("Collections fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [user, page]);

  // Framer motion variants for a cascading entrance effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-border/50 pb-6">
        <div>
          <h3 className="text-3xl font-serif font-bold text-foreground">Your Series</h3>
          <p className="text-sm text-muted-foreground mt-2">Manage and curate your thematic article collections.</p>
        </div>
        <Button 
          size="md" 
          radius="full" 
          className="bg-foreground text-background font-bold text-xs uppercase tracking-widest shadow-md transition-transform hover:scale-105"
          startContent={<Plus size={16}/>} 
        >
          New Series
        </Button>
      </div>

      {/* CONTENT SECTION */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground animate-pulse">Loading Collections</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-2xl bg-card">
          <Layers size={40} className="text-muted-foreground/40 mb-4" />
          <h4 className="text-xl font-serif font-bold text-foreground mb-2">No Series Yet</h4>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">Group your articles into cohesive collections to keep your readers engaged.</p>
          <Button variant="bordered" className="border-border uppercase font-bold text-xs tracking-widest">
            Create your first series
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* GRID OF CARDS */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {collections.map((col) => (
              <motion.div key={col.id} variants={itemVariants} className="group relative w-full h-full">
                
                {/* INVISIBLE LINK LAYER (Covers the whole card to handle redirection to detail page) */}
                <Link 
                  href={`/collections/${col.slug}`} 
                  className="absolute inset-0 z-10"
                  aria-label={`View ${col.name}`}
                />

                <Card className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:border-brand-blue/30">
                  
                  {/* TOP: COVER IMAGE */}
                  <div className="relative w-full h-52 overflow-hidden bg-muted">
                    <Image 
                      src={col.cover_image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"} 
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      unoptimized // Optional: Remove if using configured domains in next.config.js
                    />
                    {/* Dark Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/10">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-foreground flex items-center gap-1.5">
                        <Layers size={12} className="text-brand-blue" />
                        {col.articles_count} Articles
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM: CONTENT */}
                  <CardBody className="p-6 flex flex-col flex-grow bg-card">
                    <h4 className="font-serif font-bold text-xl text-foreground mb-3 line-clamp-1 group-hover:text-brand-blue transition-colors">
                      {col.name}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {col.description || "No description provided for this collection."}
                    </p>
                    <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                       <span>Updated</span>
                       <span>{new Date(col.updated_at).toLocaleDateString()}</span>
                    </div>
                  </CardBody>
                </Card>

                {/* ABSOLUTE EDIT BUTTON (Appears on Hover, sits ABOVE the invisible link) */}
                <div className="absolute top-4 right-4 z-20 opacity-0 transform translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    as={Link} 
                    href={`/portal/collections/edit/${encodeId(col.id)}`} // Redirects to edit screen
                    isIconOnly 
                    className="bg-background/90 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
                    radius="full"
                    title="Edit Series"
                  >
                    <Edit3 size={16} />
                  </Button>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
          
          {/* PAGINATION */}
          {paginationInfo.pages > 1 && (
            <div className="flex justify-center mt-8 pt-8 border-t border-border/50">
              <Pagination 
                total={paginationInfo.pages} 
                page={page} 
                onChange={setPage} 
                color="primary" 
                size="md"
                classNames={{
                  cursor: "bg-brand-blue font-bold",
                  item: "bg-card border border-border text-foreground hover:bg-muted"
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}