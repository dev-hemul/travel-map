import { useEffect, useRef } from 'react';
import { MapContainer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import MapBaseLayer from './MapBaseLayer';
import MapClickHandler from './MapClickHandler';
import LocateMeOnMap from '../Controls/LocateMeOnMap';
import MapClickMarker from '../Markers/MapClickMarker';
import MapSavedMarker from '../Markers/MapSavedMarker';
import MapUrlMarker from '../Markers/MapUrlMarker';

import { useMapMeasure } from '@/hooks/useMapMeasure';

const MapZoomHandler = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: event => {
      if (onZoomChange) {
        onZoomChange(event.target.getZoom());
      }
    },
  });

  return null;
};

const MapMeasureHandler = ({ isMeasureEnabled }) => {
  const map = useMap();
  const mapRef = useRef(map);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  useMapMeasure(mapRef, isMeasureEnabled);

  return null;
};

const MapCanvas = ({
  mapType,
  onMapClick,
  locateTrigger,
  initialCenter,
  initialZoom,
  markerLat,
  markerLng,
  draftMarker,
  markers,
  onMarkerClick,
  onZoomChange,
  isMeasureEnabled,
}) => {
  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-screen w-full"
      >
        <MapZoomHandler onZoomChange={onZoomChange} />
        <MapMeasureHandler isMeasureEnabled={isMeasureEnabled} />
        {markers.map(marker => (
          <MapSavedMarker
            key={marker._id || `${marker.lat}-${marker.lng}`}
            marker={marker}
            onClick={onMarkerClick}
          />
        ))}
        <MapBaseLayer mapType={mapType} />
        <MapClickHandler onMapClick={onMapClick} />
        <LocateMeOnMap trigger={locateTrigger} />
        {!draftMarker && <MapUrlMarker lat={markerLat} lng={markerLng} />}
        <MapClickMarker point={draftMarker} />
      </MapContainer>
    </div>
  );
};

export default MapCanvas;
