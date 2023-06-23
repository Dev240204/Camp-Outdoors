const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=E23PLaNZ4ebkNeRNNQlZ`,
  center: campground.geometry.coordinates,
  zoom: 7,
});
const popup = new maplibregl.Popup({ offset: 15 })
.setHTML(
  `<h5>${campground.title}</h6>
  <p>${campground.location}</p>`
  )
const nav = new maplibregl.NavigationControl();
map.addControl(nav,'top-right');
map.scrollZoom.disable();
const marker = new maplibregl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);