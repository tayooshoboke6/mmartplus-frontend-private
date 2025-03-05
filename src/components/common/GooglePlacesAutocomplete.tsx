import React, { useEffect, useRef, useState } from 'react';
import { Input, InputProps } from 'antd';
import styled from 'styled-components';
import { getGoogleMapsApiKey } from '../../utils/envUtils';

// API key for Google Maps services
const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();

// Load Google Maps API script dynamically
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById('google-maps-script');
  if (!existingScript) {
    console.log('Google Maps API Key available:', !!GOOGLE_MAPS_API_KEY);
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.id = 'google-maps-script';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      if (callback) callback();
    };
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
    };
  } else if (callback) {
    callback();
  }
};

const SuggestionItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SuggestionList = styled.div`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #d9d9d9;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1050;
`;

const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

interface PlaceDetails {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface GooglePlacesAutocompleteProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
  defaultValue?: string;
  value?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onChange,
  onPlaceSelect,
  defaultValue,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>(value || defaultValue || '');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsScriptLoaded(true);
      
      // Initialize Google services
      if (window.google && window.google.maps) {
        console.log('Google Maps services available');
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        geocoder.current = new window.google.maps.Geocoder();
        
        // Need a DOM element for Places Service
        const placesDiv = document.createElement('div');
        placesDiv.style.display = 'none';
        document.body.appendChild(placesDiv);
        placesService.current = new window.google.maps.places.PlacesService(placesDiv);
      } else {
        console.error('Google Maps services not available');
      }
    });

    return () => {
      // Clean up any resources if needed
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (onChange) {
      onChange(value);
    }

    if (value && isScriptLoaded && autocompleteService.current) {
      const request = {
        input: value,
        componentRestrictions: { country: 'ng' }, // Restrict to Nigeria
        types: ['address']
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (placeId: string) => {
    if (placesService.current) {
      placesService.current.getDetails(
        { placeId, fields: ['address_components', 'geometry', 'formatted_address'] },
        (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            let city = '';
            let state = '';
            let postalCode = '';
            let country = '';
            let street = '';

            // Extract address components
            place.address_components?.forEach(component => {
              const types = component.types;
              
              if (types.includes('street_number')) {
                street = component.long_name;
              } else if (types.includes('route')) {
                street = street ? `${street} ${component.long_name}` : component.long_name;
              } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              } else if (types.includes('postal_code')) {
                postalCode = component.long_name;
              } else if (types.includes('country')) {
                country = component.long_name;
              }
            });

            // Use the formatted address if we don't have a detailed street address
            const address = street || place.formatted_address || '';

            const placeDetails: PlaceDetails = {
              address,
              city,
              state,
              postalCode,
              country,
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0
            };

            setInputValue(address);
            setSuggestions([]);
            
            // Log what we're passing to the parent component
            console.log('Sending place details to parent:', placeDetails);
            
            if (onChange) {
              onChange(address);
            }
            
            if (onPlaceSelect) {
              onPlaceSelect(placeDetails);
            }
          }
        }
      );
    }
  };

  return (
    <AutocompleteContainer>
      <Input
        {...props}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => {
          // Delayed closing of suggestions to allow for selection
          setTimeout(() => setSuggestions([]), 200);
        }}
        autoCapitalize="off"
        aria-autocomplete="none"
      />
      {suggestions.length > 0 && (
        <SuggestionList>
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion.place_id)}
            >
              {suggestion.description}
            </SuggestionItem>
          ))}
        </SuggestionList>
      )}
    </AutocompleteContainer>
  );
};

export default GooglePlacesAutocomplete;
