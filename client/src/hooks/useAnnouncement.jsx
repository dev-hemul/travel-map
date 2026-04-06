import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { mockOffers } from '../data/mockData';

export const useAnnouncement = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundOffer = mockOffers.find(o => o.id === parseInt(id));
      setOffer(foundOffer || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  return { offer, loading, id };
};
