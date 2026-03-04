import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input, Textarea, Button, Avatar, Select, SelectItem, Spinner } from "@heroui/react";
import { Save, Camera, Lock, CheckCircle2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import AuthorService from "@/services/author.service";
import CategoryService from "@/services/category.service";
import api from "@/lib/axios";

// --- VALIDATION SCHEMA ---
const profileSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long").required("Name is required"),
  bio: yup.string().max(500, "Bio cannot exceed 500 characters").nullable(),
  avatar_url: yup.string().url("Must be a valid URL").nullable(),
  preferred_categories: yup.array().of(yup.number()),
  // Password is only validated if the user enters something
  password: yup.string().transform((curr, orig) => orig === "" ? undefined : curr)
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .optional()
});

export default function SettingsTab({ profile }) {
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- FORM SETUP ---
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      // Map existing category objects to an array of string IDs for the Select component
      preferred_categories: profile?.preferred_categories?.map(c => c.id.toString()) || [],
      password: ""
    }
  });

  const currentAvatarUrl = watch("avatar_url");

  // --- FETCH CATEGORIES ---
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  // --- AVATAR UPLOAD HANDLER ---
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("featuredImage", file); // Reusing your existing S3 upload logic

      // Assuming you have a generic upload endpoint. Adjust the URL if needed.
      const res = await api.post("/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      }); 
      
      // Update form state with the new S3 URL
      setValue("avatar_url", res.data.url, { shouldDirty: true, shouldValidate: true });
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- SUBMIT HANDLER ---
  const onSubmit = async (data) => {
    try {
      // 1. Clean payload
      const payload = {
        name: data.name,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        // Convert string IDs back to numbers for backend: ["1", "3"] -> [1, 3]
        preferred_categories: data.preferred_categories.map(id => Number(id))
      };

      // Only include password if user typed a new one
      if (data.password) {
        payload.password = data.password;
      }

      // 2. API Call
      await AuthorService.updateProfile(profile.id, payload);
      
      toast.success("Profile updated successfully!", { icon: "✨" });
      
      // Optional: If password was changed, clear the field
      if (data.password) setValue("password", "");
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update profile.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <h3 className="text-2xl font-serif font-bold border-b border-border/50 pb-4">Profile Settings</h3>
        
        {/* AVATAR SECTION */}
        <div className="flex items-center gap-6 p-6 bg-card border border-border rounded-xl shadow-sm">
          <div className="relative group cursor-pointer">
            <Avatar 
              src={currentAvatarUrl} 
              name={watch("name")} 
              className="w-24 h-24 text-2xl ring-4 ring-background shadow-md transition-opacity group-hover:opacity-50" 
            />
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                <Spinner size="sm" color="current" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-foreground drop-shadow-md" />
              </div>
            )}
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Profile Picture</h4>
            <p className="text-xs text-muted-foreground mt-1">Click the avatar to upload a new image. Recommended size: 400x400px.</p>
            {errors.avatar_url && <p className="text-danger text-xs font-bold mt-2">{errors.avatar_url.message}</p>}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field}
                  label="Display Name" 
                  labelPlacement="outside" 
                  placeholder="e.g. Gurman Singh"
                  classNames={{ inputWrapper: "bg-background border border-border shadow-sm" }}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                />
              )}
            />
          </div>
          <div>
            <Input 
              label="Email Address" 
              defaultValue={profile?.email || ""} 
              isDisabled 
              labelPlacement="outside" 
              description="Email cannot be changed directly."
              classNames={{ inputWrapper: "bg-muted border border-border opacity-70" }}
            />
          </div>
        </div>

        {/* BIO */}
        <div>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea 
                {...field}
                label="Biography" 
                labelPlacement="outside"
                placeholder="Tell the readers about your journey and expertise..."
                classNames={{ inputWrapper: "bg-background border border-border shadow-sm min-h-[100px]" }}
                isInvalid={!!errors.bio}
                errorMessage={errors.bio?.message}
              />
            )}
          />
        </div>

        {/* PREFERRED CATEGORIES */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Preferred Topics</label>
          <Controller
            name="preferred_categories"
            control={control}
            render={({ field }) => (
              <Select
                selectionMode="multiple"
                placeholder="Select the topics you usually write about"
                selectedKeys={new Set(field.value)}
                onSelectionChange={(keys) => field.onChange(Array.from(keys))}
                classNames={{ 
                  trigger: "bg-background border border-border shadow-sm min-h-12",
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
          <p className="text-xs text-muted-foreground mt-2">These categories help us recommend your profile to interested readers.</p>
        </div>

        {/* SECURITY */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-muted-foreground" />
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Security</h4>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                type="password"
                label="New Password" 
                labelPlacement="outside" 
                placeholder="Leave blank to keep current password"
                classNames={{ inputWrapper: "bg-background border border-border shadow-sm" }}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            )}
          />
        </div>

        {/* SUBMIT */}
        <div className="pt-6 flex items-center gap-4">
          <Button 
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isDirty}
            className={`font-bold uppercase tracking-widest text-xs px-8 h-12 shadow-md transition-all ${
              isDirty ? "bg-brand-blue text-white hover:opacity-90" : "bg-muted text-muted-foreground"
            }`} 
            startContent={!isSubmitting && (isDirty ? <Save size={16}/> : <CheckCircle2 size={16}/>)}
          >
            {isDirty ? "Save Changes" : "Up to date"}
          </Button>
          {isDirty && <span className="text-xs text-muted-foreground font-medium animate-pulse">Unsaved changes</span>}
        </div>

      </form>
    </motion.div>
  );
}