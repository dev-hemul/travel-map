import { FiExternalLink } from 'react-icons/fi';

export const PortfolioSection = ({ portfolio }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Портфоліо</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#e65000] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">{site.name}</h4>
              <FiExternalLink className="text-gray-400" />
            </div>
            <div className="text-gray-600 text-sm truncate">{site.url}</div>
          </a>
        ))}
      </div>
    </div>
  );
};
