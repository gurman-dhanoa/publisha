"use client";

import React, { useState, useEffect } from "react";
import { Avatar, Button, Textarea, Divider, Skeleton, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Star, MoreVertical, Edit3, Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import ReviewService from "@/services/review.service";
import AuthModal from "@/components/modal/AuthModal"; // Adjust path as needed

export default function ReviewSection({ articleId, articleAuthorId }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await ReviewService.getByArticle(articleId);
      console.log("response of review  api", res);
      setReviews(res.data);
      setSummary(res.summary);
      setUserReview(res.user_review);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) fetchReviews();
  }, [articleId, user]);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write a comment.");

    setIsSubmitting(true);
    try {
      if (editingId) {
        await ReviewService.update(editingId, { comment, rating });
        toast.success("Review updated!");
        setEditingId(null);
      } else {
        await ReviewService.create({ article_id: articleId, comment, rating });
        toast.success("Review published!");
      }
      setComment("");
      setRating(0);
      fetchReviews(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.error || "Action failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await ReviewService.delete(id);
      toast.success("Review deleted.");
      fetchReviews(); // Refresh list
    } catch (error) {
      toast.error("Failed to delete review.");
    }
  };

  const startEditing = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to form smoothly
    document.getElementById("review-form-area").scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRating(0);
    setComment("");
  };

  // --- BUSINESS LOGIC FLAGS ---
  const isAuthor = user?.id === articleAuthorId;
  const hasReviewed = !!userReview && !editingId;
  const canWriteReview = isAuthenticated && !isAuthor && !hasReviewed;

  if (loading) return <ReviewSkeleton />;

  return (
    <section className="py-12 border-t border-border mt-16" id="review-form-area">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* LEFT: SUMMARY & FORM */}
        <div className="w-full md:w-1/3 sticky top-28">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Reader Reviews</h2>
          
          {summary?.total > 0 ? (
            <div className="bg-card border border-border p-6 mb-8 rounded-none">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-serif font-bold">{summary.average}</span>
                <div className="flex flex-col">
                  <StarDisplay rating={Math.round(summary.average)} />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Based on {summary.total} reviews</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic mb-8 font-serif">Be the first to share your thoughts.</p>
          )}

          {/* DYNAMIC FORM AREA */}
          <div className="bg-muted/30 p-6 border border-border/50">
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <MessageSquare size={24} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-foreground font-medium mb-4">Join the conversation</p>
                <AuthModal buttonText="Log in to Review" />
              </div>
            ) : isAuthor ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">Authors cannot review their own articles.</p>
            ) : hasReviewed ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star size={20} fill="currentColor" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest">You reviewed this</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Thank you for your feedback!</p>
                <Button size="sm" variant="bordered" onClick={() => startEditing(userReview)} className="border-border uppercase font-bold text-[10px] tracking-widest">
                  Edit Review
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-foreground">
                  {editingId ? "Update your review" : "Write a review"}
                </h4>
                
                {/* Interactive Star Rating */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoverRating || rating) ? "text-brand-blue fill-brand-blue" : "text-border"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="What did you think of this article?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  classNames={{ inputWrapper: "bg-background border border-border shadow-sm min-h-[120px]" }}
                />

                <div className="flex gap-3">
                  <Button 
                    isLoading={isSubmitting} 
                    onClick={handleSubmit}
                    className="bg-foreground text-background font-bold text-[10px] uppercase tracking-widest flex-1"
                  >
                    {editingId ? "Update" : "Publish"}
                  </Button>
                  {editingId && (
                    <Button variant="bordered" onClick={cancelEdit} className="border-border font-bold text-[10px] uppercase tracking-widest">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: REVIEWS LIST */}
        <div className="w-full md:w-2/3">
          {reviews?.length === 0 ? (
             <div className="py-20 flex flex-col items-center justify-center border border-dashed border-border/50 text-center">
                <MessageSquare size={32} className="text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-serif text-lg">No reviews yet.</p>
             </div>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((review) => (
                <div key={review.id} className={`p-6 border ${review.author_id === user?.id ? 'border-brand-blue/30 bg-brand-blue/5' : 'border-border bg-card'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar src={review.author_avatar} name={review.author_name} className="w-10 h-10 border border-border" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{review.author_name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          {dayjs(review.created_at).format('MMM DD, YYYY')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <StarDisplay rating={review.rating} size={14} />
                      
                      {/* Actions for the review owner */}
                      {user?.id === review.author_id && (
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1"><MoreVertical size={16}/></button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Review Actions" variant="flat">
                            <DropdownItem key="edit" startContent={<Edit3 size={14}/>} onPress={() => startEditing(review)}>
                              Edit Review
                            </DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={14}/>} onPress={() => handleDelete(review.id)}>
                              Delete Review
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

// Helper Components
const StarDisplay = ({ rating, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={size} className={star <= rating ? "text-brand-blue fill-brand-blue" : "text-border fill-muted"} />
    ))}
  </div>
);

const ReviewSkeleton = () => (
  <div className="py-12 border-t border-border mt-16 flex flex-col md:flex-row gap-12">
    <div className="w-full md:w-1/3 space-y-6">
      <Skeleton className="w-48 h-8" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-48" />
    </div>
    <div className="w-full md:w-2/3 space-y-6">
      {[1, 2].map(i => <Skeleton key={i} className="w-full h-40" />)}
    </div>
  </div>
);