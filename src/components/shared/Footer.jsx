"use client";

import React from "react";
import { Input, Button, Divider } from "@heroui/react";
import { Twitter, Facebook, Instagram, Linkedin, HeartHandshake } from "lucide-react";
import Container from "./Container";
import Link from "next/link";

const Footer = () => {
    return (
        /* Changed bg-white to bg-card and border-gray-100 to border-border */
        <footer className="w-full bg-card pt-20 pb-10 px-6 border-t border-border">
            <Container>

                {/* Top Section: Added items-start to fix vertical alignment issues */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 items-start">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <HeartHandshake size={28} className="text-brand-blue" strokeWidth={1.5} />
                            <span className="text-2xl font-sans font-black tracking-wide text-foreground uppercase mt-1">
                                Publisha
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering authors and readers through intelligent tools and breathtaking stories. Discover a new perspective every day.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <SocialLink Icon={Twitter} />
                            <SocialLink Icon={Facebook} />
                            <SocialLink Icon={Instagram} />
                            <SocialLink Icon={Linkedin} />
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">Explore</h4>
                        <FooterLink text="Home" href="/" />
                        <FooterLink text="About Us" href="/about" />
                        <FooterLink text="Our Authors" href="/authors" />
                        <FooterLink text="Articles" href="/articles" />
                        <FooterLink text="Contact" href="/contact" />
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">Legal</h4>
                        <FooterLink text="Privacy Policy" href="/privacy" />
                        <FooterLink text="Terms of Service" href="/terms" />
                        <FooterLink text="Cookie Policy" href="/cookies" />
                        <FooterLink text="Accessibility" href="/accessibility" />
                    </div>

                    {/* Newsletter Section */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">Join the Club</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                            Subscribe to get the latest articles and updates on our AI writing tools.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                radius="sm"
                                classNames={{
                                    /* Respects global background in both light/dark mode */
                                    inputWrapper: "bg-background border border-border shadow-none h-12 focus-within:ring-1 ring-brand-blue",
                                    input: "text-sm text-foreground placeholder:text-muted-foreground"
                                }}
                            />
                            <Button
                                radius="sm"
                                className="bg-foreground text-background font-bold text-xs uppercase tracking-widest w-full h-12 transition-all hover:opacity-90"
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>

                </div>

                <Divider className="bg-border mb-8" />

                {/* Bottom Section: Improved alignment and coloring */}
                <div className="flex flex-col md:flex-row items-center justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground gap-4 text-center md:text-left">
                    <p>© {new Date().getFullYear()} Publisha. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Designed by</span>
                        {/* <span className="text-danger">♥</span> */}
                        <span>Gurman Singh</span>
                    </div>
                </div>

            </Container>
        </footer>
    );
};

export default Footer;

// --- Helper Components: Updated to use semantic variables ---

const FooterLink = ({ text, href }) => (
    <Link 
        href={href || "#"} 
        className="text-sm text-muted-foreground hover:text-brand-blue transition-colors w-fit font-medium"
    >
        {text}
    </Link>
);

const SocialLink = ({ Icon }) => (
    <button className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-brand-blue hover:border-brand-blue transition-all">
        <Icon size={16} strokeWidth={1.5} />
    </button>
);