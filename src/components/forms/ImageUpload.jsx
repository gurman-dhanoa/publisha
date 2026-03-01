'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@heroui/react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const ImageUpload = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null);

  // Sync preview with value prop (handles both initial load and updates)
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    // Case 1: Value is a URL string (from API/Database)
    if (typeof value === 'string') {
      setPreview(value);
    } 
    // Case 2: Value is a File object (New upload)
    else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup function to revoke URL when value changes or component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange(file); // Pass the File object back to the parent form
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    maxFiles: 1
  });

  if (preview) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] group rounded-xl overflow-hidden bg-gray-100">
        <Image 
          src={preview} 
          alt="Featured Preview" 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          // If using external URLs (like S3/Unsplash), ensure domains are allowed in next.config.js
          // Or use unoptimized={true} if you haven't configured them yet
          unoptimized={typeof value === 'string'} 
        />
        
        {/* Overlay Gradient for readability if you add text later */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <Button 
          isIconOnly 
          color="danger" 
          variant="flat"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-md bg-black/30 text-white"
          onPress={() => { 
            onChange(null); 
            setPreview(null); 
          }}
        >
          <X size={18} />
        </Button>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-xl h-[300px] 
        flex flex-col items-center justify-center cursor-pointer 
        transition-all duration-300 gap-4 group
        ${isDragActive 
          ? 'border-brand-blue bg-brand-blue/5 scale-[0.99]' 
          : 'border-border hover:border-brand-blue/50 hover:bg-card'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className={`
        p-4 rounded-full transition-colors duration-300
        ${isDragActive ? 'bg-brand-blue/10 text-brand-blue' : 'bg-muted text-muted-foreground group-hover:text-brand-blue group-hover:bg-brand-blue/10'}
      `}>
        {isDragActive ? <ImageIcon size={32} /> : <Camera size={32} />}
      </div>
      
      <div className="text-center space-y-1">
        <p className="text-foreground font-medium text-sm">
          {isDragActive ? "Drop image here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          SVG, PNG, JPG or WebP (max. 5MB)
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;