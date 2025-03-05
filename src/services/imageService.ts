import api from './api';

// Interface for image upload response
export interface UploadResponse {
  success: boolean;
  url: string;
  public_id?: string;
  message?: string;
}

/**
 * Image service for compressing and uploading images to Cloudinary
 */
const imageService = {
  /**
   * Compresses an image file and returns a compressed File object
   * @param file Original image file
   * @param maxWidth Maximum width for the compressed image
   * @param maxHeight Maximum height for the compressed image
   * @param quality Compression quality (0 to 1)
   * @returns Promise resolving to compressed File object
   */
  compressImage: async (
    file: File, 
    maxWidth = 1200, 
    maxHeight = 1200, 
    quality = 0.7
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Check if the file is an image
      if (!file.type.match(/image.*/)) {
        reject(new Error('File is not an image'));
        return;
      }

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // Create an image element to load the file data
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Create a canvas to draw the resized image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round(height * maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round(width * maxHeight / height);
              height = maxHeight;
            }
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw the resized image to the canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to Blob/File
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Could not create blob from canvas'));
              return;
            }
            
            // Create a new File object from the blob
            const compressedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg', // Force JPEG for better compression
                lastModified: Date.now() 
              }
            );
            
            console.log(`Compressed image from ${(file.size / 1024).toFixed(2)}KB to ${(compressedFile.size / 1024).toFixed(2)}KB`);
            resolve(compressedFile);
          }, 'image/jpeg', quality);
        };
        
        img.onerror = () => {
          reject(new Error('Error loading image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
    });
  },
  
  /**
   * Uploads an image to Cloudinary after compressing it
   * @param file Image file to upload
   * @param folder Cloudinary folder to store the image in
   * @returns Promise resolving to upload response
   */
  uploadImage: async (file: File, folder = 'general'): Promise<UploadResponse> => {
    try {
      // First compress the image
      const compressedFile = await imageService.compressImage(file);
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', folder);
      
      // Make the API call to the backend, which will handle the Cloudinary upload
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        url: '',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Uploads a profile picture to Cloudinary after compressing it
   * @param file Image file to upload
   * @returns Promise resolving to upload response
   */
  uploadProfilePicture: async (file: File): Promise<UploadResponse> => {
    // Profile pictures get higher compression and smaller size
    try {
      // More aggressive compression for profile pictures (smaller dimensions, higher compression)
      const compressedFile = await imageService.compressImage(file, 500, 500, 0.6);
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', 'profiles');
      
      const response = await api.post<UploadResponse>('/upload/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return {
        success: false,
        url: '',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Uploads a product image to Cloudinary after compressing it
   * @param file Image file to upload
   * @returns Promise resolving to upload response
   */
  uploadProductImage: async (file: File): Promise<UploadResponse> => {
    try {
      // Product images need higher quality but still compressed
      const compressedFile = await imageService.compressImage(file, 1000, 1000, 0.8);
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', 'products');
      
      const response = await api.post<UploadResponse>('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading product image:', error);
      return {
        success: false,
        url: '',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Uploads a category image to Cloudinary after compressing it
   * @param file Image file to upload
   * @returns Promise resolving to upload response
   */
  uploadCategoryImage: async (file: File): Promise<UploadResponse> => {
    try {
      // Category images are wider than they are tall (800x400)
      const compressedFile = await imageService.compressImage(file, 800, 400, 0.7);
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', 'categories');
      
      const response = await api.post<UploadResponse>('/upload/category', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading category image:', error);
      return {
        success: false,
        url: '',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Converts a data URL to a File object
   * @param dataUrl Data URL string
   * @param filename Filename to use for the File
   * @returns File object
   */
  dataURLtoFile: (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }
};

export default imageService;
