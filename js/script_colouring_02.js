// BACKGROUND LAYER!!!!!
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

var map = L.map('map', {layers: [grayscale]}).setView([36, 128], 7);

var geojsonBase_recent;
var geojsonOverlay_recent;
map.on('overlayadd', function(e) {
	geojsonOverlay_recent = e.layer;
	console.log(geojsonOverlay_recent);
});
map.on('baselayerchange', function(e) {
	geojsonBase_recent = e.layer;
	console.log(geojsonBase_recent);
});


// getting colour
function L_value(_baseScore) {
	var value_int = 50 + (100-_baseScore)/2;
	// var value_int = 50 - (100-_baseScore)/2;
	return value_int + '%';
}
function getColor(_score, _hueValue) {
	// return _score >= 100 ? _colourArray[9] :
	// 	   _score < 0 ? '#FFFFFF' :
	// 					_colourArray[parseInt(_score/10)];
	// var coluorFunction = new L.HSLHueFunction(new L.Point(0, 120), new L.Point(100, 0), {outputSaturation: '100%', outputLuminosity:L_value(_baseScore)});
	var coluorFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0.5), {outputHue: _hueValue, outputSaturation: '100%'});
	
	return coluorFunction.evaluate(_score);
}
function getColor_basicMap(_score, _hueValue) {
	// return _score >= 100 ? _colourArray[9] :
	// 	   _score < 0 ? '#FFFFFF' :
	// 					_colourArray[parseInt(_score/10)];
	// var coluorFunction = new L.HSLHueFunction(new L.Point(0, 120), new L.Point(100, 0), {outputSaturation: '100%', outputLuminosity:L_value(_baseScore)});
	var coluorFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0.25), {outputHue: _hueValue, outputSaturation: '0%'});
	
	return coluorFunction.evaluate(_score);
}






// functions for implementing rawData and score into initial geoJSON data 
var statesBasicMap = JSON.parse(JSON.stringify(statesData)), 
	statesData_hiringRate_0 = JSON.parse(JSON.stringify(statesData)), 
	statesData_hiringRate_300 = JSON.parse(JSON.stringify(statesData)),
	statesData_hiringRate_1000 = JSON.parse(JSON.stringify(statesData)),
	statesData_extinctIndex = JSON.parse(JSON.stringify(statesData)),
	statesData_incomeRate = JSON.parse(JSON.stringify(statesData)),
	statesData_R_COSTII = JSON.parse(JSON.stringify(statesData)),
	statesData_expertRate = JSON.parse(JSON.stringify(statesData));


for (var i=0; i<statesData_hiringRate_0.features.length; i++) {
	statesBasicMap.features[i].properties.colour = getColor_basicMap(50 ,16);
	statesBasicMap.features[i].properties.dataType = "(그냥 지도)";

	statesData_hiringRate_0.features[i].properties.rawData = _dataJSON[i].hiringRate_0;
	statesData_hiringRate_0.features[i].properties.score = _dataJSON[i].score_hiringRate_0;
	statesData_hiringRate_0.features[i].properties.colour = getColor_basicMap(_dataJSON[i].score_hiringRate_0 ,16);
	statesData_hiringRate_0.features[i].properties.dataType = "1인 이상 제조업 고용 / 전체 고용";

	statesData_hiringRate_300.features[i].properties.rawData = _dataJSON[i].hiringRate_300;
	statesData_hiringRate_300.features[i].properties.score = _dataJSON[i].score_hiringRate_300;
	statesData_hiringRate_300.features[i].properties.colour = getColor_basicMap(_dataJSON[i].score_hiringRate_300, 16);
	statesData_hiringRate_300.features[i].properties.dataType = "300인 이상 제조업 고용 / 전체 고용";

	statesData_hiringRate_1000.features[i].properties.rawData = _dataJSON[i].hiringRate_1000;
	statesData_hiringRate_1000.features[i].properties.score = _dataJSON[i].score_hiringRate_1000;
	statesData_hiringRate_1000.features[i].properties.colour = getColor_basicMap(_dataJSON[i].score_hiringRate_1000, 16);
	statesData_hiringRate_1000.features[i].properties.dataType = "1000인 이상 제조업 고용 / 전체 고용";

	statesData_extinctIndex.features[i].properties.rawData = _dataJSON[i].extinctIndex;
	statesData_extinctIndex.features[i].properties.score = _dataJSON[i].score_extinctIndex;
	statesData_extinctIndex.features[i].properties.colour = getColor(_dataJSON[i].score_extinctIndex, 50);
	statesData_extinctIndex.features[i].properties.dataType = "소멸지수";

	statesData_incomeRate.features[i].properties.rawData = _dataJSON[i].incomeRate;
	statesData_incomeRate.features[i].properties.score = _dataJSON[i].score_incomeRate;
	statesData_incomeRate.features[i].properties.colour = getColor(_dataJSON[i].score_incomeRate, 130);
	statesData_incomeRate.features[i].properties.dataType = "소득지 근로소득 / 원천징수지 근로소득";

	statesData_R_COSTII.features[i].properties.rawData = _dataJSON[i].R_COSTII;
	statesData_R_COSTII.features[i].properties.score = _dataJSON[i].score_R_COSTII;
	statesData_R_COSTII.features[i].properties.colour = getColor(_dataJSON[i].score_R_COSTII, 208);
	statesData_R_COSTII.features[i].properties.dataType = "R_COSTII";

	statesData_expertRate.features[i].properties.rawData = _dataJSON[i].expertRate;
	statesData_expertRate.features[i].properties.score = _dataJSON[i].score_expertRate;
	statesData_expertRate.features[i].properties.colour = getColor(_dataJSON[i].score_expertRate, 284);
	statesData_expertRate.features[i].properties.dataType = "관리자, 전문가 및 관련 종사자 / 전체 제조업 종사자";
}




