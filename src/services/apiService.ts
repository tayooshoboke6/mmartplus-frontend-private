import apiClient, { apiRequest, endpoints, ApiResponse } from '../utils/apiClient';
import { AxiosRequestConfig } from 'axios';

/**
 * Generic API Service that provides typed methods for all API operations
 */
class ApiService {
  /**
   * Generic GET request
   * @param endpoint API endpoint
   * @param params Query parameters
   * @param errorMessage Custom error message
   */
  async get<T>(
    endpoint: string, 
    params: Record<string, any> = {}, 
    errorMessage: string = 'Failed to fetch data'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: endpoint,
      params
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param errorMessage Custom error message
   */
  async post<T>(
    endpoint: string, 
    data: any = {}, 
    errorMessage: string = 'Failed to submit data'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: endpoint,
      data
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param errorMessage Custom error message
   */
  async put<T>(
    endpoint: string, 
    data: any = {}, 
    errorMessage: string = 'Failed to update data'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: endpoint,
      data
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Generic PATCH request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param errorMessage Custom error message
   */
  async patch<T>(
    endpoint: string, 
    data: any = {}, 
    errorMessage: string = 'Failed to update data'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'PATCH',
      url: endpoint,
      data
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint
   * @param params Query parameters
   * @param errorMessage Custom error message
   */
  async delete<T>(
    endpoint: string, 
    params: Record<string, any> = {}, 
    errorMessage: string = 'Failed to delete data'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: endpoint,
      params
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Upload file(s) with FormData
   * @param endpoint API endpoint
   * @param formData FormData object containing files and other form fields
   * @param errorMessage Custom error message
   */
  async upload<T>(
    endpoint: string, 
    formData: FormData, 
    errorMessage: string = 'Failed to upload file'
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    return apiRequest<T>(config, errorMessage);
  }

  /**
   * Download file
   * @param endpoint API endpoint
   * @param params Query parameters
   * @param filename Name to save the file as
   * @param errorMessage Custom error message
   */
  async download(
    endpoint: string, 
    params: Record<string, any> = {}, 
    filename?: string,
    errorMessage: string = 'Failed to download file'
  ): Promise<Blob> {
    try {
      const response = await apiClient({
        method: 'GET',
        url: endpoint,
        params,
        responseType: 'blob'
      });
      
      // If filename is provided, trigger download
      if (filename) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Download error:', error);
      throw new Error(errorMessage);
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

export { endpoints };
export default apiService;
