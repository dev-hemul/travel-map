import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { FaRuler } from 'react-icons/fa';

export default function RouletteWidget({ isMeasureEnabled, onToggleMeasure }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureDistance, setMeasureDistance] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getMapInstance = () => {
    if (window.L && window.L.map && window.L.map._instances) {
      const instances = Object.values(window.L.map._instances);
      return instances.length > 0 ? instances[0] : null;
    }
    return null;
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (meters) => {
    return meters < 1000 ? `${meters.toFixed(1)} м` : `${(meters / 1000).toFixed(2)} км`;
  };

  const handleMapClick = (e) => {
    if (!measureMode) return;

    const map = getMapInstance();
    if (!map) return;

    const { lat, lng } = e.latlng;
    const newPoints = [...measurePoints, { lat, lng }];
    setMeasurePoints(newPoints);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`Точка ${newPoints.length}`)
      .openPopup();

    if (newPoints.length === 2) {
      const distance = calculateDistance(
        newPoints[0].lat, newPoints[0].lng,
        newPoints[1].lat, newPoints[1].lng
      );
      
      setMeasureDistance(distance);

      L.polyline([
        [newPoints[0].lat, newPoints[0].lng],
        [newPoints[1].lat, newPoints[1].lng]
      ], { 
        color: 'red', 
        weight: 4,
        opacity: 0.7
      }).addTo(map);

      const midLat = (newPoints[0].lat + newPoints[1].lat) / 2;
      const midLng = (newPoints[0].lng + newPoints[1].lng) / 2;
      
      L.popup()
        .setLatLng([midLat, midLng])
        .setContent(`<div style="padding: 5px;"><strong>Відстань:</strong> ${formatDistance(distance)}</div>`)
        .openOn(map);
    }

    if (newPoints.length > 2) {
      setMeasurePoints([]);
      setMeasureDistance(null);
      const { lat, lng } = e.latlng;
      setMeasurePoints([{ lat, lng }]);
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup('Точка 1')
        .openPopup();
    }
  };

  useEffect(() => {
    const map = getMapInstance();
    if (!map) return;

    if (measureMode) {
      map.on('click', handleMapClick);
    } else {
      map.off('click', handleMapClick);
      setMeasurePoints([]);
      setMeasureDistance(null);
    }

    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [measureMode]);

  const handleClick = () => {
    const newMeasureMode = !measureMode;
    onToggleMeasure && onToggleMeasure();
    setIsOpen(false);
    setMeasureMode(newMeasureMode);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`w-full flex items-center justify-center p-2 rounded-full shadow-md border hover:cursor-pointer ${
          isMeasureEnabled
            ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
        } active:bg-gray-200 transition-colors duration-200`}
        title="Виміряти відстань"
      >
        <FaRuler className="text-3xl" />
      </button>
    </div>
  );
}
