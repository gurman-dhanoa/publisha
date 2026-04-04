"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Textarea, Spinner, Card, CardBody, Avatar } from "@heroui/react";
import { Save, Trash2, GripVertical, ArrowLeft, Layers, Search, Plus, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

// Dnd-kit imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import CollectionService from "@/services/collection.service";
import AuthorService from "@/services/author.service";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { decodeId } from "@/lib/hashids";

export default function CollectionBuilderPage() {
  const params = useParams();
  const id = params.id === "new" ? params.id : decodeId(params.id);
  const router = useRouter();
  const { user } = useAuth();
  
  const isNew = id === "new";

  // Page States
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [articles, setArticles] = useState([]); // Currently in collection

  // Search/Add States
  const [allAuthorArticles, setAllAuthorArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // --- SENSORS FOR DND ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- DATA FETCHING ---
  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. Fetch all author articles for the "Add" section
        if (user?.id) {
          const authorData = await AuthorService.getArticles(user.id, { limit: 10 }); 
          setAllAuthorArticles(authorData.articles || []);
        }

        // 2. If Editing, fetch collection data
        if (!isNew) {
          const colData = await CollectionService.getById(id);
          setName(colData.name || "");
          setDescription(colData.description || "");
          setArticles(colData.articles || []);
        }
      } catch (error) {
        toast.error("Failed to load series workspace.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [id, isNew, user]);


  // --- DYNAMIC COVER IMAGE (Article 1) ---
  const dynamicCoverImage = articles.length > 0 ? articles[0].image_url : null;


  // --- HANDLERS ---
  const handleAddArticle = (article) => {
    setArticles([...articles, article]);
    toast.success("Added to series queue.", { icon: "➕", duration: 2000 });
  };

  const handleRemoveArticle = (articleId) => {
    setArticles(articles.filter(a => a.id !== articleId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setArticles((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) return toast.error("Series name is required.");
    
    // BUSINESS RULE: Prevent 0 articles
    if (articles.length === 0) {
      return toast.error("A series must contain at least one article.");
    }
    
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        article_ids: articles.map(a => a.id),
      };

      if (isNew) {
        await CollectionService.create(payload);
        toast.success("Series created successfully!", { icon: "🎉" });
      } else {
        await CollectionService.update(id, payload);
        toast.success("Series updated successfully!", { icon: "✨" });
      }
      
      router.push("/portal/collections");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save series.");
    } finally {
      setSaving(false);
    }
  };

  // --- FILTER AVAILABLE ARTICLES ---
  // Exclude articles already in the collection and match search query
  const availableArticles = useMemo(() => {
    return allAuthorArticles.filter(a => {
      const notInCollection = !articles.some(ca => ca.id === a.id);
      const matchesSearch = a.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      return notInCollection && matchesSearch;
    });
  }, [allAuthorArticles, articles, debouncedSearch]);


  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground animate-pulse">Initializing Builder</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-12">
      
      {/* HEADER & STICKY SAVE BAR */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => router.push("/portal/collections")}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back to Series
          </button>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {isNew ? "Create New Series" : "Edit Series"}
          </h3>
        </div>
        <Button 
          onPress={handleSaveChanges}
          isLoading={saving}
          size="md" 
          className="bg-brand-blue text-white font-bold text-xs uppercase tracking-widest shadow-md hover:opacity-90 px-8"
          startContent={!saving && <Save size={16}/>} 
        >
          {isNew ? "Publish Series" : "Save Changes"}
        </Button>
      </div>

      {/* FULL WIDTH LAYOUT */}
      <div className="space-y-12">
        
        {/* SECTION 1: METADATA & COVER PREVIEW */}
        <section className="bg-card p-6 sm:p-8 border border-border rounded-2xl shadow-sm space-y-8">
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-blue flex items-center gap-2">
            <Layers size={14} /> Series Details
          </h4>
          
          {/* Dynamic Cover Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Generated Cover Image
            </label>
            <div className="relative w-full h-48 sm:h-64 bg-muted rounded-xl border border-border overflow-hidden">
              {dynamicCoverImage ? (
                <>
                  <Image src={dynamicCoverImage} alt="Cover" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium opacity-80">Derived from 1st article</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                  <ImageIcon size={40} className="mb-2" />
                  <p className="text-sm font-serif">Add an article to generate cover</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Input 
              label="Series Name" 
              labelPlacement="outside" 
              placeholder="e.g. Masterclass: Cloud Native Security"
              value={name}
              onChange={(e) => setName(e.target.value)}
              classNames={{ inputWrapper: "bg-background border border-border shadow-sm h-14" }}
            />
            
            <Textarea 
              label="Description" 
              labelPlacement="outside"
              placeholder="Write a compelling summary of what readers will learn in this series..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={4}
              classNames={{ inputWrapper: "bg-background border border-border shadow-sm" }}
            />
          </div>
        </section>


        {/* SECTION 2: CURATED ARTICLES (DRAG & DROP) */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/50 pb-4">
            <div>
              <h4 className="text-lg font-serif font-bold text-foreground">Curated Articles ({articles.length})</h4>
              <p className="text-xs text-muted-foreground mt-1">Drag handles to reorder. The top article defines the series cover.</p>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card">
              <p className="text-danger font-bold text-sm uppercase tracking-widest mb-2">Empty Series</p>
              <p className="text-muted-foreground font-serif">Search and add articles from the section below.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={articles.map(a => a.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {articles.map((article, index) => (
                    <SortableArticleItem 
                      key={article.id} 
                      article={article} 
                      index={index}
                      onRemove={() => handleRemoveArticle(article.id)} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>


        {/* SECTION 3: SEARCH & ADD ARTICLES */}
        <section className="bg-muted/30 p-6 sm:p-8 border border-border rounded-2xl">
          <div className="mb-6">
            <h4 className="text-lg font-serif font-bold text-foreground mb-4">Add to Series</h4>
            <Input 
              placeholder="Search your published or drafted articles..."
              startContent={<Search size={16} className="text-muted-foreground" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              classNames={{ inputWrapper: "bg-background border border-border shadow-sm h-12" }}
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {availableArticles.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm font-serif italic">
                {searchQuery ? "No matching articles found." : "All available articles have been added."}
              </div>
            ) : (
              availableArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-brand-blue/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar radius="md" src={article.image_url} className="w-10 h-10 shrink-0 bg-muted border border-border" />
                    <div className="flex-1 min-w-0 pr-4">
                      <h5 className="text-sm font-bold text-foreground line-clamp-1">{article.title}</h5>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">
                        {article.status} • {article.views_count} Views
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="flat" 
                    className="bg-brand-blue/10 text-brand-blue font-bold text-[10px] uppercase tracking-widest shrink-0"
                    onClick={() => handleAddArticle(article)}
                    startContent={<Plus size={14} />}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}


// --- SUb-COMPONENT: Sortable Item ---
const SortableArticleItem = ({ article, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`bg-card border transition-colors ${isDragging ? 'border-brand-blue shadow-xl' : 'border-border shadow-sm hover:border-foreground/20'}`}>
        <CardBody className="p-4 flex flex-row items-center gap-4">
          
          <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 shrink-0">
            <GripVertical size={18} />
          </button>

          <div className="relative shrink-0">
            <Avatar radius="md" src={article.image_url} className="w-12 h-12 bg-muted border border-border" />
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-brand-mint text-brand-blue text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm">
                Cover
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-bold text-foreground line-clamp-1">{article.title}</h5>
            <div className="flex items-center gap-3 mt-1 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <span>{article.status}</span>
            </div>
          </div>

          <Button 
            isIconOnly size="sm" variant="light" color="danger" 
            className="shrink-0 opacity-50 hover:opacity-100 bg-danger/5"
            onClick={onRemove}
            title="Remove from Series"
          >
            <Trash2 size={16} />
          </Button>

        </CardBody>
      </Card>
    </div>
  );
};