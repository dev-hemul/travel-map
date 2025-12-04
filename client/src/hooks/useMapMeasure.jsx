import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet.polylinemeasure';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';

export const useMapMeasure = (mapInstanceRef, isEnabled) => {
  const measureControlRef = useRef(null);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    if (isEnabled) {
      if (!measureControlRef.current) {
        measureControlRef.current = new L.Control.PolylineMeasure({
          position: 'topleft',
          unit: 'kilometres',
          showBearings: true,
          // Ставим true, щоб при відключенні контрола все очищалось
          clearMeasurementsOnStop: true,
          showClearControl: true,
          showUnitControl: true,
          tooltipTextFinish: 'Натисніть, щоб <b>закінчити вимірювання</b><br>',
          tooltipTextDelete: 'Натисніть SHIFT та клікніть, щоб <b>видалити точку</b>',
          tooltipTextMove: 'Натисніть і перетягніть, щоб <b>перемістити точку</b><br>',
          tooltipTextResume: '<br>Натисніть CTRL та клікніть, щоб <b>продовжити лінію</b>',
          tooltipTextAdd: 'Натисніть CTRL та клікніть, щоб <b>додати точку</b>',
        });

        measureControlRef.current.addTo(map);
        // Відразу включаємо режим
        measureControlRef.current._toggleMeasure();
      }
    } else {
      if (measureControlRef.current) {
        // Спочатку програмно "вимикаємо" заміри, це тригерне clearMeasurementsOnStop
        if (measureControlRef.current._measuring) {
          measureControlRef.current._toggleMeasure();
        }

        map.removeControl(measureControlRef.current);
        measureControlRef.current = null;
      }
    }

    return () => {
      if (measureControlRef.current && map) {
        map.removeControl(measureControlRef.current);
        measureControlRef.current = null;
      }
    };
  }, [mapInstanceRef, isEnabled]);
};
