import { FiExternalLink } from 'react-icons/fi';

export const ProjectsSection = ({ projects }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Поточні проекти</h3>
      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#e65000]/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#e65000] font-medium hover:text-[#d45c00]"
                >
                  Детальніше
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
