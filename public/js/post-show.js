/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
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
      `<p style='font-weight: bold; margin: 0;'>${post.location}</p>`
    )
  )
  .addTo(map);

$('.toggle-edit-form').on('click', function() {
  $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
  $(this)
    .siblings('.edit-review-form')
    .toggle();
});
