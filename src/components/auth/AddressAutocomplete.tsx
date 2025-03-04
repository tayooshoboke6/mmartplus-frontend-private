import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0077C8;
    box-shadow: 0 0 0 1px #0077C8;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

// This will be used to store the Google Maps Places Autocomplete service
let autocompleteService: google.maps.places.AutocompleteService | null = null;

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter your address" 
}) => {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize Google Maps Places Autocomplete service
  useEffect(() => {
    // Check if the Google Maps API script is already loaded
    if (window.google?.maps?.places === undefined && !document.getElementById('google-maps-script')) {
      // If not, add the script to the document
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.maps?.places) {
          autocompleteService = new window.google.maps.places.AutocompleteService();
        }
      };
      
      document.head.appendChild(script);
    } else if (window.google?.maps?.places && !autocompleteService) {
      // If the API is already loaded but service is not initialized
      autocompleteService = new window.google.maps.places.AutocompleteService();
    }
    
    // Clean up function
    return () => {
      // Remove the script if component is unmounted
      const script = document.getElementById('google-maps-script');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  // Get suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.trim().length < 3 || !autocompleteService) {
        setSuggestions([]);
        return;
      }
      
      try {
        // Get predictions from Google Maps Places Autocomplete
        const response = await autocompleteService.getPlacePredictions({
          input: value,
          types: ['address'],
          componentRestrictions: { country: 'ng' } // Restrict to Nigeria
        });
        
        if (response.predictions) {
          setSuggestions(response.predictions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    };
    
    // Debounce the API call
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <InputContainer ref={inputRef}>
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsContainer>
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </SuggestionItem>
          ))}
        </SuggestionsContainer>
      )}
    </InputContainer>
  );
};

export default AddressAutocomplete;
