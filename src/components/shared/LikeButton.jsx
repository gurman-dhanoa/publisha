"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import LikeService from "@/services/like.service";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have this hook

export default function LikeButton({ articleId, initialCount = 0, initialLiked = false, size = 20, showCount = true }) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync with prop updates or fetch status on mount if needed
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleToggle = async (e) => {
    e.preventDefault(); // Prevent link navigation if inside a card link
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to like articles");
      return;
    }

    // Optimistic Update
    const previousLiked = liked;
    const previousCount = count;
    
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setIsAnimating(true);

    try {
      await LikeService.toggle(articleId);
    } catch (error) {
      // Revert on failure
      setLiked(previousLiked);
      setCount(previousCount);
      console.error("Like failed", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className="group flex items-center gap-2 text-muted-foreground hover:text-danger transition-colors focus:outline-none"
    >
      <div className="relative">
        <motion.div
          animate={isAnimating ? { scale: [1, 1.5, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            strokeWidth={1.5} 
            size={size} 
            className={`transition-all duration-300 ${liked ? "fill-danger text-danger" : "group-hover:text-danger"}`}
          />
        </motion.div>
        
        {/* Floating particles animation effect */}
        <AnimatePresence>
          {isAnimating && liked && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1, 
                    x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 10 + 5), 
                    y: - (Math.random() * 15 + 10) 
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-danger"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
      
      {showCount && (
        <span className={`text-sm tabular-nums transition-colors ${liked ? "text-danger font-medium" : ""}`}>
          {count}
        </span>
      )}
    </button>
  );
}