// initialize whole map drawn by GeoJSON
var geojson_basicMap = L.geoJson(statesBasicMap, {
	pane: 'shadowPane',
	style: styleFunc_basicMap,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_hiringRate_0 = L.geoJson(statesData_hiringRate_0, {
	pane: 'shadowPane',
	style: styleFunc_basicMap,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_hiringRate_300 = L.geoJson(statesData_hiringRate_300, {
	pane: 'shadowPane',
	style: styleFunc_basicMap,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_hiringRate_1000 = L.geoJson(statesData_hiringRate_1000, {
	pane: 'shadowPane',
	style: styleFunc_basicMap,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_extinctIndex = L.geoJson(statesData_extinctIndex, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_incomeRate = L.geoJson(statesData_incomeRate, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_R_COSTII = L.geoJson(statesData_R_COSTII, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_expertRate = L.geoJson(statesData_expertRate, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);


// custom legend control
// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

// 	var div = L.DomUtil.create('div', 'info legend'),
// 		grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
// 		labels = [];

// 	// loop through our density intervals and generate a label with a colored square for each interval
// 	for (var i = 0; i < grades.length-1; i++) {
// 		div.innerHTML +=
// 			'<i style="background:' + getColor((grades[i]+grades[i+1])/2, 0) + '"></i> ' +
// 			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// 	}

// 	return div;
// };

// legend.addTo(map);



// Layer selection
var baseMaps = {
    // "<span style='color: gray'>Grayscale</span>": grayscale,
    "(그냥 지도)": geojson_basicMap,
	"1인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_0,
	"300인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_300,
	"1000인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_1000
};
var overlayMaps = {
	"소멸지수": geojson_extinctIndex,
	"소득지 근로소득 / 원천징수지 근로소득": geojson_incomeRate,
	"R-COSTII": geojson_R_COSTII,
	"관리자, 전문가 및 관련 종사자 / 전체 제조업 종사자": geojson_expertRate
};

L.control.layers(baseMaps, overlayMaps, {collapsed: false, autoZIndex: false, hideSingleBase: true}).addTo(map);
geojson_recent = geojson_basicMap;
map.removeLayer(geojson_hiringRate_0); 
map.removeLayer(geojson_hiringRate_300); 
map.removeLayer(geojson_hiringRate_1000); 
map.removeLayer(geojson_extinctIndex); 
map.removeLayer(geojson_incomeRate); 
map.removeLayer(geojson_R_COSTII); 
map.removeLayer(geojson_expertRate); 







// adding colour for choropleth map

function styleFunc(feature) {
	return {
		fillColor: feature.properties.colour,
		weight: 0.5,
		opacity: 1,
		color: 'blue',
		dashArray: '',
		fillOpacity: 0.7
	};
}
function styleFunc_basicMap(feature) {
	return {
		fillColor: feature.properties.colour,
		weight: 0.5,
		opacity: 1,
		color: 'blue',
		dashArray: '',
		fillOpacity: 0.5
	};
}



// initialize 'info': show information on it while hover on a polygon
var info = L.control();
info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML =  (props ?
		'<h4>' + props.dataType + '</h4>' + props.province_name + ' <b>' + props.municipal_name + '</b><br/>데이터: ' + props.rawData + '<br/>점수: ' + props.score
		: 'Hover over a state');
};
info.addTo(map);


// hover on/off events
// adding colour while hover on/off a polygon
function highlightFeature(e) {
	var layer = e.target;
	console.log(layer);

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: ''//,
		// fillOpacity: 0.5
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}
function resetHighlight(e) {
	// geojson_recent.resetStyle(e.target); //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	e.target.setStyle({
		weight: 0.5, 
		color: 'blue'
	})
	info.update();
}
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight//,
		// click: zoomToFeature
	});
}
