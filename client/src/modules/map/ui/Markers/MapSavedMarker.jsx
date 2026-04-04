import { Marker } from 'react-leaflet';

import customMarkerIcon from './CreateMarkerModal/customMarkerIcon';

const MapSavedMarker = ({ marker, onClick }) => {
  if (!marker) return null;
  if (!Number.isFinite(marker.lat) || !Number.isFinite(marker.lng)) return null;

  return (
    <Marker
      position={[marker.lat, marker.lng]}
      icon={customMarkerIcon}
      eventHandlers={{
        click: () => {
          onClick?.(marker);
        },
      }}
    />
  );
};

export default MapSavedMarker;
