var arrLabelLocality = [];
var arrLocality;

self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open('v1').then(function (cache) {
          return cache.addAll([
            './Resources/sinomap.jpg',
            './Resources/tho.png',
            './Scripts/sql.js'
          ]);
      })
    );
});

// initMap();
// Create the map
const map = new ol.Map({
      target: 'basicMap', // The ID of the div
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM() // OpenStreetMap layer
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([105.85, 21.02]), // Hanoi coords [lon, lat]
        zoom: 11
      })
});
const iconStyle = new ol.style.Style({
        image: new ol.style.Circle({
        radius: 3,
        fill: new ol.style.Fill({ color: 'red' }),
        stroke: new ol.style.Stroke({ color: 'black', width: 1 })
      })
      })
var markerFeatures;
var markerLayer;
var labeltype = 'name';
map.getView().on('change:resolution', updateMarkerVisibility);

    // markerLabel element
    const markerLabel = document.createElement('div');
    markerLabel.className = 'markerLabel';
    markerLabel.style.display = 'none';
    document.body.appendChild(markerLabel);
    // Overlay for markerLabel
    const overlay = new ol.Overlay({
      element: markerLabel,
      offset: [10, 0],
      positioning: 'bottom-left'
    });
    map.addOverlay(overlay);
	
    map.on('pointermove', function(evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        markerLabel.innerHTML = feature.get('label');
        overlay.setPosition(coordinates);
        markerLabel.style.display = 'block';
      } else {
        markerLabel.style.display = 'none';
      }
    });
map.on('singleclick', function (evt) {
  let clickedMarker = null;
  map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    if (layer === markerLayer) {
		clickedMarker = feature;
		return true;
    }
  });
  if (clickedMarker) {    
    document.getElementById('nameNom').innerHTML = clickedMarker.get('name');
    document.getElementById('nameLatin').innerHTML = clickedMarker.get('label');
    document.getElementById('nameHan').innerHTML = clickedMarker.get('name');
  } else {
    document.getElementById('nameNom').innerHTML = "";
    document.getElementById('nameLatin').innerHTML = "";
    document.getElementById('nameHan').innerHTML = "";
  }
});

    // Optional: hide markerLabel when leaving map
    map.getViewport().addEventListener('mouseout', function() {
      markerLabel.style.display = 'none';
    });
	
// Connect to sqlite db file
var xhr = new XMLHttpRequest();
xhr.open('GET', './Resources/sinomap.jpg', true);
xhr.responseType = 'arraybuffer';
xhr.onload = function (e) {
    var uInt8Array = new Uint8Array(this.response);
    condb = new SQL.Database(uInt8Array);
    contents = condb.exec("SELECT * FROM Locality ");
    console.log(contents[0].values[0]);

    arrLocality = contents[0].values;
    initLabel();
};
xhr.send();
/*--
mymap.addListener('zoom_changed', function () {
    var mapzoom = mymap.getZoom();
    for (var i = 0; i != arrLocality.length; i++) {
        if ((mapzoom > arrLocality[i][5]) && (mapzoom < arrLocality[i][6]))
            arrLabelLocality[i].show();
        else
            arrLabelLocality[i].hide();
    }
});
*/

function initLabel() {
    // Create an array of marker features
    markerFeatures = arrLocality.map(m => {
      const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([m[6], m[5]])),
		minZoom: m[7],
        label: m[2],
        name: m[1]
      });
      return feature;
    });

    // Create a vector layer with all markers
    markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: markerFeatures
      }),
	  style: function(feature, resolution) {
			const zoom = map.getView().getZoom();
			return zoom >= feature.get('minZoom') ? iconStyle : null;
	  }
    });
    map.addLayer(markerLayer);
    updateMarkerVisibility();
	
}
function updateMarkerVisibility() {
  const zoom = map.getView().getZoom();

  markerFeatures.forEach(f => {
    const visible = zoom >= (f.get('minZoom') || 0);

    if (!visible) {
      f.setStyle(null); // hide marker
      return;
    }

    // clone your base icon style
    const style = iconStyle.clone();

    // add the marker name text label
    style.setText(new ol.style.Text({
      text: f.get(labeltype) || '',
      offsetY: -10, // move label above the circle
      font: '14px "Lexend", sans-serif, "SimSun-ExtB", "SimSun-ExtG", "Jigmo3"',
      fill: new ol.style.Fill({ color: '#000' }),
      stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
    }));

    f.setStyle(style);
  });
}

function scriptChange() {
    switch ($('#labelscripttype').val()) {
        case '0':
			labeltype = 'name';
            updateMarkerVisibility();
            break;
        case '1':            
			labeltype = 'label';
            updateMarkerVisibility();
            break;
        case '2':
			labeltype = null;
            updateMarkerVisibility();
            break;
        default: break;
    }
}

var txttmp = "";

function codeAddress(ind, huyen) {
    geocoder.geocode({ 'address': arrLocality[ind][2]+" " + huyen }, function (results, status) {
        if (status == 'OK') {
            txttmp += "INSERT INTO \"Locality\" VALUES (NULL,\'" + arrLocality[ind][1] + "\',\'" + arrLocality[ind][2] + "\'," + results[0].geometry.location.lat() + "," + results[0].geometry.location.lng() + ","+ arrLocality[ind][5]+ ","+ arrLocality[ind][6]+ ","+ arrLocality[ind][7] + ");\n";
        } else if (status == 'OVER_QUERY_LIMIT') {
            setTimeout(codeAddress(ind, huyen), 2000);
            //txttmp += "INSERT INTO \"Locality\" VALUES (NULL,\'" + arrLocality[ind][1] + "\',\'" + arrLocality[ind][2] + "\', 21.022,105.832 ," + arrLocality[ind][5] + "," + arrLocality[ind][6] + "," + arrLocality[ind][7] + ");\n";
        } else {
            console.log(ind);
        }
    });
}

