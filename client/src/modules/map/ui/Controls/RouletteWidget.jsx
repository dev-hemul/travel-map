import { FaRuler } from 'react-icons/fa';

export default function RouletteButton({ isMeasureEnabled, onToggleMeasure }) {
  return (
    <div className="relative">
      <button
        onClick={onToggleMeasure}
        className={`w-full flex items-center justify-center p-2 rounded-full shadow-md border ${
          isMeasureEnabled
            ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
        } active:bg-gray-200 transition-colors duration-200`}
        title={isMeasureEnabled ? 'Режим лінійка увімкнений' : 'Режим лінійка вимкнений'}
      >
        <FaRuler className="text-3xl" />
      </button>
    </div>
  );
}
