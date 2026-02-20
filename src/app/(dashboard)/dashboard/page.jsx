"use client";

import React, { useState, useMemo } from "react";
import { 
  Card, CardBody, Button, Avatar, Chip, 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Input, Select, SelectItem, Textarea
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, FolderHeart, UserCog, 
  Plus, MoreVertical, Eye, Edit3, Trash2, 
  BarChart3, CheckCircle2, Clock, AlertCircle,
  Search, Filter, Globe, Github, Twitter, Save
} from "lucide-react";
import Container from "@/components/shared/Container";
import Link from "next/link";

// --- DUMMY DATA ---
const INITIAL_ARTICLES = [
  { id: 1, title: "Building the Kingmaker: Next.js & SQL", status: "published", date: "Feb 18, 2026", views: "12.5k" },
  { id: 2, title: "SQL Architecture for Swings", status: "draft", date: "Feb 19, 2026", views: "-" },
  { id: 3, title: "Unoptimized S3 Buckets", status: "suspended", date: "Jan 12, 2026", views: "402" },
  { id: 4, title: "Next.js 15 Performance Benchmarks", status: "published", date: "Feb 05, 2026", views: "8.2k" },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex flex-col items-center lg:items-start px-4">
              <Avatar src="https://i.pravatar.cc/150?u=basroop" className="w-20 h-20 mb-4 ring-2 ring-border" />
              <h2 className="text-xl font-serif font-bold text-foreground">Basroop</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Premium Architect</p>
            </div>

            <nav className="flex flex-col gap-2">
              <NavButton icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
              <NavButton icon={<FileText size={18}/>} label="Articles" active={activeTab === "articles"} onClick={() => setActiveTab("articles")} />
              <NavButton icon={<FolderHeart size={18}/>} label="Collections" active={activeTab === "collections"} onClick={() => setActiveTab("collections")} />
              <NavButton icon={<UserCog size={18}/>} label="Profile Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
              
              <div className="h-px bg-border my-4 opacity-50" />
              
              <Button 
                as={Link} href="/publish"
                className="bg-foreground text-background font-bold tracking-widest uppercase text-[10px] h-12 w-full"
                startContent={<Plus size={16} />}
              >
                Create Article
              </Button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && <OverviewTab key="overview" />}
              {activeTab === "articles" && <ArticlesTab key="articles" />}
              {activeTab === "collections" && <CollectionsTab key="collections" />}
              {activeTab === "settings" && <SettingsTab key="settings" />}
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  );
}

// --- TAB 1: OVERVIEW (With Dummy Graph) ---
const OverviewTab = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard label="Total Views" value="850.4K" trend="+12%" />
      <StatCard label="Followers" value="12,402" trend="+5%" />
      <StatCard label="Revenue" value="$2,402" trend="+8%" />
    </div>
    
    <Card className="bg-card border border-border shadow-none rounded-2xl overflow-hidden">
      <CardBody className="p-8">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-serif font-bold">Reader Engagement (Last 7 Days)</h3>
            <Chip size="sm" className="bg-brand-mint/20 text-brand-blue font-bold uppercase tracking-widest text-[10px]">Live Data</Chip>
        </div>
        {/* Dummy Graph Implementation */}
        <div className="h-64 flex items-end justify-between gap-3 md:gap-6 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1, 2, 3, 4].map((i) => <div key={i} className="w-full h-px bg-border/30" />)}
          </div>
          {[60, 40, 85, 30, 95, 70, 50].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 relative z-10 group">
              <motion.div 
                initial={{ height: 0 }} animate={{ height: `${h}%` }}
                className="w-full bg-brand-blue/20 rounded-t-lg group-hover:bg-brand-blue transition-colors cursor-pointer"
              />
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Day {i+1}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  </motion.div>
);

