import { Marker } from 'react-leaflet';

import customMarkerIcon from './CreateMarkerModal/customMarkerIcon';

const MapUrlMarker = ({ lat, lng }) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return <Marker position={[lat, lng]} icon={customMarkerIcon} />;
};

export default MapUrlMarker;
