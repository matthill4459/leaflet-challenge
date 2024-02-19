// Creating the map object
  // Create the map object
let myMap = L.map("map").setView([0, 0], 2);

  // Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Getting our GeoJSON data
function fetchEarthquakeData() {
    d3.json(link)
        .then(data => {
        clearMap();
      // Loop through the earthquake data and create markers
        data.features.forEach(feature => {
            let coords = feature.geometry.coordinates;
            let mag = feature.properties.mag;
            let depth = coords[2];
            let place = feature.properties.place;
        //console.log("Latitude:", coords[1], "Longitude:", coords[0]);
        // Define marker size based on earthquake magnitude
            let markerSize = Math.sqrt(mag) * 5;
      
        // Define marker color based on earthquake depth
            let markerColor = getColor(depth);
    

        // Create a marker at each earthquake location
        L.circleMarker([coords[1], coords[0]], {
          radius: markerSize,
          fillColor: markerColor,
          color: "#000",
          weight: 1,
          opacity: .5,
          fillOpacity: 0.8
        }).addTo(myMap)
          .bindPopup(`<b>${place}</b><br/>Magnitude: ${mag}<br/>Depth: ${depth} km`);
      });
    })
    .catch(error => {
      console.error('Error fetching earthquake data:', error);
    });
}
// Function to clear the map of existing markers
function clearMap() {
    myMap.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) {
            myMap.removeLayer(layer);
        }
    });
}

function isValidCoords(coords) {
    return coords.length === 3 && typeof coords[0] === 'number' && typeof coords[1] === 'number' && typeof coords[2] === 'number';
}

  // Function to determine marker color based on earthquake depth
function getColor(depth) {
    // Customize the color scale as needed
    return depth > 100 ? '#8B0000' :
           depth > 70 ? '#FF4500' :
           depth > 50 ? '#FF8C00' :
           depth > 30 ? '#FFD700' :
           depth > 10 ? '#ADFF2F' :
                        '#32CD32';
}
fetchEarthquakeData();

// Set up the legend.
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let depths = [-10, 10, 30, 50, 70, 90]; // Depth intervals
  let colors = ['#32CD32', '#ADFF2F', '#FFD700', '#FF8C00', '#FF4500', '#8B0000']; // Colors corresponding to depth intervals
  let labels = [];

  // Add title to the legend
  let legendInfo = "<h1>Earthquake Depth</h1>";

  // Add legend info to the div
  div.innerHTML = legendInfo;

  // Loop through depth intervals and generate labels with corresponding colors
  depths.forEach(function(depth, index) {
    let depthRange;
    if (index === depths.length - 1) {
      depthRange = depth + "+";
    } else {
      depthRange = depth + " - " + depths[index + 1];
    }
    labels.push(
      '<li style="background-color: ' + colors[index] + '"></li> ' +
      depthRange // Displaying depth interval without km
    );
  });

  // Add legend labels to the div
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding the legend to the map
legend.addTo(myMap);
