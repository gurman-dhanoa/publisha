'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Button, User, Divider, Avatar } from '@heroui/react';
import { Send, Twitter, Facebook, Instagram, Youtube, Linkedin, Music2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import Container from '@/components/shared/Container';
import TiptapEditor from '@/components/forms/TiptapEditor';
import ImageUpload from '@/components/forms/ImageUpload';
import { articleSchema } from '@/lib/validations/article';
import api from '@/lib/axios';

export default function PublishPage() {
  const { user } = useSelector((state) => state.auth);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: { title: '', summary: '', content: '', featuredImage: null }
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      await api.post('/articles', formData);
      toast.success('Your story has been published!');
    } catch (err) {
      // Axios Interceptor handles the error message
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-brand-mint selection:text-black pb-24">
      {/* 1. STICKY TOP ACTIONS BAR */}
      <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border/50">
        <Container>
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Editor Mode</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Button 
                type="submit" 
                form="article-form" 
                className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 h-11 transition-all hover:opacity-90 shadow-md"
                isLoading={isSubmitting}
                radius="full"
                endContent={<Send size={14} />}
              >
                Publish Story
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      <Container>
        <div className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: MAIN EDITOR (Mimics Article Content)                 */}
          {/* ================================================================= */}
          <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[65%]">
            
            {/* Title Area */}
            <div className="mb-8">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={1}
                    className="w-full bg-transparent text-5xl lg:text-6xl font-serif font-bold placeholder:text-border outline-none border-none resize-none overflow-hidden leading-[1.15]"
                    placeholder="Enter title..."
                    onChange={(e) => {
                      field.onChange(e);
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                )}
              />
              {errors.title && <p className="text-danger text-xs font-bold mt-2 uppercase tracking-wide">{errors.title.message}</p>}
            </div>

            {/* Author Metadata Simulation */}
            <div className="flex items-center gap-6 mb-10 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar || "https://i.pravatar.cc/150"}
                  className="w-10 h-10 border border-border"
                />
                <div>
                  <p className="text-sm text-foreground font-medium">{user?.name || "Draft Author"}</p>
                  <p className="italic">Writing now...</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-border" />
              <p className="font-medium uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Featured Image Area */}
            <div className="mb-12">
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <div className="rounded-sm overflow-hidden border-2 border-dashed border-border hover:border-brand-blue/50 transition-colors">
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.featuredImage && <p className="text-danger text-xs font-bold mt-2 uppercase tracking-wide">{errors.featuredImage.message}</p>}
            </div>

            {/* Content / TipTap Area */}
            <article className="prose prose-stone max-w-none">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.content && <p className="text-danger text-xs font-bold mt-4 uppercase tracking-wide">{errors.content.message}</p>}
            </article>
          </form>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: SIDEBAR (Mimics Article Detail Sidebar)             */}
          {/* ================================================================= */}
          <aside className="w-full lg:w-[35%] flex flex-col gap-12">
            
            {/* AI Assistant Toolbox (Glorifying the AI tools you mentioned) */}
            <div className="bg-surface-dark p-8 rounded-sm text-center flex flex-col items-center shadow-lg">
              <div className="p-3 bg-brand-mint/10 rounded-full mb-4">
                <Sparkles className="text-brand-mint" size={24} />
              </div>
              <h3 className="text-white text-xl font-serif mb-2 leading-tight">
                AI Writing Assistant
              </h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Need help with your summary or content tone? Use our integrated AI to refine your prose.
              </p>
              <Button
                variant="bordered"
                className="border-brand-mint text-brand-mint font-bold text-xs uppercase tracking-widest w-full py-6 transition-all"
              >
                Refine with AI
              </Button>
            </div>

            <Divider className="bg-border" />

            {/* Summary / Metadata Config */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                Article Summary
              </h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full bg-white border border-border p-4 text-sm text-muted-foreground leading-relaxed outline-none focus:border-brand-blue transition-colors rounded-sm min-h-[120px] resize-none"
                    placeholder="Provide a summary for the card previews..."
                  />
                )}
              />
              <p className="text-[10px] text-muted-foreground mt-2 italic">This appears on your author profile and listing pages.</p>
            </div>

            <Divider className="bg-border" />

            {/* Social Share Preview Simulation */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground">
                Social Links
              </h3>
              <div className="flex gap-3">
                <SocialIcon Icon={Twitter} />
                <SocialIcon Icon={Facebook} />
                <SocialIcon Icon={Instagram} />
                <SocialIcon Icon={Linkedin} />
              </div>
            </div>

          </aside>
        </div>
      </Container>
    </main>
  );
}

// --- Helper Components ---
const SocialIcon = ({ Icon }) => (
  <button className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white transition-colors shadow-sm hover:opacity-80">
    <Icon size={14} strokeWidth={2} fill="currentColor" className={Icon === Instagram ? "fill-none" : ""} />
  </button>
);