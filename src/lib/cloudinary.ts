import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  },
  url: {
    secure: true,
  },
});

// Get optimized image URL
export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number) => {
  if (!publicId) return '';
  
  let image = cld.image(publicId);
  
  if (width && height) {
    image = image.resize(fill().width(width).height(height));
  } else if (width) {
    image = image.resize(fill().width(width));
  }
  
  return image.toURL();
};

// Get optimized video URL
export const getOptimizedVideoUrl = (publicId: string) => {
  if (!publicId) return '';
  return cld.video(publicId).toURL();
};

// Upload image to Cloudinary via backend API
export const uploadImage = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }

  const data = await response.json();
  return { url: data.url, publicId: data.publicId };
};

// Upload video to Cloudinary via backend API
export const uploadVideo = async (file: File): Promise<{ url: string; publicId: string; duration?: number }> => {
  const formData = new FormData();
  formData.append('video', file);

  const token = localStorage.getItem('token');
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload video');
  }

  const data = await response.json();
  return { url: data.url, publicId: data.publicId, duration: data.duration };
};

// Delete media from Cloudinary
export const deleteMedia = async (publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/upload/${publicId}?resourceType=${resourceType}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete media');
  }
};

export default cld;
