import { useState, useEffect } from 'react';

import { useMapMarkers } from './hooks/useMapMarkers';
import { useMapUrlSync } from './hooks/useMapUrlSync';
import { useMarkerForm } from './hooks/useMarkerForm';

import api from '@/api/api';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/modules/map/config/mapDefaults';
import MapControlsPanel from '@/modules/map/ui/Controls/MapControlsPanel';
import MapCanvas from '@/modules/map/ui/Map/MapCanvas';
import CreateMarkerModal from '@/modules/map/ui/Markers/CreateMarkerModal';
import MarkerSidePanel from '@/modules/map/ui/SidePanel/MarkerSidePanel/MarkerSidePanel';

const MapPage = () => {
  const [mapType, setMapType] = useState('standard');
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [isMeasureEnabled, setIsMeasureEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { params, clearOpenedMarkerParams, setOpenedMarkerParams, updateZoomParam } =
    useMapUrlSync();

  const { markers, createMarker, updateMarker, deleteMarker, deleteMedia } = useMapMarkers();

  const form = useMarkerForm();

  const initialCenter =
    Number.isFinite(params.lat) && Number.isFinite(params.lng)
      ? [params.lat, params.lng]
      : DEFAULT_MAP_CENTER;

  const initialZoom = Number.isFinite(params.zoom) ? params.zoom : DEFAULT_MAP_ZOOM;
  const [mapZoom, setMapZoom] = useState(initialZoom);

  // Sync active marker from URL
  useEffect(() => {
    if (!markers.length) return;

    if (!params.markerId) {
      setActiveMarker(null);
      return;
    }

    const markerFromUrl = markers.find(marker => String(marker._id) === String(params.markerId));

    if (!markerFromUrl) {
      setActiveMarker(null);
      clearOpenedMarkerParams();
      return;
    }

    setActiveMarker({ ...markerFromUrl, zoom: mapZoom });
  }, [params.markerId, markers, mapZoom, clearOpenedMarkerParams]);

  // Sync zoom to active marker
  useEffect(() => {
    setActiveMarker(prev => (prev ? { ...prev, zoom: mapZoom } : prev));
  }, [mapZoom]);

  // Sync zoom to URL
  useEffect(() => {
    if (activeMarker?._id) {
      updateZoomParam(mapZoom);
    }
  }, [activeMarker, mapZoom, updateZoomParam]);

  const handleLocate = () => setLocateTrigger(prev => prev + 1);
  const handleToggleMeasure = () => setIsMeasureEnabled(prev => !prev);

  const handleMapClick = latlng => {
    if (isMeasureEnabled) return;

    setActiveMarker(null);
    clearOpenedMarkerParams();
    setSelectedMarker({ lat: latlng.lat, lng: latlng.lng, popup: 'Маркер', isDraft: true });
    setModalOpen(true);
  };

  const handleCreateMarkerSubmit = async e => {
    e.preventDefault();
    if (!selectedMarker) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const uploadedFileUrls = [];
      for (const file of form.formData.files || []) {
        const fileData = new FormData();
        fileData.append('file', file);
        const uploadResponse = await api.post('/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadResponse.data?.url) uploadedFileUrls.push(uploadResponse.data.url);
      }

      const data = {
        title: form.formData.title,
        category: form.selectedOption ? form.selectedOption.value : '',
        tags: form.formData.tags,
        lat: selectedMarker.lat,
        lng: selectedMarker.lng,
        private: !!form.formData.private,
        fileUrls: uploadedFileUrls,
        description: form.formData.description || '',
      };

      await createMarker(data);
      form.resetForm();
      setModalOpen(false);
      setSelectedMarker(null);
      setActiveMarker(null);
      clearOpenedMarkerParams();
    } catch (error) {
      console.error('Ошибка при создании маркера:', error);
      setSubmitError('Не вдалося зберегти маркер. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMarkerCancel = () => {
    form.resetForm();
    setModalOpen(false);
    setSelectedMarker(null);
    clearOpenedMarkerParams();
    setSubmitError(null);
  };

  const handleMarkerSave = async updatedMarker => {
    const saved = await updateMarker(updatedMarker);
    setActiveMarker({ ...saved, zoom: mapZoom });
    setOpenedMarkerParams(saved, mapZoom);
  };

  const handleMarkerDelete = async markerToDelete => {
    await deleteMarker(markerToDelete._id);
    setActiveMarker(null);
    clearOpenedMarkerParams();
  };

  const handleDeleteMedia = async (markerId, url) => {
    const updated = await deleteMedia(markerId, url);
    setActiveMarker(prev => (prev && prev._id === updated?._id ? { ...prev, ...updated } : prev));
  };

  return (
    <div className="relative h-screen w-full">
      <MapCanvas
        onMapClick={handleMapClick}
        mapType={mapType}
        locateTrigger={locateTrigger}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        markerLat={params.markerLat}
        markerLng={params.markerLng}
        draftMarker={selectedMarker?.isDraft ? selectedMarker : null}
        markers={markers}
        onZoomChange={setMapZoom}
        onMarkerClick={marker => {
          if (isMeasureEnabled) return;
          setOpenedMarkerParams(marker, mapZoom);
        }}
        isMeasureEnabled={isMeasureEnabled}
      />

      <MapControlsPanel
        mapType={mapType}
        onMapTypeChange={setMapType}
        onLocate={handleLocate}
        isMeasureEnabled={isMeasureEnabled}
        onToggleMeasure={handleToggleMeasure}
      />

      <CreateMarkerModal
        open={modalOpen}
        marker={selectedMarker}
        formData={form.formData}
        options={form.options}
        selectedOption={form.selectedOption}
        onFormChange={form.handleFormChange}
        onCategoryChange={form.handleCategoryChange}
        onCreateCategory={form.handleCreateCategory}
        onTagsChange={form.handleTagsChange}
        onPrivateChange={form.handlePrivateChange}
        onFilesChange={form.handleFilesChange}
        onSubmit={handleCreateMarkerSubmit}
        onClose={handleCreateMarkerCancel}
        loading={isSubmitting}
        onRemoveFile={form.handleRemoveFile}
        error={submitError}
      />

      <MarkerSidePanel
        marker={activeMarker}
        onClose={() => {
          setActiveMarker(null);
          clearOpenedMarkerParams();
        }}
        onSave={handleMarkerSave}
        onDelete={handleMarkerDelete}
        onDeleteMedia={handleDeleteMedia}
      />
    </div>
  );
};

export default MapPage;
