"use client";

import React, { useState } from "react";
import { Send, Check, Share2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ShareButton({ title, summary, slug, image, size = 20, className = "" }) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Helper: Convert URL to File Object
  const urlToFile = async (url, filename, mimeType) => {
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return new File([buf], filename, { type: mimeType });
    } catch (error) {
      console.warn("Image fetch failed (likely CORS), falling back to link share.", error);
      return null;
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharing(true);

    const url = `${window.location.origin}/articles/${slug}`;
    const shareText = summary 
      ? `Check out "${title}" - ${summary}` 
      : `Check out this article: ${title}`;

    // Base Share Data
    let shareData = {
      title: title || "Publisha Article",
      text: shareText,
      url: url,
    };

    try {
      // 1. Try to fetch image and attach it if native share supports it
      if (image && navigator.share) {
        const file = await urlToFile(image, "article-cover.jpg", "image/jpeg");
        
        // Check if browser allows file sharing
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
          shareData = {
            ...shareData,
            files: [file],
          };
        }
      }

      // 2. Trigger Native Share
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 3. Desktop Fallback (Clipboard)
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed/cancelled", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`group flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none ${className}`}
      aria-label="Share article"
      title="Share this story"
    >
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {isSharing ? (
             <motion.div
              key="loading"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Loader2 size={size} className="animate-spin text-brand-blue" />
            </motion.div>
          ) : copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check size={size} className="text-green-500" strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div
              key="send"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              {/* Using Share2 for clear intent */}
              <Share2 
                size={size} 
                strokeWidth={1.5} 
                className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}