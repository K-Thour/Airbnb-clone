/* global mapboxgl, mapToken, listingLocation, listingCountry, listingTitle, fetch */

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [0, 20],
  zoom: 2,
});

// Geocode the listing location using Mapbox Geocoding API
const query = encodeURIComponent(`${listingLocation}, ${listingCountry}`);
fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=1`,
)
  .then((res) => res.json())
  .then((data) => {
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;

      map.flyTo({ center: [lng, lat], zoom: 10, essential: true });

      new mapboxgl.Marker({ color: "#ff5a5f" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<b>${listingTitle}</b><br>${listingLocation}, ${listingCountry}`,
          ),
        )
        .addTo(map);
    }
  })
  .catch((err) => console.error("Geocoding error:", err));
