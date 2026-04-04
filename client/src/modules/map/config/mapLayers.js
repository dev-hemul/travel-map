export const MAP_LAYERS = {
  standard: {
    key: 'standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '',
  },
  satellite: {
    key: 'satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '',
  },
  topographic: {
    key: 'topographic',
    url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=97187d076fc74bc8967f2ec4e6c56a28',
    attribution: '',
    maxZoom: 22,
  },
};
