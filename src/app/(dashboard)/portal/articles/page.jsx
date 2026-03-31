"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Button, Chip, Pagination, Spinner } from "@heroui/react";
import { Search, Eye, Edit3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";
import useDebounce from "@/hooks/useDebounce"; // Assuming you have a debounce hook, or just handle it directly

export default function ArticlesPage() {
  const { user } = useAuth();
  
  const [articles, setArticles] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await AuthorService.getArticles(user.id, { 
        page, 
        limit: 10, 
        status: status !== "all" ? status : undefined 
      });
      setArticles(data.articles || []);
      setPaginationInfo(data.pagination || { page: 1, pages: 1 });
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [user, page, status]); // Re-fetch on pagination or status change

  // Client-side filtering for search to maintain speed, or wire it to API if backend supports `search` param
  const displayedArticles = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ALIGNMENT FIXES HERE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-serif font-bold shrink-0">Manage Articles</h3>
        
        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          <Input 
            size="sm" 
            placeholder="Search title..." 
            startContent={<Search size={14} className="text-muted-foreground" />}
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
            classNames={{ inputWrapper: "bg-background border border-border" }}
          />
          <Select 
            size="sm" 
            placeholder="Status" 
            className="w-32 shrink-0"
            selectedKeys={[status]} 
            onSelectionChange={(keys) => {
              setStatus(Array.from(keys)[0]);
              setPage(1); // Reset page on filter
            }}
            classNames={{ trigger: "bg-background border border-border" }}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="draft">Draft</SelectItem>
          </Select>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <Table aria-label="Articles list" shadow="none" classNames={{ wrapper: "rounded-none" }}>
          <TableHeader>
            <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Article</TableColumn>
            <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Status</TableColumn>
            <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Date</TableColumn>
            <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Views</TableColumn>
            <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest text-right">Actions</TableColumn>
          </TableHeader>
          <TableBody 
            emptyContent={loading ? <Spinner className="py-10" /> : "No articles found."}
          >
            {displayedArticles.map((art) => (
              <TableRow key={art.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-sm py-4 max-w-[250px] truncate" title={art.title}>
                  {art.title}
                </TableCell>
                <TableCell><StatusChip status={art.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {dayjs(art.created_at).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">{art.views_count}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button as={Link} href={`/articles/${art.slug}`} isIconOnly variant="light" size="sm">
                      <Eye size={16} className="text-muted-foreground hover:text-brand-blue" />
                    </Button>
                    <Button as={Link} href={`/publish?slug=${art.slug}`} isIconOnly variant="light" size="sm">
                      <Edit3 size={16} className="text-muted-foreground hover:text-brand-mint" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION INTEGRATION */}
        {!loading && paginationInfo.pages > 1 && (
          <div className="flex justify-center p-4 border-t border-border">
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
    </div>
  );
}

const StatusChip = ({ status }) => {
  const configs = {
    published: { color: "success", icon: <CheckCircle2 size={12}/> },
    draft: { color: "warning", icon: <Clock size={12}/> },
    suspended: { color: "danger", icon: <AlertCircle size={12}/> },
  };
  const config = configs[status] || configs.draft;
  return (
    <Chip size="sm" variant="flat" color={config.color} startContent={config.icon} className="text-[10px] font-bold uppercase tracking-tighter">
      {status}
    </Chip>
  );
};