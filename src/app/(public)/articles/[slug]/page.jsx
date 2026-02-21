"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, Button, Image, Divider, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import Container from "@/components/shared/Container";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleService from "@/services/article.service";
import dayjs from "dayjs";

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await ArticleService.getBySlug(slug);
                setArticle(data);
            } catch (error) {
                console.error("Failed to load article", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) return <ArticleDetailSkeleton />;
    if (!article) return <div className="py-20 text-center">Article not found.</div>;

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Container>
                <main className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">
                    {/* LEFT COLUMN: MAIN CONTENT */}
                    <motion.div className="w-full lg:w-[65%]" initial="hidden" animate="visible">
                        {/* Breadcrumbs */}
                        <motion.div variants={fadeIn} className="text-xs text-muted-foreground font-medium tracking-wide mb-6">
                            Home / Blog / <span className="text-foreground">{article.title}</span>
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl lg:text-6xl font-serif text-foreground leading-[1.15] mb-8">
                            {article.title}
                        </motion.h1>

                        {/* Author Metadata */}
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={article.author_avatar}
                                    name={article.author_name}
                                    size="md"
                                    className="w-10 h-10 border border-border"
                                />
                                <div>
                                    <p className="text-sm text-foreground font-medium">{article.author_name}</p>
                                    <p>Editorial Contributor</p>
                                </div>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-border" />

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <p>{dayjs(article.published_at).format('MMMM DD, YYYY')}</p>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <p>Categories: {article.categories?.map(c => c.name).join(', ')}</p>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <p>{article.views_count} Views</p>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="mb-12">
                            <Image
                                alt={article.title}
                                src={article.image_url}
                                className="w-full h-auto max-h-[600px] object-cover rounded-none"
                                removeWrapper
                            />
                        </motion.div>

                        {/* Article Body - Rendering HTML from Backend */}
                        <motion.article 
                            variants={fadeIn} 
                            className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground leading-relaxed
                                       prose-h2:text-xl prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-foreground
                                       prose-strong:text-foreground prose-li:marker:text-brand-blue"
                        >
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </motion.article>
                    </motion.div>

                    {/* RIGHT COLUMN: SIDEBAR */}
                    <motion.aside className="w-full lg:w-[35%] flex flex-col gap-12" initial="hidden" animate="visible">
                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Follow Publisha</h3>
                            <div className="flex gap-3">
                                <SocialIcon Icon={Twitter} />
                                <SocialIcon Icon={Linkedin} />
                                <SocialIcon Icon={Instagram} />
                            </div>
                        </motion.div>

                        <Divider />

                        <motion.div variants={fadeIn}>
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Summary</h3>
                            <p className="text-sm text-muted-foreground italic">"{article.summary}"</p>
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

// --- Helper Skeleton ---
const ArticleDetailSkeleton = () => (
    <Container className="py-16">
        <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-[65%] space-y-8">
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-full h-16" />
                <div className="flex gap-4"><Skeleton className="w-12 h-12 rounded-full"/><Skeleton className="w-1/2 h-12"/></div>
                <Skeleton className="w-full h-[400px]" />
                <Skeleton className="w-full h-64" />
            </div>
            <div className="hidden lg:block w-[35%] space-y-8">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-64" />
            </div>
        </div>
    </Container>
);

const SocialIcon = ({ Icon }) => (
    <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all">
        <Icon size={16} />
    </button>
);

const ListItem = ({ text }) => (
    <li className="flex items-start gap-2 group cursor-pointer">
        <span className="text-muted-foreground mt-0.5 group-hover:text-brand-blue transition-colors">•</span>
        <span className="group-hover:text-brand-blue transition-colors leading-snug">{text}</span>
    </li>
);