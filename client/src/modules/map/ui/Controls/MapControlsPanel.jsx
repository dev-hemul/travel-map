import AuthMenu from './AuthMenu';
import LayersSwitcher from './LayersSwitcher';
import LocateMeButton from './LocateMeButton';
import RouletteWidget from './RouletteWidget';
import WeatherWidget from './WeatherWidget';

const MapControlsPanel = ({
  mapType,
  onMapTypeChange,
  onLocate,
  isMeasureEnabled,
  onToggleMeasure,
}) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex gap-3 items-start">
      <AuthMenu />
      <LayersSwitcher mapType={mapType} onChange={onMapTypeChange} />
      <WeatherWidget />
      <LocateMeButton onClick={onLocate} />
      <RouletteWidget isMeasureEnabled={isMeasureEnabled} onToggleMeasure={onToggleMeasure} />
    </div>
  );
};

export default MapControlsPanel;
