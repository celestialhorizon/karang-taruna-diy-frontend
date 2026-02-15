import { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Image as ImageIcon, Video, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { authStorage } from '../../lib/auth';

interface MediaUploadProps {
  value: string;
  onChange: (url: string, publicId?: string) => void;
  label: string;
  accept?: string;
  type?: 'image' | 'video';
  placeholder?: string;
}

export function MediaUpload({
  value,
  onChange,
  label,
  accept,
  type = 'image',
  placeholder = 'https://example.com/image.jpg'
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 50MB');
      return;
    }

    // Validate file type
    if (type === 'image') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Hanya file gambar (JPEG, PNG, GIF, WebP) yang diizinkan');
        return;
      }
    } else {
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/avi', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Hanya file video (MP4, MOV, AVI, WebM) yang diizinkan');
        return;
      }
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append(type, file);

      const token = authStorage.getToken();
      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/upload/${type}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url, data.publicId);
      setPreview(data.url);
      toast.success(`${type === 'image' ? 'Gambar' : 'Video'} berhasil diupload!`);
    } catch (error: any) {
      toast.error(error.message || `Gagal upload ${type === 'image' ? 'gambar' : 'video'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange('', '');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={preview}
          onChange={handleUrlChange}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || (type === 'image' ? 'image/*' : 'video/*')}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : type === 'image' ? (
            <ImageIcon className="w-4 h-4" />
          ) : (
            <Video className="w-4 h-4" />
          )}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-2 border rounded-lg overflow-hidden">
          {type === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        {type === 'image' 
          ? 'Upload gambar (JPEG, PNG, GIF, WebP) maksimal 50MB atau masukkan URL'
          : 'Upload video (MP4, MOV, AVI, WebM) maksimal 50MB atau masukkan URL'
        }
      </p>
    </div>
  );
}
