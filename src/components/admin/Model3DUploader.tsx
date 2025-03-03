import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import modelService, { Model3DUploadResponse } from '../../services/modelService';
import ModelViewer from '../common/ModelViewer';
import imageService from '../../services/imageService';

interface Model3DUploaderProps {
  onUploadSuccess?: (result: Model3DUploadResponse) => void;
  categoryName?: string;
}

// Styled components
const UploadBox = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-style: dashed;
  border-width: 2px;
  border-color: #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;
  
  &:hover {
    border-color: #1976d2;
  }
`;

const VisuallyHiddenInput = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
`;

const Box = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TextField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const Button = styled.button<{ variant?: 'contained' | 'outlined' }>`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  background-color: ${props => props.variant === 'contained' ? '#1976d2' : 'transparent'};
  color: ${props => props.variant === 'contained' ? 'white' : '#1976d2'};
  border: 1px solid ${props => props.variant === 'contained' ? 'transparent' : '#1976d2'};
  
  &:hover {
    background-color: ${props => props.variant === 'contained' ? '#1565c0' : 'rgba(25, 118, 210, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const Alert = styled.div<{ severity: 'error' | 'success' }>`
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  color: ${props => props.severity === 'error' ? '#d32f2f' : '#2e7d32'};
  background-color: ${props => props.severity === 'error' ? '#fdeded' : '#edf7ed'};
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${props => props.color === 'inherit' ? 'white' : '#1976d2'};
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
    <polyline points="16 16 12 12 8 16"></polyline>
  </svg>
);

/**
 * Component for uploading 3D models for categories
 */
const Model3DUploader: React.FC<Model3DUploaderProps> = ({ 
  onUploadSuccess,
  categoryName = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState(categoryName);
  const [uploadResult, setUploadResult] = useState<Model3DUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const validExtensions = ['glb', 'gltf', 'zip'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!validExtensions.includes(fileExtension)) {
        setError('Unsupported file format. Please upload a GLB, GLTF, or ZIP file.');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setSelectedFile(file);
      setError(null);
      
      // Extract model name from file name if not provided
      if (!modelName) {
        const fileName = file.name.split('.')[0];
        setModelName(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !modelName) {
      setError('Please select a file and provide a name for the model');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Compress any image files before uploading
      let fileToUpload = selectedFile;
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      
      if (['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension)) {
        const compressedImage = await imageService.compressImage(
          fileToUpload, 
          1200, 
          1200, 
          0.7
        );
        
        fileToUpload = await imageService.dataURLtoFile(
          compressedImage,
          selectedFile.name
        );
      }
      
      const result = await modelService.uploadCategoryModel(fileToUpload, modelName);
      
      if (!result.success) {
        setError(result.message || 'Failed to upload 3D model');
        return;
      }
      
      setUploadResult(result);
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      setError('An unexpected error occurred while uploading the model');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Title>
        Upload 3D Model
      </Title>
      
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      
      {!uploadResult ? (
        <Stack>
          <UploadBox onClick={handleBoxClick}>
            <CloudUploadIcon />
            <p style={{ marginTop: '8px', marginBottom: '8px' }}>
              {selectedFile ? selectedFile.name : 'Click to select a 3D model file'}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Supported formats: GLB, GLTF, ZIP (with textures)
            </p>
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept=".glb,.gltf,.zip"
            />
          </UploadBox>
          
          <TextField
            placeholder="Model Name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
            disabled={loading}
          />
          
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || loading || !modelName}
          >
            {loading && <LoadingSpinner color="inherit" />}
            {loading ? 'Uploading...' : 'Upload 3D Model'}
          </Button>
        </Stack>
      ) : (
        <div>
          <Alert severity="success">
            3D model uploaded successfully!
          </Alert>
          
          <ModelViewer
            frontView={uploadResult.front_view}
            angleView={uploadResult.angle_view}
            animatedView={uploadResult.animated_view}
            modelUrl={uploadResult.model_url}
            name={modelName}
          />
          
          <Button
            variant="outlined"
            onClick={() => {
              setUploadResult(null);
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            style={{ marginTop: '24px' }}
          >
            Upload Another Model
          </Button>
        </div>
      )}
    </Box>
  );
};

export default Model3DUploader;
