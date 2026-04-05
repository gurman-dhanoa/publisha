'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { Button, Avatar, Divider, Spinner, Select, SelectItem, Input } from '@heroui/react';
import { Send, Sparkles, AlertTriangle, Link as LinkIcon, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import _ from 'lodash';

import Container from '@/components/shared/Container';
import TiptapEditor from '@/components/forms/TiptapEditor';
import ImageUpload from '@/components/forms/ImageUpload';
import { articleSchema } from '@/lib/validations/article';
import ArticleService from '@/services/article.service';
import CategoryService from '@/services/category.service';

export default function PublishPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugParam = searchParams.get('slug'); // The slug from URL (edit mode)

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [originalSlug, setOriginalSlug] = useState(null); // To detect changes
  const [articleId, setArticleId] = useState(null);

  // Setup Form
  const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(articleSchema),
    defaultValues: { 
      title: '', 
      slug: '',
      summary: '', 
      content: '', 
      featuredImage: null,
      categories: [] // Array of IDs
    }
  });

  const currentSlug = useWatch({ control, name: 'slug' });
  const formValues = useWatch({ control });

  // 1. INITIAL LOAD: Fetch Categories & Handle Edit Mode
  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true);
        
        // A. Load Categories for the Selector
        const catData = await CategoryService.getAll();
        setCategories(catData.categories || []);

        // B. Handle Edit Mode
        if (slugParam) {
          const article = await ArticleService.getBySlug(slugParam);

          // SECURITY: Ownership Check
          if (article.author_id !== user?.id) {
            toast.error("⛔ Unauthorized Access: You can only edit your own articles.");
            return;
          }

          // Populate Form
          setArticleId(article.id);
          setOriginalSlug(article.slug);
          
          reset({
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            content: article.content,
            featuredImage: article.image_url, // URL string for preview
            categories: article.categories.map(c => c.id.toString()) // Map to array of IDs
          });
        } 
        // C. Handle Draft Mode (Local Storage)
        else {
          const savedDraft = localStorage.getItem('publisha_draft');
          if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            reset({ ...parsed, featuredImage: null }); // Don't restore files
            toast('Draft restored', { icon: '📂', position: 'bottom-right' });
          }
        }
      } catch (error) {
        console.error("Init failed", error);
        toast.error("Failed to load editor resources.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) initPage(); // Only run if user is loaded (or handle guest redirect elsewhere)
  }, [slugParam, user, reset, router]);


  // 2. AUTO-SAVE (Draft Mode Only)
  useEffect(() => {
    if (slugParam) return; // Disable local autosave in edit mode to prevent conflicts

    const saveToLocal = _.debounce((values) => {
      const { featuredImage, ...textData } = values; 
      if (textData.title || textData.content) {
        localStorage.setItem('publisha_draft', JSON.stringify(textData));
      }
    }, 1500);

    saveToLocal(formValues);
    return () => saveToLocal.cancel();
  }, [formValues, slugParam]);


  // 3. SUBMIT HANDLER (Create & Update)
  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please login to publish your story!", { icon: '🔒' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug); // Send the slug (new or updated)
      formData.append('summary', data.summary);
      formData.append('content', data.content);
      
      // Append Categories (as JSON string or individual fields depending on backend expectation)
      // Assuming backend expects: categories[0], categories[1]... OR a JSON string
      formData.append('categories', JSON.stringify(data.categories)); 

      // Image Handling: Only append if it's a generic File object
      if (data.featuredImage instanceof File) {
        formData.append('featuredImage', data.featuredImage);
      }

      if (articleId) {
        // --- UPDATE FLOW ---
        await ArticleService.update(articleId, formData);
        
        // Warning if slug changed
        if (originalSlug && data.slug !== originalSlug) {
          toast('Slug updated. Old links may be broken.', { icon: '⚠️', duration: 6000 });
        } else {
          toast.success('Article updated successfully!');
        }
      } else {
        // --- CREATE FLOW ---
        await ArticleService.create(formData);
        toast.success('Your story is live!');
        localStorage.removeItem('publisha_draft');
      }

      router.push('/portal/articles'); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Publication failed.');
    }
  };

  // Helper: Slug Generator
  const generateSlug = () => {
    const title = formValues.title || "";
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setValue('slug', slug, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="current" />
          <p className="text-muted-foreground font-serif animate-pulse">Setting up your studio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans pb-24">
      
      {/* 1. STICKY NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border/50 transition-all">
        <Container>
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-blue" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {articleId ? "Editing Article" : "New Story"}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Button 
                type="submit" 
                form="article-form" 
                isLoading={isSubmitting}
                radius="full"
                className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-8 h-11 shadow-md hover:bg-brand-blue hover:text-white transition-colors"
                endContent={!isSubmitting && <Send size={14} />}
              >
                {articleId ? "Update Changes" : "Publish Now"}
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      <Container>
        <div className="py-10 lg:py-16 flex flex-col lg:flex-row gap-16">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: EDITOR CONTENT                                       */}
          {/* ================================================================= */}
          <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-[65%]">
            
            {/* Title */}
            <div className="mb-8">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={1}
                    className="w-full bg-transparent text-5xl lg:text-6xl font-serif font-bold placeholder:text-muted-foreground/30 outline-none border-none resize-none overflow-hidden leading-[1.15]"
                    placeholder="Title your masterpiece..."
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                )}
              />
              {errors.title && <p className="text-danger text-xs font-bold mt-2 uppercase">{errors.title.message}</p>}
            </div>

            {/* Author Meta */}
            <div className="flex items-center gap-6 mb-10 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <Avatar 
                  src={user?.avatar_url} 
                  name={user?.name || "U"} 
                  className="w-10 h-10 border border-border" 
                />
                <div>
                  <p className="text-sm text-foreground font-medium">{user?.name}</p>
                  <p className="italic text-[10px]">{articleId ? "Updating..." : "Drafting..."}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-border" />
              <p className="font-medium uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Featured Image */}
            <div className="mb-12 group">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 group-hover:text-brand-blue transition-colors">
                Cover Image
              </label>
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <div className="rounded-xl overflow-hidden border-2 border-dashed border-border group-hover:border-brand-blue/50 transition-colors bg-card">
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.featuredImage && <p className="text-danger text-xs font-bold mt-2 uppercase">{errors.featuredImage.message}</p>}
            </div>

            {/* Editor */}
            <article className="prose prose-stone dark:prose-invert max-w-none">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TiptapEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.content && <p className="text-danger text-xs font-bold mt-4 uppercase">{errors.content.message}</p>}
            </article>
          </form>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: SETTINGS SIDEBAR                                    */}
          {/* ================================================================= */}
          <aside className="w-full lg:w-[35%] flex flex-col gap-8">
            
            {/* 1. PUBLISHING SETTINGS */}
            <div className="bg-card p-6 border border-border rounded-xl shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-brand-mint" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Publishing Details
                </h3>
              </div>

              {/* Category Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block">Categories</label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectionMode="multiple"
                      placeholder="Select topics"
                      selectedKeys={new Set(field.value)}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                      classNames={{ 
                        trigger: "bg-background border border-border min-h-12",
                        value: "text-foreground text-sm"
                      }}
                    >
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} textValue={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>

              {/* Slug Manager */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">URL Slug</label>
                  {!articleId && (
                    <button onClick={generateSlug} type="button" className="text-[10px] font-bold text-brand-blue hover:underline">
                      Auto-generate
                    </button>
                  )}
                </div>
                
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      startContent={<span className="text-muted-foreground/50 text-xs">/articles/</span>}
                      placeholder="my-article-url"
                      classNames={{ inputWrapper: "bg-background border border-border h-12" }}
                    />
                  )}
                />
                
                {/* SLUG WARNING: Only show if editing AND slug has changed */}
                {articleId && currentSlug !== originalSlug && (
                  <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700 leading-snug">
                      <strong>Warning:</strong> Changing the slug will break existing links shared on social media.
                    </p>
                  </div>
                )}
                {errors.slug && <p className="text-danger text-xs font-bold mt-2">{errors.slug.message}</p>}
              </div>
            </div>

            {/* 2. SEO SUMMARY */}
            <div className="bg-card p-6 border border-border rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-brand-blue" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  SEO Summary
                </h3>
              </div>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full bg-background border border-border p-4 text-sm text-foreground leading-relaxed outline-none focus:border-brand-blue transition-colors rounded-lg min-h-[120px] resize-none"
                    placeholder="Write a hook..."
                  />
                )}
              />
              <p className="text-[10px] text-muted-foreground mt-3 text-right">
                {formValues.summary?.length || 0}/200
              </p>
            </div>

          </aside>
        </div>
      </Container>
    </main>
  );
}