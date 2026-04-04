import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import SidePanelActions from './components/SidePanelActions';
import SidePanelContent from './components/SidePanelContent';
import SidePanelHeader from './components/SidePanelHeader';
import SidePanelDeleteModal from './SidePanelDeleteModal';
import SidePanelShareModal from './SidePanelShareModal';
import { useMarkerShare } from '../../hooks/useMarkerShare';

const SidePanel = ({ isOpen, onClose, markerData, onEdit, onDelete, onDeleteMedia }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    copied,
    shareUrl,
    showShareModal,
    openShareModal,
    closeShareModal,
    copyToClipboard,
    shareToSocial,
  } = useMarkerShare(markerData);

  if (!isOpen || !markerData) return null;

  const categoryNames = {
    Home: 'Житло',
    Water: 'Вода',
    Food: 'Їжа',
    Places: 'Місця',
  };

  const getCategoryDisplayName = category => {
    return categoryNames[category] || category || 'Без категорії';
  };

  const confirmDelete = async () => {
    try {
      await onDelete(markerData._id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Ошибка при удалении маркера:', error);
    }
  };

  const handleEdit = () => {
    onEdit(markerData);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-white shadow-2xl z-[1001] overflow-y-auto"
            style={{
              filter: showDeleteConfirm || showShareModal ? 'blur(3px)' : 'none',
              transition: 'filter 0.3s ease-in-out',
            }}
          >
            <SidePanelHeader
              title={markerData.title}
              category={markerData.category}
              getCategoryDisplayName={getCategoryDisplayName}
              onDeleteClick={() => setShowDeleteConfirm(true)}
              onClose={onClose}
              disabled={showDeleteConfirm || showShareModal}
            />

            <SidePanelContent
              markerData={markerData}
              showDeleteConfirm={showDeleteConfirm}
              showShareModal={showShareModal}
              onDeleteMedia={onDeleteMedia}
            />

            <SidePanelActions
              onEdit={handleEdit}
              onShare={openShareModal}
              disabled={showDeleteConfirm || showShareModal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SidePanelDeleteModal
        isOpen={showDeleteConfirm && isOpen}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />

      <SidePanelShareModal
        isOpen={showShareModal && isOpen}
        copied={copied}
        shareUrl={shareUrl}
        onClose={closeShareModal}
        onCopy={copyToClipboard}
        onShare={shareToSocial}
      />
    </>
  );
};

export default SidePanel;
