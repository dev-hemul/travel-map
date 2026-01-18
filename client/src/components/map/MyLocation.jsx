import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';
import { BiSolidNavigation } from 'react-icons/bi';
import { toast } from 'react-toastify';

import myLocationIcon from '../../assets/my-location.svg';

function MyLocation({ mapRef }) {
  const markerRef = useRef(null);

  const locateMe = () => {
    if (!navigator.geolocation || !mapRef.current) {
      toast.error('Геолокація недоступна в цьому браузері');
      return;
    }

    toast.info('Визначаємо ваше місцеположення...', {
      toastId: 'locating',
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        toast.dismiss('locating');

        const { latitude, longitude, accuracy } = position.coords;
        const latlng = [latitude, longitude];

        mapRef.current.setView(latlng, 15);

        if (markerRef.current) {
          markerRef.current.setLatLng(latlng);
        } else {
          markerRef.current = L.marker(latlng, {
            icon: L.icon({
              iconUrl: myLocationIcon,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            }),
          })
            .addTo(mapRef.current)
            .bindPopup('Ви тут');
        }

        if (accuracy > 200) {
          toast.warning('Низька точність визначення (може використовуватись Wi-Fi)');
        }
      },
      error => {
        toast.dismiss('locating');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Немає доступу до геолокації. Перевірте дозволи або налаштування GPS');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Місцеположення недоступне. Спробуйте пізніше');
            break;
          case error.TIMEOUT:
            toast.warning('Не вдалося визначити місцеположення. Спробуйте увімкнути GPS');
            break;
          default:
            toast.error('Сталася невідома помилка геолокації');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const toggleLocation = () => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      toast.info('Місцеположення приховано');
    } else {
      locateMe();
    }
  };

  return (
    <button
      className="w-full flex items-center justify-center p-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 border border-gray-200"
      onClick={toggleLocation}
    >
      <BiSolidNavigation className="text-3xl" />
    </button>
  );
}

export default MyLocation;
