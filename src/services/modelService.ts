import api from './api';

// Interface for 3D model upload response
export interface Model3DUploadResponse {
  success: boolean;
  model_url?: string;
  public_id?: string;
  front_view?: string;
  angle_view?: string;
  animated_view?: string;
  message?: string;
}

// Styles available for AI generation
export type ModelGenerationStyle = 
  | 'modern' 
  | 'vintage' 
  | 'minimalist' 
  | 'futuristic' 
  | 'abstract' 
  | 'realistic' 
  | 'cartoon';

// Interface for generation parameters
export interface ModelGenerationParams {
  name: string;
  style?: ModelGenerationStyle | string;
}

/**
 * Service for handling 3D model uploads and transformations
 */
const modelService = {
  /**
   * Uploads a 3D model file to Cloudinary for category visualization
   * @param file 3D model file (GLB, GLTF, or ZIP)
   * @param name Name for the model (will be used as part of the file name)
   * @returns Promise resolving to upload response
   */
  uploadCategoryModel: async (file: File, name: string): Promise<Model3DUploadResponse> => {
    try {
      // Check if the file is a supported 3D model format
      const validExtensions = ['glb', 'gltf', 'zip'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!validExtensions.includes(fileExtension)) {
        return {
          success: false,
          message: 'Unsupported file format. Please upload a GLB, GLTF, or ZIP file.'
        };
      }
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('model', file);
      formData.append('name', name);
      
      // Make the API call to the backend
      const response = await api.post<Model3DUploadResponse>('/api/upload/category-3d', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading 3D model:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Generate a 3D model from a text prompt (category name) using AI
   * @param params Generation parameters (name and optional style)
   * @returns Promise resolving to generation response
   */
  generateCategoryModel: async (params: ModelGenerationParams): Promise<Model3DUploadResponse> => {
    try {
      // Make the API call to generate a 3D model from text
      const response = await api.post<Model3DUploadResponse>('/api/generate/category-3d', params);
      
      return response.data;
    } catch (error) {
      console.error('Error generating 3D model:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Generate a 3D model from an existing image by uploading it and processing
   * @param file Image file to convert to 3D
   * @param name Name for the model
   * @returns Promise resolving to generation response
   */
  generateModelFromImage: async (file: File, name: string): Promise<Model3DUploadResponse> => {
    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', name);
      
      // Upload the image and convert it to 3D via Cloudinary
      const response = await api.post<Model3DUploadResponse>('/api/upload/category-3d', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error converting image to 3D model:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },
  
  /**
   * Get a URL for previewing a 3D model directly in the browser
   * @param publicId Cloudinary public ID for the 3D model
   * @param format Optional format override
   * @returns Direct URL to the 3D model file
   */
  getModelPreviewUrl: (publicId: string, format?: string): string => {
    const baseUrl = 'https://res.cloudinary.com/djr1es4yi/raw/upload/';
    return `${baseUrl}/${publicId}${format ? `.${format}` : ''}`;
  }
};

export default modelService;
