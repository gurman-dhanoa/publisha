"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Button, Spinner } from "@heroui/react";
import { LayoutDashboard, FileText, FolderHeart, UserCog, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Container from "@/components/shared/Container";
import { useAuth } from "@/hooks/useAuth";
import AuthorService from "@/services/author.service";

export default function PortalLayout({ children }) {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [profileData, setProfileData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await AuthorService.getMe();
        setProfileData(profile);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
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
          <aside className="w-full lg:w-64 shrink-0 space-y-8 sticky top-24 h-fit">
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
              <NavButton 
                href="/portal/dashboard" 
                icon={<LayoutDashboard size={18}/>} 
                label="Overview" 
                active={pathname === "/portal/dashboard"} 
              />
              <NavButton 
                href="/portal/articles" 
                icon={<FileText size={18}/>} 
                label="Articles" 
                active={pathname?.startsWith("/portal/articles")} 
              />
              <NavButton 
                href="/portal/collections" 
                icon={<FolderHeart size={18}/>} 
                label="Collections" 
                active={pathname?.startsWith("/portal/collections")} 
              />
              <NavButton 
                href="/portal/settings" 
                icon={<UserCog size={18}/>} 
                label="Settings" 
                active={pathname === "/portal/settings"} 
              />
              
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

          {/* DYNAMIC PAGE CONTENT */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}

const NavButton = ({ href, icon, label, active }) => (
  <Link href={href} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${active ? "bg-card text-brand-blue shadow-sm border border-border" : "text-muted-foreground hover:bg-card/50 hover:text-foreground"}`}>
    {icon} {label}
  </Link>
);