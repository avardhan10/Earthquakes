// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(mag) {
  return mag * 20000;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "#2eff46";
  } else if (mag <= 2) {
      return "#32cd9c";
  } else if (mag <= 3) {
      return "#ffed29";
  } else if (mag <= 4) {
      return "#d1b200";
  } else if (mag <= 5) {
      return "#ff7700";
  } else {
      return "#db2424";
  };
}

// GET request to the query URL
d3.json(link, function(data) {
  // get a response, send the data.features object to the function: createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Defining a function to run once for each feature in the features array
  // Creating a popup to describe the place and time of the earthquake
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    


  // Sending earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Defining 2 the layers: satelitemap and darkmap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap
  };

  // Creating overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Createing map, giving it the satelitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [30,-100],
    zoom: 3,
    layers: [satelitemap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}



  
