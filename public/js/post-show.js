/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: post.geometry.coordinates,
  zoom: 4
});

const el = document.createElement('div');
el.className = 'marker';
new mapboxgl.Marker(el)
  .setLngLat(post.geometry.coordinates)
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
