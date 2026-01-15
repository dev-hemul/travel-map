import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';
import { TbLocationFilled } from 'react-icons/tb';

import myLocationIcon from '../../accets/my-location.svg';

function MyLocation({ mapRef }) {
  const markerRef = useRef(null);

  const locateMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
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
      },
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Користувач заборонив доступ до геолокації');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Місцеположення недоступне');
            break;
          case error.TIMEOUT:
            alert('Час очікування вичерпано');
            break;
          default:
            alert('Невідома помилка');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const toggleLocation = () => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    } else {
      locateMe();
    }
  };

  return (
    <button
      className="w-full flex items-center justify-center p-2 bg-white text-gray-700 rounded-full shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 border border-gray-200"
      onClick={toggleLocation}
    >
      <TbLocationFilled className="text-2xl" />
    </button>
  );
}

export default MyLocation;
