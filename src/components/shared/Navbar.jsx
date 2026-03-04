"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, HeartHandshake } from "lucide-react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import GlobalSearchModal from "@/components/shared/GlobalSearch";
import AuthModal from "../modal/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/store/slices/authSlice";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />; // Matching placeholder size

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground group"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={1.5} />
      ) : (
        <Moon size={18} strokeWidth={1.5} />
      )}
    </button>
  );
};

const Navbar = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Unified state for the Global Search
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  const logoutUser = async () => {
    await dispatch(logout());
    router.push("/");
  };

  return (
    <>
      <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 flex flex-col transition-all">
        <div className="h-20 px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
            {/* <HeartHandshake size={28} className="text-brand-blue" strokeWidth={1.5} /> */}
            <span className="text-xl sm:text-2xl font-sans font-black tracking-wide text-foreground uppercase mt-1">
              Publisha
            </span>
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            
            {/* GLOBAL SEARCH TRIGGER - DESKTOP (Matches Reference Image) */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="hidden md:flex h-10 items-center justify-between gap-12 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground group"
            >
              <div className="flex items-center gap-2 pl-1">
                <Search size={18} strokeWidth={2} />
                <span className="text-sm font-medium">Search</span>
              </div>
              
              <kbd className="flex items-center gap-1 h-6 px-2.5 rounded-full bg-muted border border-border text-[11px] font-sans font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="text-[10px]">Ctrl</span> K
              </kbd>
            </button>

            {/* GLOBAL SEARCH TRIGGER - MOBILE (Icon Only) */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <ThemeToggle />

            {/* AUTH / PROFILE */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center ml-2">
                    <Dropdown placement="bottom-end" classNames={{ content: "rounded-none border-border min-w-[200px]" }}>
                      <DropdownTrigger>
                        <Avatar
                          as="button"
                          className="transition-transform ring-2 ring-transparent hover:ring-brand-blue"
                          color="default"
                          name={user?.name?.slice(0, 1) || "U"}
                          size="sm"
                          src={user?.avatarUrl}
                          classNames={{ base: "bg-foreground text-background font-black text-sm cursor-pointer ml-1" }}
                        />
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Profile Actions" variant="flat" radius="none">
                        <DropdownItem key="profile" className="h-14 gap-2 opacity-100 cursor-default border-b border-border/50 mb-2">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Signed in as</p>
                          <p className="font-bold text-sm truncate">{user?.email}</p>
                        </DropdownItem>
                        <DropdownItem key="dashboard" as={Link} href="/dashboard">
                          My Dashboard
                        </DropdownItem>
                        {/* <DropdownItem key="settings" as={Link} href="/dashboard/settings">
                          Settings
                        </DropdownItem> */}
                        <DropdownItem key="logout" color="danger" className="text-danger mt-2 border-t border-border/50 pt-2" onPress={logoutUser}>
                          Log Out
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                ) : (
                  <div className="ml-2">
                    <AuthModal buttonText="Join" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* RENDER THE MODAL AT THE ROOT LEVEL */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onOpen={() => setIsGlobalSearchOpen(true)}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;