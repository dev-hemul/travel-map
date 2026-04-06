import { FiCalendar, FiExternalLink } from 'react-icons/fi';

export const ReportsSection = ({ section, activeTab }) => {
  if (activeTab !== 'travel') {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="text-gray-400 text-lg mb-3">
          Звіти доступні тільки для розділу &ldquo;Подорожі&rdquo;
        </div>
      </div>
    );
  }

  if (!section.reports || section.reports.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="text-gray-400 text-lg mb-3">Ще немає звітів</div>
        <p className="text-gray-500">Звіти з&ldquo;являться після проведення подорожей</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Звіти про подорожі</h2>
      <div className="grid grid-cols-1 gap-6">
        {section.reports.map(report => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#e65000]/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <FiCalendar className="mr-2" size={14} />
                  <span className="text-sm">{report.date}</span>
                </div>
                <p className="text-gray-700 mb-4">{report.description}</p>
                <a
                  href={report.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#e65000] font-medium hover:text-[#d45c00]"
                >
                  Читати звіт
                  <FiExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
