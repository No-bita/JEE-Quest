
import React, { useState } from 'react';
import { imageUrlPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface imageUrlUploaderProps {
  onimageUrlSelected: (imageUrl: string) => void;
  initialimageUrl?: string;
  className?: string;
}

const imageUrlUploader: React.FC<imageUrlUploaderProps> = ({ 
  onimageUrlSelected, 
  initialimageUrl,
  className = "" 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialimageUrl || null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real app, you'd upload this to your server or cloud storage
    // For the demo, we'll just convert it to a data URL
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreviewUrl(imageUrl);
      onimageUrlSelected(imageUrl);
    };
    
    reader.readAsDataURL(file);
  };
  
  const clearimageUrl = () => {
    setPreviewUrl(null);
    onimageUrlSelected('');
  };
  
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Uploaded preview" 
            className="max-w-full max-h-48 rounded-md object-contain" 
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-0 right-0 h-6 w-6" 
            onClick={clearimageUrl}
          >
            <X size={12} />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary/50 transition-colors">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <imageUrlPlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Upload imageUrl</span>
            <input 
              type="file" 
              accept="imageUrl/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default imageUrlUploader;
