"use client";

import React from "react";
import { Avatar, Button, Image, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import {
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Linkedin,
    Music2 // Fallback for TikTok in Lucide
} from "lucide-react";
import Container from "@/components/shared/Container";
import RelatedArticles from "@/components/RelatedArticles";

export default function ArticleDetailPage() {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Container>
                <main className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">

                    {/* ================================================================= */}
                    {/* LEFT COLUMN: MAIN ARTICLE CONTENT                                 */}
                    {/* ================================================================= */}
                    <motion.div
                        className="w-full lg:w-[65%]"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Breadcrumbs */}
                        <motion.div variants={fadeIn} className="text-xs text-muted-foreground font-medium tracking-wide mb-6">
                            <span className="hover:text-foreground cursor-pointer transition-colors">Home</span> /{" "}
                            <span className="hover:text-foreground cursor-pointer transition-colors">Blog</span> /{" "}
                            <span className="text-foreground">Suffering with lack of responsibility?</span>
                        </motion.div>

                        {/* Article Title */}
                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] mb-8"
                        >
                            Suffering with lack<br />of responsibility?
                        </motion.h1>

                        {/* Author Metadata */}
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                                    size="md"
                                    className="w-10 h-10 border border-border"
                                />
                                <div>
                                    <p className="text-sm text-foreground font-medium">John Staddon, Ph.D.</p>
                                    <p>Adaptive Behavior</p>
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-border" />

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <p>March 22, 2022</p>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <p>Categories: Addictions (34)</p>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <p>4 Min Read</p>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div variants={fadeIn} className="mb-12">
                            <Image
                                alt="Woman smiling outdoors"
                                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop"
                                className="w-full h-auto max-h-[500px] object-cover rounded-sm shadow-sm"
                                removeWrapper
                            />
                        </motion.div>

                        {/* Article Body */}
                        <motion.article variants={fadeIn} className="prose prose-stone max-w-none text-muted-foreground leading-relaxed">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground mb-4 mt-8">
                                What is Gaslighting?
                            </h2>
                            <p className="mb-6">
                                If you are suffering with a lack of responsibility, here's how to choose a different path.
                            </p>
                            <p className="mb-6">
                                What are mental health issues, and why are they so common?<br />
                                Mental health issues are on the rise with statistics showing that 1 in 4 people in the UK suffer with at least one mental health condition, or have in their lifetime. In the UK alone, there are currently around 20 million people that experience difficulties with a mental illness. Since the start of the COVID-19 pandemic, the number of people suffering has increased exceedingly, due to numerous lockdowns, self-isolation, quarantine, and not being able to experience everyday social interactions. According to the Office For National Statistics, depression in adults rose by 1.3 percentage points to 15.6% compared to the corresponding 2019 period.
                            </p>

                            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground mb-4 mt-12">
                                Suffering with lack of responsibility?
                            </h2>
                            <p className="mb-6">
                                Mental illnesses include a wealth of different symptoms, not limited to depression, anxiety, OCD, addiction, ADHD, body dysmorphia, and an extensive list of more.
                            </p>
                            <p className="mb-6">
                                How do I know if I'm suffering from a mental health issue?<br />
                                Have you ever felt too uncomfortable to leave the house? Have you ever felt anxious about seeing certain people, or attending a social event? Have you ever felt too down to get out of bed in the morning, or felt yourself consistently going over the same thoughts, processes and actions? These are all general signs and attributes of a mental illness.
                            </p>
                        </motion.article>
                    </motion.div>

                    {/* ================================================================= */}
                    {/* RIGHT COLUMN: SIDEBAR                                             */}
                    {/* ================================================================= */}
                    <motion.aside
                        className="w-full lg:w-[35%] flex flex-col gap-12"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Social Follow */}
                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                                Follow Publisha
                            </h3>
                            <div className="flex gap-3">
                                <SocialIcon Icon={Twitter} />
                                <SocialIcon Icon={Facebook} />
                                <SocialIcon Icon={Instagram} />
                                <SocialIcon Icon={Youtube} />
                                <SocialIcon Icon={Linkedin} />
                                <SocialIcon Icon={Music2} />
                            </div>
                        </motion.div>

                        <Divider className="bg-border" />

                        {/* Table Of Contents */}
                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                                Table Of Contents
                            </h3>
                            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                                <li className="hover:text-brand-blue cursor-pointer transition-colors">What is gaslighting?</li>
                                <li className="hover:text-brand-blue cursor-pointer transition-colors">Suffering with lack of responsibility?</li>
                                <li className="hover:text-brand-blue cursor-pointer transition-colors">Why do I make excuses?</li>
                                <li className="hover:text-brand-blue cursor-pointer transition-colors">Impatience</li>
                            </ul>
                        </motion.div>

                        <Divider className="bg-border" />

                        {/* Popular Articles */}
                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                                Popular Articles
                            </h3>
                            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                                <ListItem text="Building the Kingmaker: Next.js Architecture" />
                                <ListItem text="AWS Cost Optimization Strategies" />
                                <ListItem text="Swing Vote Calculations in SQL" />
                                <ListItem text="The Odyssey: Cinematic Framing" />
                                <ListItem text="Troubleshooting Electron.js Pipelines" />
                            </ul>
                        </motion.div>

                        <Divider className="bg-border" />

                        {/* Popular Videos */}
                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                                Popular Videos
                            </h3>
                            <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
                                <ListItem text="Suffering with lack of responsibility?" />
                                <ListItem text="Thinking traps: how to let go of negative thoughts" />
                                <ListItem text="Breast Cancer Clinical Trials: 5 Common Misconceptions" />
                            </ul>
                        </motion.div>

                        {/* CTA Widget */}
                        <motion.div variants={fadeIn} className="mt-4">
                            <div className="bg-surface-dark p-10 rounded-sm text-center flex flex-col items-center justify-center shadow-lg">
                                <h3 className="text-white text-2xl font-serif mb-2 leading-tight">
                                    Join The <br /> Publisha Club
                                </h3>
                                <p className="text-gray-400 text-xs mb-8">
                                    Get exclusive access to premium tools<br />and AI writing assistants.
                                </p>
                                <Button
                                    radius="full"
                                    className="bg-brand-mint hover:bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-6 transition-all shadow-md"
                                >
                                    Join Now
                                </Button>
                            </div>
                        </motion.div>

                    </motion.aside>
                </main>
            </Container>
            <RelatedArticles />
        </div>
    );
}

// --- Helper Components ---

const SocialIcon = ({ Icon }) => (
    <button className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white transition-colors shadow-sm hover:opacity-80">
        <Icon size={14} strokeWidth={2} fill="currentColor" className={Icon === Instagram ? "fill-none" : ""} />
    </button>
);

const ListItem = ({ text }) => (
    <li className="flex items-start gap-2 group cursor-pointer">
        <span className="text-muted-foreground mt-0.5 group-hover:text-brand-blue transition-colors">•</span>
        <span className="group-hover:text-brand-blue transition-colors leading-snug">{text}</span>
    </li>
);