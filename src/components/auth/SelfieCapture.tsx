import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FaCamera, FaRedo } from 'react-icons/fa';
import imageService from '../../services/imageService';

const CameraContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoContainer = styled.div`
  width: 100%;
  max-width: 350px;
  height: 260px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #f0f0f0;
  margin-bottom: 15px;
  
  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  canvas {
    display: none;
  }
`;

const NoCamera = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  padding: 20px;
  text-align: center;
  
  svg {
    font-size: 40px;
    margin-bottom: 15px;
    color: #999;
  }
`;

const CaptureButton = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #0055b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
`;

const RetakeButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const CameraNotice = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

interface SelfieCaptureProps {
  onImageCaptured: (imageData: string) => void;
}

const SelfieCapture: React.FC<SelfieCaptureProps> = ({ onImageCaptured }) => {
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 350, height: 260 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      
      setStream(cameraStream);
      setIsCameraAvailable(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraAvailable(false);
    }
  }, []);

  // Initialize camera on component mount
  useEffect(() => {
    initCamera();
    
    // Clean up camera stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initCamera, stream]);

  // Capture photo with compression
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          setCapturedImage(imageData);
          
          // Convert data URL to file for compression
          const imageFile = imageService.dataURLtoFile(imageData, 'selfie.jpg');
          
          // Compress the image (use smaller dimensions for selfies)
          const compressedFile = await imageService.compressImage(imageFile, 500, 500, 0.7);
          
          // Convert compressed file back to data URL for display
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            const compressedDataUrl = reader.result as string;
            setCapturedImage(compressedDataUrl);
            
            // Pass compressed image data to parent component
            onImageCaptured(compressedDataUrl);
            setIsProcessing(false);
          };
        }
      } catch (error) {
        console.error('Error capturing and compressing image:', error);
        setIsProcessing(false);
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <CameraContainer>
      <VideoContainer>
        {!isCameraAvailable ? (
          <NoCamera>
            <FaCamera />
            <p>Camera access is not available. Please check your camera permissions.</p>
          </NoCamera>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured selfie" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
          />
        )}
        <canvas ref={canvasRef} />
      </VideoContainer>
      
      <ButtonsContainer>
        {capturedImage ? (
          <RetakeButton onClick={retakePhoto} title="Retake photo">
            <FaRedo />
          </RetakeButton>
        ) : (
          <CaptureButton 
            onClick={capturePhoto} 
            disabled={!isCameraAvailable || isProcessing}
            title="Take photo"
          >
            <FaCamera />
          </CaptureButton>
        )}
      </ButtonsContainer>
      
      <CameraNotice>
        {isProcessing 
          ? "Processing image..." 
          : !capturedImage 
            ? "Position your face within the frame and click the camera button" 
            : "Your selfie has been captured. You can retake if needed."}
      </CameraNotice>
    </CameraContainer>
  );
};

export default SelfieCapture;
