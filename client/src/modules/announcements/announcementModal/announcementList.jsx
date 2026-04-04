import AnnouncementCard from './announcementCard';

const AnnouncementList = ({ announcements, onDetailsClick }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 space-y-3">
      {announcements.map(announcement => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          onDetailsClick={onDetailsClick}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
