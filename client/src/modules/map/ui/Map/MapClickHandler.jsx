import { useMapEvents } from 'react-leaflet';

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(event) {
      const target = event.originalEvent?.target;

      if (target instanceof Element) {
        const clickedMarker =
          target.closest('.leaflet-marker-icon') ||
          target.closest('.leaflet-popup') ||
          target.closest('.leaflet-popup-content') ||
          target.closest('.leaflet-popup-tip-container');

        if (clickedMarker) {
          return;
        }
      }

      onMapClick?.(event.latlng);
    },
  });

  return null;
};

export default MapClickHandler;
