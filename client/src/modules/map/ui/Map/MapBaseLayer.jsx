import { Fragment } from 'react';
import { TileLayer } from 'react-leaflet';

const MapBaseLayer = ({ mapType }) => {
  if (mapType === 'satellite') {
    return (
      <Fragment>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={19}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={19}
        />
      </Fragment>
    );
  }

  if (mapType === 'topographic') {
    return (
      <TileLayer
        url="https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=97187d076fc74bc8967f2ec4e6c56a28"
        attribution="Maps © Thunderforest, Data © OpenStreetMap contributors"
        maxZoom={22}
      />
    );
  }

  return (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution=""
      maxZoom={19}
    />
  );
};

export default MapBaseLayer;
