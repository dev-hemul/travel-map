import { useState } from 'react';

const CATEGORY_NAMES = {
  Home: 'Житло',
  Water: 'Вода',
  Food: 'Їжа',
  Places: 'Місця',
};

const getCategoryDisplayName = category => CATEGORY_NAMES[category] || category || 'Без категорії';

export const useMarkerShare = markerData => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const closeShareModal = () => {
    setShowShareModal(false);
    setCopied(false);
  };

  const shareUrl = (() => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      lat: markerData.lat.toString(),
      lng: markerData.lng.toString(),
      zoom: '15',
      marker: markerData._id,
    });

    return `${baseUrl}/?${params.toString()}`;
  })();

  const generateShareText = () => {
    const title = markerData.title || 'Маркер на карті';
    const description = markerData.description ? ` - ${markerData.description}` : '';
    const category = markerData.category ? ` (${getCategoryDisplayName(markerData.category)})` : '';

    return `${title}${category}${description}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Ошибка копирования:', error);

      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToSocial = platform => {
    const shareText = encodeURIComponent(generateShareText());
    const encodedUrl = encodeURIComponent(shareUrl);

    let socialUrl = '';

    switch (platform) {
      case 'telegram':
        socialUrl = `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`;
        break;
      case 'whatsapp':
        socialUrl = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
        break;
      case 'viber':
        socialUrl = `viber://forward?text=${shareText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(socialUrl, '_blank', 'width=600,height=400');
  };

  return {
    copied,
    shareUrl,
    showShareModal,
    openShareModal: () => setShowShareModal(true),
    closeShareModal,
    copyToClipboard,
    shareToSocial,
  };
};
