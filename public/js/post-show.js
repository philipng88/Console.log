/* eslint-disable */
mapboxgl.accessToken =
  'pk.eyJ1IjoicGhpbGlwbmciLCJhIjoiY2syN3hlZmtqMGw2cDNjbzZ3ZjQ5bHQ0aCJ9.3VrQXYtIqpcp9VNEwBnJyQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: post.coordinates,
  zoom: 4
});

const el = document.createElement('div');
el.className = 'marker';
new mapboxgl.Marker(el)
  .setLngLat(post.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<p class='font-weight-bold m-0'>${post.location}</p>`
    )
  )
  .addTo(map);
