import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheck, FaRandom } from 'react-icons/fa';

// Styled components
const AvatarSelectorContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const AvatarTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
`;

const AvatarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AvatarOption = styled.div<{ $selected: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 3px solid ${props => props.$selected ? '#0066cc' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SelectedIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #0066cc;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: #0055b3;
  }
  
  &:disabled {
    background-color: #cccccc;
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

// Available DiceBear styles
const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji'
];

// Generate cartoon avatars
const generateCartoonAvatars = () => {
  return AVATAR_STYLES.map(style => {
    const seed = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return `https://api.dicebear.com/6.x/${style}/svg?seed=${seed}`;
  });
};

interface AvatarSelectorProps {
  currentAvatar: string;
  onSave: (avatarUrl: string) => void;
  onCancel: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  currentAvatar, 
  onSave, 
  onCancel 
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [avatarOptions, setAvatarOptions] = useState<string[]>(generateCartoonAvatars());
  
  const handleSave = () => {
    setIsSaving(true);
    // In a real app, this might involve API calls
    setTimeout(() => {
      onSave(selectedAvatar);
      setIsSaving(false);
    }, 800);
  };
  
  const regenerateAvatars = () => {
    setAvatarOptions(generateCartoonAvatars());
  };
  
  return (
    <AvatarSelectorContainer>
      <AvatarTitle>Choose a cartoon avatar</AvatarTitle>
      <AvatarsGrid>
        {avatarOptions.map((avatar, index) => (
          <AvatarOption 
            key={index} 
            $selected={selectedAvatar === avatar}
            onClick={() => setSelectedAvatar(avatar)}
          >
            <img src={avatar} alt={`Avatar option ${index + 1}`} />
            {selectedAvatar === avatar && (
              <SelectedIcon>
                <FaCheck size={12} />
              </SelectedIcon>
            )}
          </AvatarOption>
        ))}
      </AvatarsGrid>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button 
          onClick={handleSave} 
          disabled={isSaving || selectedAvatar === currentAvatar}
        >
          {isSaving ? 'Saving...' : 'Save Avatar'}
        </Button>
        
        <SecondaryButton onClick={regenerateAvatars}>
          <FaRandom size={14} />
          Generate New Options
        </SecondaryButton>
        
        <SecondaryButton onClick={onCancel}>
          Cancel
        </SecondaryButton>
      </div>
    </AvatarSelectorContainer>
  );
};

export default AvatarSelector;
