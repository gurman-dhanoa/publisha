"use client";

import React, { useMemo, useState } from "react";
import { 
  Card, CardBody, Button, Avatar, Chip, 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Input, Progress
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Users, FileWarning, Activity, 
  Search, MoreVertical, Check, X, 
  TrendingUp, TrendingDown, Landmark, Globe,
  ArrowUpRight, Mail,
  Filter,
  UserCheck,
  ShieldAlert
} from "lucide-react";

import Container from "@/components/shared/Container";

const INITIAL_AUTHORS = [
  { id: 1, name: "Basroop", role: "Full-Stack Developer", status: "active", articles: 42, joined: "Sept 2025" },
  { id: 2, name: "Helen Kotovski", role: "Music Historian", status: "active", articles: 128, joined: "Oct 2025" },
  { id: 3, name: "Jane Hopper", role: "Fiction Writer", status: "suspended", articles: 31, joined: "Nov 2025" },
  { id: 4, name: "Dr. John Staddon", role: "Psychologist", status: "active", articles: 89, joined: "Jan 2026" },
];

export const AuthorManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- FILTER LOGIC ---
  const filteredAuthors = useMemo(() => {
    return INITIAL_AUTHORS.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-foreground">Author Directory</h3>
          <p className="text-xs text-muted-foreground">Manage and monitor the platform's editorial collective.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Input
            isClearable
            className="w-full md:w-72"
            placeholder="Search by name or role..."
            startContent={<Search size={16} className="text-muted-foreground" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            variant="bordered"
            classNames={{
              inputWrapper: "bg-card border-border h-10",
              input: "text-sm"
            }}
          />
          
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="bordered" 
                className="border-border text-foreground font-bold text-[10px] tracking-widest uppercase h-10"
                startContent={<Filter size={14} />}
              >
                {statusFilter === "all" ? "All Status" : statusFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Filter Status"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0])}
            >
              <DropdownItem key="all">All Status</DropdownItem>
              <DropdownItem key="active">Active Only</DropdownItem>
              <DropdownItem key="suspended">Suspended Only</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Authors Table */}
      <Table 
        aria-label="Author Management Table" 
        shadow="none" 
        className="border border-border rounded-xl bg-card overflow-hidden"
      >
        <TableHeader>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Author</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Articles</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Status</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Joined</TableColumn>
          <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest text-right">Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No authors found matching your criteria."}>
          {filteredAuthors.map((author) => (
            <TableRow key={author.id} className="border-b border-border/40 last:border-0 hover:bg-background/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={`https://i.pravatar.cc/150?u=${author.id}`} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{author.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{author.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium">{author.articles}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={author.status === "active" ? "success" : "danger"}
                  className="text-[10px] font-bold uppercase tracking-tighter h-6"
                >
                  {author.status}
                </Chip>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{author.joined}</TableCell>
              <TableCell className="text-right">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Author Actions">
                    <DropdownItem startContent={<Mail size={14} />}>Contact Author</DropdownItem>
                    <DropdownItem startContent={<UserCheck size={14} />}>View Profile</DropdownItem>
                    <DropdownItem 
                      className="text-danger" 
                      color="danger" 
                      startContent={<ShieldAlert size={14} />}
                    >
                      {author.status === "active" ? "Suspend Author" : "Reactivate Author"}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row gap-12">
          
          {/* ================================================================= */}
          {/* 1. ADMIN SIDEBAR                                                  */}
          {/* ================================================================= */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex flex-col items-center lg:items-start px-4">
              <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-blue/20">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground">Admin Console</h2>
              <p className="text-[10px] text-brand-blue uppercase tracking-widest font-bold">Root Access</p>
            </div>

            <nav className="flex flex-col gap-2">
              <AdminNavBtn icon={<Activity size={18}/>} label="System Pulse" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
              <AdminNavBtn icon={<Users size={18}/>} label="Author Directory" active={activeTab === "authors"} onClick={() => setActiveTab("authors")} />
              <AdminNavBtn icon={<FileWarning size={18}/>} label="Moderation" active={activeTab === "moderation"} onClick={() => setActiveTab("moderation")} />
              <AdminNavBtn icon={<Landmark size={18}/>} label="Financials" active={activeTab === "financials"} onClick={() => setActiveTab("financials")} />
              
              <div className="h-px bg-border my-4 opacity-50" />
              
              <Button 
                variant="bordered"
                className="border-border text-foreground font-bold tracking-widest uppercase text-[10px] h-12 w-full"
                startContent={<Globe size={16} />}
              >
                View Live Site
              </Button>
            </nav>
          </aside>

          {/* ================================================================= */}
          {/* 2. ADMIN MAIN CONTENT                                             */}
          {/* ================================================================= */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && <SystemPulse key="pulse" />}
              {activeTab === "authors" && <AuthorManagement key="authors" />}
              {activeTab === "moderation" && <ModerationQueue key="mod" />}
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  );
}

// --- SUB-TABS ---

const SystemPulse = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AdminStatCard label="Monthly Active Users" value="1.2M" trend="+14%" isUp={true} />
      <AdminStatCard label="Platform Revenue" value="$42,850" trend="+22%" isUp={true} />
      <AdminStatCard label="Server Load" value="24%" trend="-2%" isUp={false} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-card border border-border shadow-none p-6">
        <h3 className="text-lg font-serif font-bold mb-6">Traffic Distribution</h3>
        <div className="space-y-6">
           <ProgressLabel label="India" value={65} color="bg-brand-blue" />
           <ProgressLabel label="United States" value={20} color="bg-brand-mint" />
           <ProgressLabel label="United Kingdom" value={10} color="bg-foreground" />
           <ProgressLabel label="Others" value={5} color="bg-border" />
        </div>
      </Card>
      
      <Card className="bg-card border border-border shadow-none p-6">
        <h3 className="text-lg font-serif font-bold mb-6 flex items-center justify-between">
            Top Performing Authors
            <ArrowUpRight size={16} className="text-muted-foreground" />
        </h3>
        <div className="space-y-4">
           {['Basroop', 'Jane Hopper', 'Helen Kotovski'].map((name, i) => (
             <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50">
                <div className="flex items-center gap-3">
                    <Avatar size="sm" src={`https://i.pravatar.cc/150?u=${name}`} />
                    <span className="text-sm font-medium">{name}</span>
                </div>
                <Chip size="sm" variant="flat" className="text-[10px] font-bold">Top {i+1}</Chip>
             </div>
           ))}
        </div>
      </Card>
    </div>
  </motion.div>
);

const ModerationQueue = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif font-bold">Pending Approval</h3>
        <Chip variant="dot" color="warning" className="uppercase font-bold text-[10px]">6 Articles Waiting</Chip>
    </div>

    <Table aria-label="Moderation Table" shadow="none" className="border border-border rounded-xl bg-card">
        <TableHeader>
            <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Article Title</TableColumn>
            <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest">Author</TableColumn>
            <TableColumn className="bg-background text-[10px] uppercase font-bold tracking-widest text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody>
            <TableRow className="border-b border-border/50">
                <TableCell className="text-sm font-medium">Inside the Kingmaker SQL Engine</TableCell>
                <TableCell><UserMeta name="Basroop" /></TableCell>
                <TableCell>
                    <div className="flex justify-center gap-2">
                        <Button isIconOnly size="sm" className="bg-brand-mint/20 text-brand-blue"><Check size={16}/></Button>
                        <Button isIconOnly size="sm" variant="flat" color="danger"><X size={16}/></Button>
                    </div>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
  </motion.div>
);

// --- HELPERS ---

const AdminNavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${active ? "bg-foreground text-background shadow-lg" : "text-muted-foreground hover:bg-card"}`}>
    {icon} {label}
  </button>
);

const AdminStatCard = ({ label, value, trend, isUp }) => (
  <Card className="bg-card border border-border shadow-none rounded-2xl p-6">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
    <div className="flex items-end gap-3">
        <h4 className="text-3xl font-serif font-bold text-foreground leading-none">{value}</h4>
        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${isUp ? 'text-brand-mint' : 'text-danger'}`}>
            {isUp ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {trend}
        </span>
    </div>
</Card>
);

const ProgressLabel = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
            <span>{label}</span>
            <span className="text-muted-foreground">{value}%</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full ${color}`} />
        </div>
    </div>
);

const UserMeta = ({ name }) => (
    <div className="flex items-center gap-2">
        <Avatar size="sm" src={`https://i.pravatar.cc/150?u=${name}`} className="w-6 h-6" />
        <span className="text-xs font-medium">{name}</span>
    </div>
);