// --- TAB 2: ARTICLES (With Search & Status Filter) ---
const ArticlesTab = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return INITIAL_ARTICLES.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filter === "all" || a.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [search, filter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-serif font-bold">Manage Articles</h3>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Input 
            size="sm" placeholder="Search title..." startContent={<Search size={14}/>}
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select 
            size="sm" placeholder="Status" className="w-32"
            selectedKeys={[filter]} onSelectionChange={(keys) => setFilter(Array.from(keys)[0])}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="draft">Draft</SelectItem>
            <SelectItem key="suspended">Suspended</SelectItem>
          </Select>
        </div>
      </div>

      <Table aria-label="Articles list" shadow="none" className="border border-border rounded-xl bg-card">
        <TableHeader>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Article</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Status</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Views</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest text-right">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No articles found matching filters."}>
          {filtered.map((art) => (
            <TableRow key={art.id} className="border-b border-border/50">
              <TableCell className="font-medium text-sm">{art.title}</TableCell>
              <TableCell><StatusChip status={art.status} /></TableCell>
              <TableCell className="text-xs text-muted-foreground">{art.views}</TableCell>
              <TableCell className="text-right">
                <Button isIconOnly variant="light" size="sm"><MoreVertical size={16}/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

// --- TAB 3: COLLECTIONS ---
const CollectionsTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-serif font-bold">Your Collections</h3>
      <Button size="sm" radius="full" variant="bordered" startContent={<Plus size={14}/>} className="border-border uppercase font-bold text-[10px] tracking-widest">New Series</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CollectionManageCard title="Next.js Architecture" count={12} />
      <CollectionManageCard title="Political Strategy Tech" count={8} />
    </div>
  </motion.div>
);

// --- TAB 4: PROFILE SETTINGS ---
const SettingsTab = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl">
    <div className="space-y-6">
      <h3 className="text-xl font-serif font-bold">Profile Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Display Name" defaultValue="Basroop" labelPlacement="outside" />
        <Input label="Email Address" defaultValue="basroop@publisha.com" labelPlacement="outside" />
      </div>

      <Textarea 
        label="Biography" 
        labelPlacement="outside"
        placeholder="Tell the readers about your journey..."
        defaultValue="Full-stack developer and technical writer specializing in modern web architecture. Creator of the Kingmaker platform."
      />

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Social Presence</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input size="sm" startContent={<Globe size={14}/>} placeholder="Website URL" />
          <Input size="sm" startContent={<Twitter size={14}/>} placeholder="Twitter Username" />
          <Input size="sm" startContent={<Github size={14}/>} placeholder="Github Username" />
        </div>
      </div>

      <Button className="bg-brand-blue text-white font-bold uppercase tracking-widest text-xs px-8 h-12" startContent={<Save size={16}/>}>
        Save Changes
      </Button>
    </div>
  </motion.div>
);

// --- HELPERS ---

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${active ? "bg-card text-brand-blue shadow-sm border border-border" : "text-muted-foreground hover:bg-card/50"}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, trend }) => (
  <Card className="bg-card border border-border shadow-none rounded-2xl">
    <CardBody className="p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-serif font-bold text-foreground">{value}</p>
      <span className="text-[10px] text-brand-mint font-bold uppercase">{trend} This Month</span>
    </CardBody>
  </Card>
);

const CollectionManageCard = ({ title, count }) => (
  <Card className="bg-card border border-border shadow-none rounded-xl">
    <CardBody className="flex flex-row items-center justify-between p-6">
      <div>
        <h4 className="font-serif font-bold text-lg">{title}</h4>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{count} Articles</p>
      </div>
      <Button isIconOnly variant="light"><Edit3 size={18}/></Button>
    </CardBody>
  </Card>
);

const StatusChip = ({ status }) => {
  const configs = {
    published: { color: "success", icon: <CheckCircle2 size={12}/> },
    draft: { color: "warning", icon: <Clock size={12}/> },
    suspended: { color: "danger", icon: <AlertCircle size={12}/> },
  };
  return (
    <Chip size="sm" variant="flat" color={configs[status].color} startContent={configs[status].icon} className="text-[10px] font-bold uppercase tracking-tighter">
      {status}
    </Chip>
  );
};