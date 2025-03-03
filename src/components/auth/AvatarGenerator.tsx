import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaImage, FaRedo, FaCheck, FaRandom } from 'react-icons/fa';
import imageService from '../../services/imageService';

const AvatarGeneratorContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid #0066cc;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GeneratingMessage = styled.div`
  text-align: center;
  margin: 10px 0;
  color: #666;
  font-style: italic;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #0055b3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

const AvatarOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 15px auto;
  max-width: 300px;
`;

const AvatarOption = styled.div<{ selected: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${props => props.selected ? '#0066cc' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Available DiceBear styles
const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'lorelei',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art'
];

interface AvatarGeneratorProps {
  selfieImage: string;
  onAvatarGenerated: (avatarUrl: string) => void;
  onRetakeSelfie: () => void;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ 
  selfieImage, 
  onAvatarGenerated,
  onRetakeSelfie
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [selectedStyle, setSelectedStyle] = useState<string>('avataaars');
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a seed from the selfie (use timestamp + random number for unique seed)
  const generateSeed = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  // Generate avatar options when component mounts or selfie changes
  useEffect(() => {
    if (selfieImage) {
      setIsGenerating(true);
      
      // Generate 6 different avatar options using different styles
      const options = AVATAR_STYLES.slice(0, 6).map(style => {
        const seed = generateSeed();
        return `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`;
      });
      
      setAvatarOptions(options);
      setSelectedAvatar(options[0]);
      
      // Simulate API call delay
      timeoutRef.current = setTimeout(() => {
        setIsGenerating(false);
      }, 1500);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selfieImage]);

  // Generate a new set of avatar options
  const generateNewOptions = () => {
    setIsGenerating(true);
    
    // Generate 6 different avatar options
    const options = AVATAR_STYLES.slice(0, 6).map(style => {
      const seed = generateSeed();
      return `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`;
    });
    
    setAvatarOptions(options);
    setSelectedAvatar(options[0]);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };
  
  // Handle using the selected avatar
  const handleUseAvatar = async () => {
    try {
      setIsGenerating(true);
      
      // If avatar is an SVG URL from DiceBear, we don't need to compress it
      if (selectedAvatar.includes('dicebear.com')) {
        onAvatarGenerated(selectedAvatar);
        return;
      }
      
      // For other image types, compress before using
      const response = await fetch(selectedAvatar);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.png', { type: 'image/png' });
      
      // Compress the image (avatar-specific settings)
      const compressedFile = await imageService.compressImage(file, 400, 400, 0.7);
      
      // Convert back to data URL
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        onAvatarGenerated(reader.result as string);
        setIsGenerating(false);
      };
    } catch (error) {
      console.error('Error processing avatar:', error);
      // Fallback to uncompressed avatar if there's an error
      onAvatarGenerated(selectedAvatar);
      setIsGenerating(false);
    }
  };

  return (
    <AvatarGeneratorContainer>
      <AvatarPreview>
        <img 
          src={selectedAvatar || avatarOptions[0] || selfieImage} 
          alt="Generated avatar"
        />
      </AvatarPreview>
      
      {isGenerating ? (
        <GeneratingMessage>
          Generating cartoon avatars...
        </GeneratingMessage>
      ) : (
        <>
          <AvatarOptionsContainer>
            {avatarOptions.map((avatar, index) => (
              <AvatarOption 
                key={index}
                selected={selectedAvatar === avatar}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <img src={avatar} alt={`Avatar option ${index + 1}`} />
              </AvatarOption>
            ))}
          </AvatarOptionsContainer>
          
          <ButtonsContainer>
            <SecondaryButton onClick={onRetakeSelfie}>
              <FaRedo size={14} />
              Retake Selfie
            </SecondaryButton>
            
            <SecondaryButton onClick={generateNewOptions}>
              <FaRandom size={14} />
              New Options
            </SecondaryButton>
            
            <Button onClick={handleUseAvatar}>
              <FaCheck size={14} />
              Use This Avatar
            </Button>
          </ButtonsContainer>
        </>
      )}
    </AvatarGeneratorContainer>
  );
};

export default AvatarGenerator;
