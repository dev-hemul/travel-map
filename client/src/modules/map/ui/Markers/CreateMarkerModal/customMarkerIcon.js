import L from 'leaflet';

import markerIconSvg from '@/assets/map-marker-32px.svg';

const customMarkerIcon = L.icon({
  iconUrl: markerIconSvg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default customMarkerIcon;
