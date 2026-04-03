import { FaStar, FaInfoCircle } from 'react-icons/fa';

const AnnouncementCard = ({ announcement, onDetailsClick }) => {
  const getCategoryColor = category => {
    if (category === 'Шляхотворець') return 'bg-purple-100 text-purple-800';
    if (category === 'Організовую події') return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div
      className="relative p-3 sm:p-4 rounded-xl border border-gray-200 bg-white active:border-blue-300 transition-colors"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold sm:font-bold text-sm sm:text-base text-gray-800 pr-2">
          {announcement.title}
        </h3>
        <span
          className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getCategoryColor(announcement.category)}`}
        >
          {announcement.category}
        </span>
      </div>

      <p className="text-gray-500 text-[10px] sm:text-xs italic mb-2">{announcement.address}</p>

      <img
        src={announcement.image}
        alt={announcement.title}
        className="w-full h-32 sm:h-40 object-cover rounded-lg mb-3"
        loading="lazy"
        decoding="async"
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {announcement.author}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < Math.floor(announcement.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500">{announcement.rating}</span>
          </div>
        </div>
        <span className="font-bold text-xs sm:text-sm text-green-600">{announcement.price}</span>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
        {announcement.description}
      </p>

      <button
        onClick={e => {
          e.stopPropagation();
          onDetailsClick(announcement);
        }}
        className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 active:bg-blue-100 text-blue-700 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <FaInfoCircle className="text-xs sm:text-sm" />
        Детальніше
      </button>
    </div>
  );
};

export default AnnouncementCard;
