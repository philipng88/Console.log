/* eslint-disable no-undef */
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-98.55562, 39.809734],
  zoom: 3.3
});

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  })
);

map.on('load', () => {
  map.addSource('posts', {
    type: 'geojson',
    data: posts,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'posts',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'posts',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'posts',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.on('click', 'unclustered-point', e => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  map.on('click', 'clusters', e => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('posts').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  const mouseenterCursor = () => {
    map.getCanvas().style.cursor = 'pointer';
  };
  const mouseLeaveCursor = () => {
    map.getCanvas().style.cursor = '';
  };
  map.on('mouseenter', 'clusters', mouseenterCursor);
  map.on('mouseleave', 'clusters', mouseLeaveCursor);
  map.on('mouseenter', 'unclustered-point', mouseenterCursor);
  map.on('mouseleave', 'unclustered-point', mouseLeaveCursor);
});
