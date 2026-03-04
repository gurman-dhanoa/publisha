import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Search, Eye, Edit3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

export default function ArticlesTab({ articles }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === "all" || a.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, filter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-serif font-bold">Manage Articles</h3>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Input 
            size="sm" placeholder="Search title..." startContent={<Search size={14}/>}
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            classNames={{ inputWrapper: "bg-background border border-border" }}
          />
          <Select 
            size="sm" placeholder="Status" className="w-32"
            selectedKeys={[filter]} onSelectionChange={(keys) => setFilter(Array.from(keys)[0])}
            classNames={{ trigger: "bg-background border border-border" }}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="draft">Draft</SelectItem>
          </Select>
        </div>
      </div>

      <Table aria-label="Articles list" shadow="none" className="border border-border rounded-xl bg-card overflow-hidden">
        <TableHeader>
          <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Article</TableColumn>
          <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Status</TableColumn>
          <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Date</TableColumn>
          <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest">Views</TableColumn>
          <TableColumn className="bg-muted text-[10px] uppercase font-bold tracking-widest text-right">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No articles found matching filters."}>
          {filtered.map((art) => (
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
                  <Button as={Link} href={`/articles/${art.slug}`} isIconOnly variant="light" size="sm" title="View Article">
                    <Eye size={16} className="text-muted-foreground hover:text-brand-blue" />
                  </Button>
                  {/* Edit action passes the slug to the publish page */}
                  <Button as={Link} href={`/publish?slug=${art.slug}`} isIconOnly variant="light" size="sm" title="Edit Article">
                    <Edit3 size={16} className="text-muted-foreground hover:text-brand-mint" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
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