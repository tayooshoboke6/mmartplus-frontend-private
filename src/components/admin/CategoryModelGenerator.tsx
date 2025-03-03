import React, { useState } from 'react';
import styled from 'styled-components';
import ModelViewer from '../common/ModelViewer';
import modelService, { Model3DUploadResponse } from '../../services/modelService';
import imageService from '../../services/imageService';

interface CategoryModelGeneratorProps {
  categoryName: string;
  onModelGenerated: (modelData: any) => void;
  existingModel?: {
    modelUrl?: string;
    frontView?: string;
    angleView?: string;
    animatedView?: string;
  } | null;
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
  gap: 8px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
  &:focus {
    outline: none;
    border-color: #0066b2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
  resize: vertical;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #0066b2;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 16px;
  background-color: #f5f5f5;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const SelectedFile = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: #0066b2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0055a5;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ErrorAlert = styled.div`
  background-color: #fdeded;
  color: #5f2120;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  border: 1px solid #f5c2c7;
`;

const SuccessAlert = styled.div`
  background-color: #edf7ed;
  color: #1e4620;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  border: 1px solid #c3e6cb;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066b2;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CategoryModelGenerator: React.FC<CategoryModelGeneratorProps> = ({
  categoryName,
  onModelGenerated,
  existingModel
}) => {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('ai-text');
  const [modelName, setModelName] = useState<string>(categoryName);
  const [prompt, setPrompt] = useState<string>(`A 3D model of ${categoryName} category`);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelResult, setModelResult] = useState<{
    modelUrl?: string;
    frontView?: string;
    angleView?: string;
    animatedView?: string;
  } | null>(existingModel || null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  // Handle form submission
  const handleGenerateModel = async () => {
    setError(null);
    setLoading(true);
    
    try {
      let result: Model3DUploadResponse;
      
      if (generationMethod === 'ai-text') {
        result = await modelService.generateCategoryModel({
          name: modelName,
          style: 'modern'
        });
      } else if (generationMethod === 'image-upload' && selectedImage) {
        // Compress image before uploading
        const compressedImage = await imageService.compressImage(
          selectedImage, 
          1200, 
          1200, 
          0.7
        );
        
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
      
      // Convert the API response model to our expected format
      const modelData = {
        modelUrl: result.model_url,
        frontView: result.front_view,
        angleView: result.angle_view,
        animatedView: result.animated_view
      };
      
      setModelResult(modelData);
      onModelGenerated(modelData);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while generating the model');
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
            frontView={modelResult.frontView || modelResult.frontView}
            angleView={modelResult.angleView || modelResult.angleView}
            animatedView={modelResult.animatedView || modelResult.animatedView}
            modelUrl={modelResult.modelUrl || modelResult.modelUrl}
            name={modelName}
          />
          
          <ButtonGroup>
            <Button onClick={() => {
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
                  name="generationMethod"
                  value="ai-text"
                  checked={generationMethod === 'ai-text'}
                  onChange={() => setGenerationMethod('ai-text')}
                />
                Generate from text description (AI)
              </RadioLabel>
              
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="generationMethod"
                  value="image-upload"
                  checked={generationMethod === 'image-upload'}
                  onChange={() => setGenerationMethod('image-upload')}
                />
                Generate from image
              </RadioLabel>
              
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="generationMethod"
                  value="model-upload"
                  checked={generationMethod === 'model-upload'}
                  onChange={() => setGenerationMethod('model-upload')}
                />
                Upload existing 3D model
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Model Name</FormLabel>
            <TextInput
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
            />
          </FormGroup>
          
          {generationMethod === 'ai-text' && (
            <FormGroup>
              <FormLabel>Description</FormLabel>
              <TextArea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the 3D model you want to generate"
              />
            </FormGroup>
          )}
          
          {generationMethod === 'image-upload' && (
            <FormGroup>
              <FileInputLabel>
                {selectedImage ? 'Change Image' : 'Select Image'}
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FileInputLabel>
              
              {selectedImage && (
                <SelectedFile>
                  Selected: {selectedImage.name}
                </SelectedFile>
              )}
              
              {previewUrl && (
                <ImagePreview>
                  <PreviewImage src={previewUrl} alt="Preview" />
                </ImagePreview>
              )}
            </FormGroup>
          )}
          
          {generationMethod === 'model-upload' && (
            <FormGroup>
              <FormLabel>
                You'll be redirected to the 3D model uploader after clicking the button below
              </FormLabel>
            </FormGroup>
          )}
          
          <Button
            onClick={handleGenerateModel}
            disabled={loading || (generationMethod === 'image-upload' && !selectedImage)}
          >
            {loading ? 'Generating...' : 'Generate 3D Model'}
          </Button>
        </StyledPaper>
      )}
      
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default CategoryModelGenerator;
