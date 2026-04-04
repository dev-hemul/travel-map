import { useState, useEffect } from 'react';

import api from '@/api/api';

export const useMapMarkers = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await api.get('/markers');
        const processedMarkers = response.data.map(marker => ({
          ...marker,
          popup: marker.popup || `Маркер: ${marker.title || 'Без назви'}`,
        }));
        setMarkers(processedMarkers);
      } catch (error) {
        console.error('Ошибка при загрузке маркеров:', error);
      }
    };
    fetchMarkers();
  }, []);

  const createMarker = async data => {
    try {
      setLoading(true);
      const response = await api.post('/marker', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      const savedMarker = {
        ...response.data,
        popup: response.data.popup || `Маркер: ${response.data.title || 'Без назви'}`,
      };
      setMarkers(prev => [...prev, savedMarker]);
      return savedMarker;
    } catch (error) {
      console.error('Ошибка при создании маркера:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMarker = async updatedMarker => {
    try {
      const response = await api.put(`/marker/${updatedMarker._id}`, updatedMarker, {
        headers: { 'Content-Type': 'application/json' },
      });
      const savedMarker = {
        ...response.data,
        popup: response.data.popup || `Маркер: ${response.data.title || 'Без назви'}`,
      };
      setMarkers(prev =>
        prev.map(marker => (marker._id === savedMarker._id ? savedMarker : marker))
      );
      return savedMarker;
    } catch (error) {
      console.error('Ошибка при обновлении маркера:', error);
      throw error;
    }
  };

  const deleteMarker = async markerId => {
    try {
      await api.delete(`/marker/${markerId}`);
      setMarkers(prev => prev.filter(marker => marker._id !== markerId));
    } catch (error) {
      console.error('Ошибка при удалении маркера:', error);
      throw error;
    }
  };

  const deleteMedia = async (markerId, url) => {
    try {
      const response = await api.delete(`/marker/${markerId}/media`, {
        data: { url },
        headers: { 'Content-Type': 'application/json' },
      });
      const updatedMarker = response.data?.marker;
      if (updatedMarker?._id) {
        setMarkers(prev =>
          prev.map(marker =>
            marker._id === updatedMarker._id ? { ...marker, ...updatedMarker } : marker
          )
        );
        return updatedMarker;
      }
    } catch (error) {
      console.error('Ошибка при удалении медиа:', error);
      throw error;
    }
  };

  return {
    markers,
    loading,
    createMarker,
    updateMarker,
    deleteMarker,
    deleteMedia,
    setMarkers,
  };
};
