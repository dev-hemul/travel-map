import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';

import myLocationIcon from '@/assets/my-location.svg';

const LocateMeOnMap = ({ trigger }) => {
  const markerRef = useRef(null);
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

      toast.dismiss('locating');

      if (markerRef.current) {
        markerRef.current.setLatLng(event.latlng);
      } else {
        markerRef.current = L.marker(event.latlng, {
          icon: L.icon({
            iconUrl: myLocationIcon,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
        })
          .addTo(map)
          .bindPopup('Ви тут');
      }

      if (event.accuracy > 200) {
        toast.warning('Низька точність визначення (може використовуватись Wi-Fi)');
      }
    },

    locationerror: error => {
      toast.dismiss('locating');
      console.warn('Geolocation error:', error);
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          toast.error('Немає доступу до геолокації. Перевірте дозволи або налаштування GPS');
          break;
        case 2: // POSITION_UNAVAILABLE
          toast.error('Місцеположення недоступне. Спробуйте пізніше');
          break;
        case 3: // TIMEOUT
          toast.warning('Не вдалося визначити місцеположення. Спробуйте увімкнути GPS');
          break;
        default:
          toast.error('Сталася невідома помилка геолокації');
      }
    },
  });

  useEffect(() => {
    if (!trigger) return;

    toast.info('Визначаємо ваше місцеположення...', {
      toastId: 'locating',
    });

    map.locate({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      setView: false,
    });
  }, [trigger, map]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }
    };
  }, [map]);

  return null;
};

export default LocateMeOnMap;
