import { BiSolidNavigation } from 'react-icons/bi';
import { useMap } from 'react-leaflet';

const MyLocationControl = () => {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
      },
      error => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="absolute top-6 right-22 z-[1000]">
      <button
        type="button"
        onClick={handleLocate}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-300"
      >
        <BiSolidNavigation className="text-3xl text-gray-700" />
      </button>
    </div>
  );
};

export default MyLocationControl;
