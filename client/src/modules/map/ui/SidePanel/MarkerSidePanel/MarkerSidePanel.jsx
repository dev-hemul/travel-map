import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import MarkerActions from './components/MarkerActions';
import MarkerDetails from './components/MarkerDetails';
import MarkerHeader from './components/MarkerHeader';
import MediaGallery, { MediaViewer } from './components/MediaGallery';
import ShareModal from './components/ShareModal';

const MarkerSidePanel = ({ marker, onClose, onSave, onDelete, onDeleteMedia }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: marker?.title || '',
    category: marker?.category || '',
    description: marker?.description || '',
    tags: Array.isArray(marker?.tags) ? marker.tags.join(', ') : '',
    private: !!marker?.private,
  });
  const [saveError, setSaveError] = useState('');
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletingMediaUrl, setDeletingMediaUrl] = useState('');
  const [mediaDeleteError, setMediaDeleteError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const shareInputRef = useRef(null);

  useEffect(() => {
    setIsEditing(false);
    setIsSaving(false);
    setIsDeleting(false);
    setEditForm({
      title: marker?.title || '',
      category: marker?.category || '',
      description: marker?.description || '',
      tags: Array.isArray(marker?.tags) ? marker.tags.join(', ') : '',
      private: !!marker?.private,
    });
    setSaveError('');
    setIsDeleteConfirm(false);
    setDeleteError('');
    setDeletingMediaUrl('');
    setMediaDeleteError('');
    setShowShareModal(false);
  }, [marker]);

  useEffect(() => {
    if (!showShareModal) return;
    const handleKeyDown = event => {
      if (event.key === 'Escape') setShowShareModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShareModal]);

  useEffect(() => {
    if (!showShareModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showShareModal]);

  useEffect(() => {
    if (!showShareModal) return;
    const timeoutId = setTimeout(() => {
      shareInputRef.current?.focus();
      shareInputRef.current?.select();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [showShareModal]);

  const media = Array.isArray(marker?.fileUrls) ? marker.fileUrls : [];

  const isVideoFile = url => {
    if (!url) return false;
    return /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(url);
  };

  const buildUpdatedMarker = () => ({
    ...marker,
    title: editForm.title.trim(),
    category: editForm.category.trim(),
    description: editForm.description.trim(),
    tags: editForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean),
    private: editForm.private,
  });

  const generateShareUrl = () => {
    if (!marker) return '';
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      lat: String(marker.lat),
      lng: String(marker.lng),
      zoom: String(marker.zoom || 15),
      marker: String(marker._id),
    });
    return `${baseUrl}/?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      setShowShareModal(false);
    } catch (error) {
      console.error('Ошибка копирования ссылки:', error);
    }
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(generateShareUrl());
    const text = encodeURIComponent(marker.title || 'Маркер на карті');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    setShowShareModal(false);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareModal(false);
  };

  const handleSave = async () => {
    const updatedMarker = buildUpdatedMarker();
    setEditForm({
      ...editForm,
      tags: Array.isArray(updatedMarker.tags) ? updatedMarker.tags.join(', ') : '',
    });
    try {
      setSaveError('');
      setIsSaving(true);
      if (onSave) await onSave(updatedMarker);
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при сохранении маркера:', error);
      setSaveError('Не вдалося зберегти зміни');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteError('');
      setIsDeleting(true);
      if (onDelete) await onDelete(marker);
      setIsDeleteConfirm(false);
    } catch (error) {
      console.error('Ошибка при удалении маркера:', error);
      setDeleteError('Не вдалося видалити маркер');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMedia = async (markerId, url) => {
    try {
      setMediaDeleteError('');
      setDeletingMediaUrl(url);
      if (onDeleteMedia) await onDeleteMedia(markerId, url);
    } catch (error) {
      console.error('Помилка при видаленні медіа:', error);
      setMediaDeleteError('Не вдалося видалити медіафайл');
    } finally {
      setDeletingMediaUrl('');
    }
  };

  return (
    <>
      <AnimatePresence>
        {marker && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed right-0 top-0 z-[1100] h-full w-full overflow-y-auto bg-white shadow-2xl sm:w-80 md:w-96"
          >
            <MarkerHeader
              isEditing={isEditing}
              editForm={editForm}
              setEditForm={setEditForm}
              onClose={onClose}
            />

            <div className="space-y-6 p-6">
              <MarkerActions
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isDeleteConfirm={isDeleteConfirm}
                setIsDeleteConfirm={setIsDeleteConfirm}
                isDeleting={isDeleting}
                isSaving={isSaving}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancelEdit={() => setIsEditing(false)}
                setShowShareModal={setShowShareModal}
                deleteError={deleteError}
                saveError={saveError}
                mediaDeleteError={mediaDeleteError}
              />

              <MarkerDetails
                marker={marker}
                isEditing={isEditing}
                editForm={editForm}
                setEditForm={setEditForm}
              />

              <MediaGallery
                media={media}
                onMediaClick={setSelectedMedia}
                onDeleteMedia={handleDeleteMedia}
                deletingMediaUrl={deletingMediaUrl}
                isVideoFile={isVideoFile}
                markerId={marker._id}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MediaViewer
        url={selectedMedia}
        isVideoFile={isVideoFile}
        onClose={() => setSelectedMedia(null)}
      />

      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={generateShareUrl()}
        onShareTelegram={handleShareTelegram}
        onShareFacebook={handleShareFacebook}
        onCopyLink={handleCopyLink}
        shareInputRef={shareInputRef}
      />
    </>
  );
};

export default MarkerSidePanel;
