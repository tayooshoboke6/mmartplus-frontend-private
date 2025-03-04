import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Alert, Spin } from 'antd';
import { GoogleMap, LoadScript, Polygon, Marker } from '@react-google-maps/api';
import { GeoCoordinate, GeofencePolygon } from '../../models/StoreAddress';

const { Title, Text } = Typography;

// This would be your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface GeofenceMapEditorProps {
  storeLatitude: number;
  storeLongitude: number;
  initialGeofence?: GeofencePolygon;
  onChange: (geofence: GeofencePolygon) => void;
}

const GeofenceMapEditor: React.FC<GeofenceMapEditorProps> = ({
  storeLatitude,
  storeLongitude,
  initialGeofence,
  onChange
}) => {
  const [geofence, setGeofence] = useState<GeofencePolygon>(
    initialGeofence || { coordinates: [] }
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // When initialGeofence changes, update our state
  useEffect(() => {
    if (initialGeofence) {
      setGeofence(initialGeofence);
    }
  }, [initialGeofence]);

  // Define map options
  const mapOptions: google.maps.MapOptions = {
    zoom: 15,
    center: {
      lat: storeLatitude,
      lng: storeLongitude
    },
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };

  // Handler when map is loaded
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setIsLoaded(true);
  };

  // Start drawing a new polygon
  const startDrawing = () => {
    setIsDrawing(true);
    // Start with a clean slate
    setGeofence({ coordinates: [] });
  };

  // Handle clicking on the map when drawing
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isDrawing || !e.latLng) return;

    const newCoordinate: GeoCoordinate = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    setGeofence(prevState => {
      const newCoordinates = [...prevState.coordinates, newCoordinate];
      return { coordinates: newCoordinates };
    });
  };

  // Complete the polygon drawing
  const completeDrawing = () => {
    setIsDrawing(false);
    
    // Ensure the polygon is closed (first and last points match)
    const coordinates = [...geofence.coordinates];
    if (coordinates.length > 2) {
      // Close the polygon if not already closed
      if (
        coordinates[0].lat !== coordinates[coordinates.length - 1].lat ||
        coordinates[0].lng !== coordinates[coordinates.length - 1].lng
      ) {
        coordinates.push(coordinates[0]);
      }
      
      const finalGeofence = { coordinates };
      setGeofence(finalGeofence);
      onChange(finalGeofence);
    }
  };

  // Clear the current geofence
  const clearGeofence = () => {
    setGeofence({ coordinates: [] });
    setIsDrawing(false);
    onChange({ coordinates: [] });
  };

  // Generate a basic rectangular geofence around the store
  const generateRectangularGeofence = () => {
    // Create a rectangular area around the store
    const offset = 0.005; // Roughly 500 meters at equator
    const coordinates: GeoCoordinate[] = [
      { lat: storeLatitude - offset, lng: storeLongitude - offset },
      { lat: storeLatitude - offset, lng: storeLongitude + offset },
      { lat: storeLatitude + offset, lng: storeLongitude + offset },
      { lat: storeLatitude + offset, lng: storeLongitude - offset },
      { lat: storeLatitude - offset, lng: storeLongitude - offset } // Close the polygon
    ];
    
    const newGeofence = { coordinates };
    setGeofence(newGeofence);
    setIsDrawing(false);
    onChange(newGeofence);
  };

  return (
    <Card className="mb-4 rounded-lg shadow-md">
      <Title level={4} className="mb-4">Delivery Geofence</Title>
      <Text className="block mb-4">
        Define the area where standard delivery fees apply. Deliveries outside this area will incur additional fees,
        up to the maximum delivery distance.
      </Text>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          type={isDrawing ? "primary" : "default"} 
          onClick={isDrawing ? completeDrawing : startDrawing}
        >
          {isDrawing ? "Complete Drawing" : "Draw New Geofence"}
        </Button>
        <Button onClick={generateRectangularGeofence}>
          Generate Basic Rectangle
        </Button>
        <Button danger onClick={clearGeofence} disabled={geofence.coordinates.length === 0}>
          Clear Geofence
        </Button>
      </div>
      
      {isDrawing && (
        <Alert 
          message="Drawing Mode Active" 
          description="Click on the map to add points to your geofence. Click 'Complete Drawing' when finished." 
          type="info" 
          showIcon 
          className="mb-4"
        />
      )}
      
      <div style={{ height: '500px', width: '100%' }} className="mb-4 rounded overflow-hidden">
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} loadingElement={<Spin />}>
          <GoogleMap
            id="geofence-map"
            mapContainerStyle={{ height: '100%', width: '100%' }}
            options={mapOptions}
            onLoad={handleMapLoad}
            onClick={handleMapClick}
          >
            {/* Store marker */}
            <Marker
              position={{ lat: storeLatitude, lng: storeLongitude }}
              title="Store Location"
            />
            
            {/* Geofence polygon */}
            {geofence.coordinates.length > 2 && (
              <Polygon
                paths={geofence.coordinates}
                options={{
                  fillColor: '#0071BC',
                  fillOpacity: 0.3,
                  strokeColor: '#0071BC',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      
      <Text type="secondary" className="block">
        Note: You'll need to replace 'YOUR_GOOGLE_MAPS_API_KEY' with a valid Google Maps API key for production use.
      </Text>
    </Card>
  );
};

export default GeofenceMapEditor;
