import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Button, Alert, Spin, Table, Input, Space, Modal, Form } from 'antd';
import { GoogleMap, LoadScript, Polygon, Marker } from '@react-google-maps/api';
import { GeoCoordinate, GeofencePolygon } from '../../models/StoreAddress';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getGoogleMapsApiKey } from '../../utils/envUtils';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Use the environment variable for the Google Maps API key
const GOOGLE_MAPS_API_KEY = getGoogleMapsApiKey();
console.log('GeofenceMapEditor - Google Maps API Key available:', !!GOOGLE_MAPS_API_KEY);

// Fallback for development if key is not in .env
const useDevFallbackKey = process.env.NODE_ENV === 'development' && !GOOGLE_MAPS_API_KEY;

// Define the libraries we need
const libraries = ['drawing', 'places', 'geometry'];

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
  console.log('GeofenceMapEditor props:', { storeLatitude, storeLongitude, initialGeofence });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geofence, setGeofence] = useState<GeofencePolygon>(initialGeofence || { 
    type: 'Polygon',
    coordinates: []
  });
  const [editMode, setEditMode] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [tempPoints, setTempPoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [manualCoordinates, setManualCoordinates] = useState<string>('');
  const [isManualModalVisible, setIsManualModalVisible] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Default center is the store location
  const center = {
    lat: storeLatitude,
    lng: storeLongitude
  };

  // Set up the map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  // Convert GeoJSON Polygon coordinates to Google Maps LatLng[]
  const polygonCoordinatesToPath = (coordinates: number[][][]): google.maps.LatLngLiteral[] => {
    if (!coordinates || !coordinates[0]) return [];
    return coordinates[0].map(coord => ({
      lat: coord[1],
      lng: coord[0]
    }));
  };

  // Convert Google Maps LatLng[] to GeoJSON Polygon coordinates
  const pathToPolygonCoordinates = (path: google.maps.LatLngLiteral[]): number[][][] => {
    const coords = path.map(point => [point.lng, point.lat]);
    // Close the polygon by duplicating the first point at the end if needed
    if (coords.length > 0 && 
        (coords[0][0] !== coords[coords.length-1][0] || 
         coords[0][1] !== coords[coords.length-1][1])) {
      coords.push([...coords[0]]);
    }
    return [coords];
  };

  // Handle map click when in edit mode
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!editMode || !e.latLng) return;
    
    const newPoint = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setTempPoints(prev => [...prev, newPoint]);
  };

  const handleStartDrawing = () => {
    setEditMode(true);
    setManualMode(false);
    setTempPoints([]);
  };

  const handleFinishDrawing = () => {
    if (tempPoints.length < 3) {
      setError('Please define at least 3 points for a valid delivery area.');
      return;
    }

    const newGeofence = {
      ...geofence,
      coordinates: pathToPolygonCoordinates(tempPoints)
    };

    setGeofence(newGeofence);
    onChange(newGeofence);
    setEditMode(false);
    setTempPoints([]);
    setError(null);
  };

  const handleCancelDrawing = () => {
    setEditMode(false);
    setTempPoints([]);
    setError(null);
  };

  const handleOpenManualInput = () => {
    // If we already have coordinates, populate the text area with them
    if (geofence.coordinates && geofence.coordinates.length > 0 && geofence.coordinates[0].length > 0) {
      const coordsText = geofence.coordinates[0]
        .map(point => `${point[1]},${point[0]}`) // Convert to "lat,lng" format for readability
        .join('\n');
      setManualCoordinates(coordsText);
    } else {
      setManualCoordinates('');
    }
    setIsManualModalVisible(true);
  };

  const handleSaveManualCoordinates = () => {
    if (manualCoordinates.trim()) {
      try {
        // Parse the text input into coordinates
        const lines = manualCoordinates.trim().split('\n');
        const points: google.maps.LatLngLiteral[] = [];
        
        for (const line of lines) {
          const [lat, lng] = line.split(',').map(val => parseFloat(val.trim()));
          if (isNaN(lat) || isNaN(lng)) {
            throw new Error(`Invalid coordinate pair: ${line}`);
          }
          points.push({ lat, lng });
        }
        
        if (points.length < 3) {
          throw new Error('Please define at least 3 points for a valid delivery area.');
        }
        
        // Add the first point at the end to close the polygon
        if (
          points[0].lat !== points[points.length - 1].lat ||
          points[0].lng !== points[points.length - 1].lng
        ) {
          points.push(points[0]);
        }
        
        const newGeofence = {
          ...geofence,
          coordinates: [points.map(point => [point.lng, point.lat])]
        };
        
        setGeofence(newGeofence);
        onChange(newGeofence);
        setIsManualModalVisible(false);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManualCoordinates(e.target.value);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
  };

  // Prepare the polygon paths from our geofence data
  const polygonPath = geofence.coordinates && geofence.coordinates.length > 0 
    ? polygonCoordinatesToPath(geofence.coordinates) 
    : [];

  console.log('Polygon path:', polygonPath);

  return (
    <Card>
      <Title level={4}>Delivery Area</Title>
      <Text>Define the delivery area by creating a polygon on the map or by manually entering coordinates.</Text>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            {!editMode ? (
              <Space>
                <Button type="primary" onClick={handleStartDrawing}>
                  {geofence.coordinates && geofence.coordinates.length > 0 ? 'Redraw Delivery Area' : 'Draw Delivery Area'}
                </Button>
                <Button onClick={handleOpenManualInput}>
                  Manual Coordinate Entry
                </Button>
              </Space>
            ) : (
              <div>
                <Button type="primary" onClick={handleFinishDrawing} style={{ marginRight: '8px' }}>
                  Finish Drawing
                </Button>
                <Button onClick={handleCancelDrawing}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {editMode && (
            <Alert
              message="Drawing Mode"
              description="Click on the map to add points. Add at least 3 points to create a valid delivery area."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
            libraries={libraries as any}
            loadingElement={<div style={{ display: 'flex', justifyContent: 'center', padding: '20px', flexDirection: 'column', alignItems: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Loading Google Maps...</div>
            </div>}
            onLoad={() => console.log('GeofenceMapEditor - Google Maps script loaded successfully')}
            onError={(error) => {
              console.error('GeofenceMapEditor - Google Maps script loading error:', error);
              setError('Error loading Google Maps. Please check your API key and internet connection.');
            }}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
            >
              {/* Store marker */}
              <Marker
                position={center}
                label={{
                  text: "Store",
                  fontWeight: 'bold',
                }}
              />
              
              {/* Existing delivery area polygon */}
              {!editMode && polygonPath.length > 0 && (
                <Polygon
                  paths={polygonPath}
                  options={{
                    fillColor: '#3f51b5',
                    fillOpacity: 0.3,
                    strokeColor: '#3f51b5',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
              
              {/* Temporary polygon while drawing */}
              {editMode && tempPoints.length > 0 && (
                <Polygon
                  paths={tempPoints}
                  options={{
                    fillColor: '#f44336',
                    fillOpacity: 0.3,
                    strokeColor: '#f44336',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    editable: false,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>

          {/* Coordinates Table */}
          {polygonPath.length > 0 && !editMode && (
            <div style={{ marginTop: '16px' }}>
              <Title level={5}>Delivery Area Coordinates</Title>
              <Table
                dataSource={polygonPath.map((point, index) => ({
                  key: index,
                  latitude: point.lat.toFixed(6),
                  longitude: point.lng.toFixed(6),
                }))}
                columns={[
                  {
                    title: 'Point',
                    dataIndex: 'key',
                    key: 'key',
                    render: (text, record, index) => `Point ${index + 1}`
                  },
                  {
                    title: 'Latitude',
                    dataIndex: 'latitude',
                    key: 'latitude',
                  },
                  {
                    title: 'Longitude',
                    dataIndex: 'longitude',
                    key: 'longitude',
                  }
                ]}
                pagination={false}
                size="small"
                scroll={{ y: 200 }}
              />
            </div>
          )}

          {/* Manual Coordinate Entry Modal */}
          <Modal
            title="Manual Coordinate Entry"
            open={isManualModalVisible}
            onOk={handleSaveManualCoordinates}
            onCancel={() => {
              setIsManualModalVisible(false);
              setError(null);
            }}
            width={600}
          >
            <Alert
              message="Instructions"
              description={
                <div>
                  <p>Enter one coordinate pair per line in the format: <strong>latitude,longitude</strong></p>
                  <p>Example: <code>6.465422,3.406448</code></p>
                  <p>Add at least 3 points to create a valid polygon. The first and last points will be connected automatically.</p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <TextArea
              rows={10}
              value={manualCoordinates}
              onChange={handleManualInputChange}
              placeholder="Enter coordinates, one per line (latitude,longitude)"
            />
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </Modal>
        </>
      )}
    </Card>
  );
};

export default GeofenceMapEditor;
