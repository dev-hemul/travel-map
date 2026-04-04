import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

const LocateMeOnMap = ({ trigger }) => {
  const map = useMapEvents({
    locationfound: event => {
      const lat = event?.latlng?.lat;
      const lng = event?.latlng?.lng;

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn('Invalid geolocation coords:', event);
        return;
      }

      map.flyTo([lat, lng], 15, {
        animate: true,
        duration: 0.5,
      });
    },

    locationerror: error => {
      console.warn('Geolocation error:', error);
    },
  });

  useEffect(() => {
    if (!trigger) return;

    map.locate({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      setView: false,
    });
  }, [trigger, map]);

  return null;
};

export default LocateMeOnMap;
