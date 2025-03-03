// Google Maps API type declarations
declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: {
            input: string;
            types?: string[];
            componentRestrictions?: { country: string };
          },
          callback?: (
            predictions: AutocompletePrediction[] | null,
            status: PlacesServiceStatus
          ) => void
        ): Promise<{ predictions: AutocompletePrediction[] }>;
      }
      
      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting?: {
          main_text: string;
          secondary_text: string;
        };
      }
      
      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
      }
    }
  }
}

// Extend Window interface to include google property
interface Window {
  google: typeof google;
}
