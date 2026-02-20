import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@heroui/react'; // or your UI library
import { Camera, X } from 'lucide-react';
import Image from 'next/image';

const ImageUpload = ({ value, onChange }) => {
  const [preview, setPreview] = useState(value ? URL.createObjectURL(value) : null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    onChange(file);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  if (preview) {
    return (
      <div className="relative w-full h-[650px] group">
        <Image src={preview} height={800} width={4000} className="w-full h-full object-cover rounded-xl" alt="Preview" />
        <Button 
          isIconOnly 
          color="danger" 
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onPress={() => { setPreview(null); onChange(null); }}
        >
          <X size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl h-[300px] flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}>
      <input {...getInputProps()} />
      <Camera className="text-gray-400 mb-2" size={40} />
      <p className="text-gray-500 text-sm">Drag & drop your featured image, or click to browse</p>
    </div>
  );
};

export default ImageUpload;