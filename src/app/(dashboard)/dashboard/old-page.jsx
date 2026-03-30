"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Button, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, FileText, FolderHeart, UserCog, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Container from "@/components/shared/Container";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";

// Sub-components (We will create these next)
import OverviewTab from "@/components/dashboard/OverviewTab";
import ArticlesTab from "@/components/dashboard/ArticlesTab";
import CollectionsTab from "@/components/dashboard/CollectionsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Authentication Protection & Data Fetching
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsDataLoading(true);
        // 1. Fetch Profile (which includes articles and collections)
        const profile = await AuthorService.getMe();
        setProfileData(profile);

        // 2. Fetch Stats using the ID from the profile
        if (profile?.id) {
          const stats = await AuthorService.getStats(profile.id);
          setStatsData(stats);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-muted-foreground font-serif tracking-widest uppercase text-xs">Loading Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-brand-mint">
      <Container>
        <div className="py-10 flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex flex-col items-center lg:items-start px-4">
              <Avatar 
                src={profileData?.avatar_url || user?.avatarUrl} 
                name={profileData?.name || "Author"}
                className="w-20 h-20 mb-4 ring-2 ring-border text-2xl font-bold bg-foreground text-background" 
              />
              <h2 className="text-xl font-serif font-bold text-foreground">{profileData?.name}</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Author Workspace
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <NavButton icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
              <NavButton icon={<FileText size={18}/>} label="Articles" active={activeTab === "articles"} onClick={() => setActiveTab("articles")} />
              <NavButton icon={<FolderHeart size={18}/>} label="Collections" active={activeTab === "collections"} onClick={() => setActiveTab("collections")} />
              <NavButton icon={<UserCog size={18}/>} label="Profile Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
              
              <div className="h-px bg-border my-4 opacity-50" />
              
              <Button 
                as={Link} href="/publish"
                className="bg-foreground text-background font-bold tracking-widest uppercase text-[10px] h-12 w-full transition-transform hover:scale-[1.02]"
                startContent={<Plus size={16} />}
              >
                Create Article
              </Button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && <OverviewTab key="overview" stats={statsData} />}
              {activeTab === "articles" && <ArticlesTab key="articles" articles={profileData?.articles || []} />}
              {activeTab === "collections" && <CollectionsTab key="collections" collections={profileData?.collections || []} />}
              {activeTab === "settings" && <SettingsTab key="settings" profile={profileData} />}
            </AnimatePresence>
          </main>
        </div>
      </Container>
    </div>
  );
}

// Helper Component for Sidebar
const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${active ? "bg-card text-brand-blue shadow-sm border border-border" : "text-muted-foreground hover:bg-card/50 hover:text-foreground"}`}>
    {icon} {label}
  </button>
);