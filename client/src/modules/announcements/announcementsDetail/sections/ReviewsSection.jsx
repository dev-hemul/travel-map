import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

export const ReviewsSection = ({ section }) => {
  const hasReviews = section.reviews && section.reviews.length > 0;

  if (!hasReviews) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="text-gray-400 text-lg mb-3">Ще немає відгуків</div>
        <p className="text-gray-500 mb-6">Будьте першим, хто залишить відгук про цю послугу</p>
        <ReviewButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Відгуки ({section.reviews.length})
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {section.reviews.map(review => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-2xl p-6 hover:border-[#e65000]/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <img
                src={review.avatar}
                alt={review.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{review.user}</h4>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <ReviewButton />
      </div>
    </div>
  );
};

const ReviewButton = () => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="inline-flex items-center gap-2 bg-[#e65000] text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer"
  >
    <FiMessageSquare size={18} />
    Залишити відгук
  </motion.button>
);
