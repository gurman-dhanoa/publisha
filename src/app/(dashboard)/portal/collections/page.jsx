"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, Pagination, Spinner } from "@heroui/react";
import { Plus, Edit3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-serif font-bold">Your Series</h3>
        <Button size="sm" radius="full" variant="bordered" startContent={<Plus size={14}/>} className="border-border uppercase font-bold text-[10px] tracking-widest hover:bg-foreground hover:text-background">
          New Series
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner /></div>
      ) : collections.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground font-serif">You haven't created any collections yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map(col => (
              <Card key={col.id} className="bg-card border border-border shadow-sm rounded-xl hover:border-brand-blue/40 transition-colors">
                <CardBody className="flex flex-row items-center justify-between p-6">
                  <div>
                    <h4 className="font-serif font-bold text-lg mb-1">{col.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{col.articles_count} Articles</p>
                  </div>
                  <Button isIconOnly variant="light" as={Link} href={`/collections/edit/${col.id}`}>
                    <Edit3 size={18} className="text-muted-foreground" />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
          
          {paginationInfo.pages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination 
                total={paginationInfo.pages} 
                page={page} 
                onChange={setPage} 
                color="primary" 
                size="sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}