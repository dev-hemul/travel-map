export const VideoSection = ({ section }) => {
  if (!section.videos || section.videos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="text-gray-400 text-lg mb-3">Відео відсутні</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Відеоматеріали</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {section.videos.map(video => (
          <div key={video.id} className="bg-black rounded-xl overflow-hidden">
            <iframe
              src={video.url}
              title={video.title}
              className="w-full h-64"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="p-4 bg-white">
              <p className="font-medium text-gray-900">{video.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
