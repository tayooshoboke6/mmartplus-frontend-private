import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from '../common/ModelViewer';
import modelService from '../../services/modelService';
import imageService from '../../services/imageService';

interface CategoryModelGeneratorProps {
  categoryName: string;
  onModelGenerated: (modelData: any) => void;
  existingModel?: {
    modelUrl?: string;
    frontView?: string;
    angleView?: string;
    animatedView?: string;
  };
}

type GenerationMethod = 'ai-text' | 'image-upload' | 'model-upload';

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const StyledPaper = styled.div`
  padding: 24px;
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const RadioInput = styled.input`
  margin-right: 8px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #1976d2;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const ErrorAlert = styled.div`
  background-color: #fdeded;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SuccessAlert = styled.div`
  background-color: #edf7ed;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Divider = styled.hr`
  margin: 24px 0;
  border: none;
  border-top: 1px solid #eee;
`;

/**
 * Component for generating 3D models for categories
 */
const CategoryModelGenerator: React.FC<CategoryModelGeneratorProps> = ({
  categoryName,
  onModelGenerated,
  existingModel
}) => {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai-text');
  const [modelName, setModelName] = useState<string>(categoryName);
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modelResult, setModelResult] = useState(existingModel || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle method selection
  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenerationMethod(event.target.value as GenerationMethod);
    setError(null);
  };

  // Handle image selection
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Create a preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      
      setSelectedImage(file);
      setError(null);
    }
  };

  // Handle model generation
  const handleGenerateModel = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (generationMethod === 'ai-text') {
        // Generate from text
        if (!modelName) {
          throw new Error('Model name is required');
        }
        
        const styleParam = stylePrompt.trim() || undefined;
        result = await modelService.generateCategoryModel({
          name: modelName,
          style: styleParam
        });
      } else if (generationMethod === 'image-upload') {
        // Generate from image
        if (!selectedImage) {
          throw new Error('Please select an image');
        }
        
        // Compress the image before upload
        const compressedImage = await imageService.compressImage(selectedImage, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8
        });
        
        const compressedFile = await imageService.dataURLtoFile(
          compressedImage,
          selectedImage.name
        );
        
        result = await modelService.generateModelFromImage(compressedFile, modelName);
      } else {
        // This is model upload - handle in the parent component
        onModelGenerated({
          method: 'model-upload',
          modelName
        });
        setLoading(false);
        return;
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate model');
      }
      
      setModelResult(result);
      onModelGenerated(result);
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Model generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Category 3D Model Generator</Title>
      
      {error && (
        <ErrorAlert>
          {error}
        </ErrorAlert>
      )}
      
      {modelResult ? (
        <StyledPaper>
          <SuccessAlert>
            3D model generated successfully!
          </SuccessAlert>
          
          <ModelViewer
            frontView={modelResult.frontView || modelResult.front_view}
            angleView={modelResult.angleView || modelResult.angle_view}
            animatedView={modelResult.animatedView || modelResult.animated_view}
            modelUrl={modelResult.modelUrl || modelResult.model_url}
            name={modelName}
          />
          
          <ButtonGroup>
            <Button variant="outlined" onClick={() => {
              setModelResult(null);
              setSelectedImage(null);
              setPreviewUrl(null);
              if (existingModel) {
                onModelGenerated(null);
              }
            }}>
              Generate Another Model
            </Button>
          </ButtonGroup>
        </StyledPaper>
      ) : (
        <StyledPaper>
          <FormGroup>
            <FormLabel>Generation Method</FormLabel>
            <RadioGroup>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="generation-method" 
                  value="ai-text" 
                  checked={generationMethod === 'ai-text'} 
                  onChange={handleMethodChange} 
                />
                AI-Generated from Category Name
              </RadioLabel>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="generation-method" 
                  value="image-upload" 
                  checked={generationMethod === 'image-upload'} 
                  onChange={handleMethodChange} 
                />
                Generate from Image
              </RadioLabel>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="generation-method" 
                  value="model-upload" 
                  checked={generationMethod === 'model-upload'} 
                  onChange={handleMethodChange} 
                />
                Upload 3D Model File
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          <Divider />
          
          {generationMethod === 'ai-text' && (
            <FormGroup>
              <FormLabel>Model Name</FormLabel>
              <TextField
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. Furniture, Electronics"
              />
              
              <FormLabel style={{ marginTop: '16px' }}>Style Prompt (Optional)</FormLabel>
              <TextArea
                value={stylePrompt}
                onChange={(e) => setStylePrompt(e.target.value)}
                placeholder="e.g. modern, minimalist, realistic, colorful"
              />
              
              <Button 
                variant="contained" 
                onClick={handleGenerateModel} 
                disabled={!modelName || loading}
                style={{ marginTop: '16px' }}
              >
                {loading && <LoadingSpinner />}
                {loading ? 'Generating...' : 'Generate 3D Model'}
              </Button>
            </FormGroup>
          )}
          
          {generationMethod === 'image-upload' && (
            <FormGroup>
              <FormLabel>Model Name</FormLabel>
              <TextField
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Name for your 3D model"
              />
              
              {previewUrl && (
                <ImagePreview>
                  <PreviewImage src={previewUrl} alt="Selected image" />
                </ImagePreview>
              )}
              
              <div>
                <FileInput
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                <FileInputLabel htmlFor="image-upload">
                  Select Image
                </FileInputLabel>
              </div>
              
              <Button
                variant="contained"
                onClick={handleGenerateModel}
                disabled={!selectedImage || !modelName || loading}
                style={{ marginTop: '16px' }}
              >
                {loading && <LoadingSpinner />}
                {loading ? 'Processing...' : 'Generate 3D Model from Image'}
              </Button>
            </FormGroup>
          )}
          
          {generationMethod === 'model-upload' && (
            <FormGroup>
              <FormLabel>Model Name</FormLabel>
              <TextField
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Name for your 3D model"
              />
              
              <Button
                variant="contained"
                onClick={handleGenerateModel}
                disabled={!modelName || loading}
                style={{ marginTop: '16px' }}
              >
                Upload 3D Model File
              </Button>
            </FormGroup>
          )}
        </StyledPaper>
      )}
    </Container>
  );
};

export default CategoryModelGenerator;
