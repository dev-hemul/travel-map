import { Marker } from 'react-leaflet';

import customMarkerIcon from './CreateMarkerModal/customMarkerIcon';

const MapClickMarker = ({ point }) => {
  if (!point) return null;
  if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return null;

  return <Marker position={[point.lat, point.lng]} icon={customMarkerIcon} />;
};

export default MapClickMarker;
