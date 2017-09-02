//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");
var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var { hsl } = require("./lib/colors");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

// add GeoJSON file
var data = require("./simplified.geo.json");
data.features.forEach(function(feature) {
  ["women", "men"].forEach(p => feature.properties[p] *= 1);
})

// dot code for popup template
var dot = require("./lib/dot");
var popupTemplate = dot.compile(require("./_popup.html"));
var onEachFeature = function(feature, layer) {
  layer.bindPopup(popupTemplate(feature.properties))
  var focused = false;
  var popup = false;

  //Highlight selected region on hover and popupopen
  layer.on({
      mouseover: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
        focused = true;
      },
      mouseout: function(e) {
        if (focused == true && popup == false) layer.setStyle({ weight: 0.5, fillOpacity: 0.5 });
      },
      popupopen: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
        focused = true;
        popup = true;
      },
      popupclose: function(e) {
        layer.setStyle({ weight: 0.5, fillOpacity: 0.5 });
        focused = false;
        popup = false;
      }
   });
};

//Enter variable used for comparison

var percentage = "women";

var toggleLayer = function() {
  var checked = $.one(".buttonRow input:checked").id;
  if (checked == "women") {
    percentage = "women";
  } else {
    percentage = "men";
  }
  geojson.setStyle(style);
};

var getColor = function(d) {
    var value = d[percentage];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    if (typeof value != "undefined") {
      var distance = (value - 68) / 16;
      if (distance > 1) distance = 1;
      // condition ? if-true : if-false;
      // Set choropleth colors here
      // 60 100 90 -> 204 61 45
      // return hsl(60 + distance * (204 - 60), (100 - distance * 39).toFixed(1), (90 - 45 * distance).toFixed(1));

     return value >= 84 ? '#2c7fb8' :
             value >= 80.1 ? '#41b6c4' :
             value >= 76.1 ? '#7fcdbb' :
             value >= 72.1 ? '#bee8a3' :
             value >= 68 ? '#ffffcc' :
             'pink' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 0.5,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6
    };
    return s;
  };

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature
  }).addTo(map);

 map.scrollWheelZoom.disable();
 map.fitBounds(geojson.getBounds());

toggleLayer();
$.one(".buttonRow").addEventListener("change", toggleLayer);
