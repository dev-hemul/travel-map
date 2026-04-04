import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export const useMapUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParams = () => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');
    const markerId = searchParams.get('marker');
    const markerLat = searchParams.get('markerLat');
    const markerLng = searchParams.get('markerLng');

    return {
      lat: lat !== null ? Number(lat) : null,
      lng: lng !== null ? Number(lng) : null,
      zoom: zoom !== null ? Number(zoom) : null,
      markerId,
      markerLat: markerLat !== null ? Number(markerLat) : null,
      markerLng: markerLng !== null ? Number(markerLng) : null,
    };
  };

  const clearOpenedMarkerParams = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('marker');
    nextParams.delete('lat');
    nextParams.delete('lng');
    nextParams.delete('zoom');
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const setOpenedMarkerParams = useCallback(
    (marker, zoomValue) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('marker', String(marker._id));
      nextParams.set('lat', String(marker.lat));
      nextParams.set('lng', String(marker.lng));
      nextParams.set('zoom', String(zoomValue));
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const updateZoomParam = useCallback(
    zoomValue => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('zoom', String(zoomValue));
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return {
    params: getParams(),
    clearOpenedMarkerParams,
    setOpenedMarkerParams,
    updateZoomParam,
    searchParams,
  };
};
