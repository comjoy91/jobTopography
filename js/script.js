

// var map = L.map('map').setView([37.8, -96], 4);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
// 	maxZoom: 18,
// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
// 	id: 'mapbox.light'
// }).addTo(map);


// BACKGROUND LAYER!!!!!
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

var map = L.map('map', {layers: [grayscale]}).setView([36, 128], 7);

var geojson_recent;
// map.on('baselayerchange', function(e) {
// 	geojson_recent = e.layer;
// 	console.log(geojson_recent);
// });


// functions for implementing rawData and score into initial geoJSON data 
var statesData_hiringRate_0 = JSON.parse(JSON.stringify(statesData)), 
	statesData_hiringRate_300 = JSON.parse(JSON.stringify(statesData)),
	statesData_hiringRate_1000 = JSON.parse(JSON.stringify(statesData)),
	statesData_extinctIndex = JSON.parse(JSON.stringify(statesData)),
	statesData_incomeRate = JSON.parse(JSON.stringify(statesData)),
	statesData_R_COSTII = JSON.parse(JSON.stringify(statesData)),
	statesData_expertRate = JSON.parse(JSON.stringify(statesData)), 
	statesData_meanScore = JSON.parse(JSON.stringify(statesData));

	statesData_hiringRate_0.name = "1인 이상 제조업 고용 / 전체 고용";
	statesData_hiringRate_300.name = "300인 이상 제조업 고용 / 전체 고용";
	statesData_hiringRate_1000.name = "1000인 이상 제조업 고용 / 전체 고용";
	statesData_extinctIndex.name = "소멸지수";
	statesData_incomeRate.name = "소득지 근로소득 / 원천징수지 근로소득";
	statesData_R_COSTII.name = "R_COSTII";
	statesData_expertRate.name = "관리자, 전문가 및 관련 종사자 / 전체 제조업 종사자";
	statesData_meanScore.name = "평균점수 (1인이상/300인이상 제조업고용은 제외)";

for (var i=0; i<statesData_hiringRate_0.features.length; i++) {
	statesData_hiringRate_0.features[i].properties.province = _dataJSON[i].province_name;
	statesData_hiringRate_0.features[i].properties.rawData = _dataJSON[i].hiringRate_0;
	statesData_hiringRate_0.features[i].properties.score = _dataJSON[i].score_hiringRate_0;

	statesData_hiringRate_300.features[i].properties.province = _dataJSON[i].province_name;
	statesData_hiringRate_300.features[i].properties.rawData = _dataJSON[i].hiringRate_300;
	statesData_hiringRate_300.features[i].properties.score = _dataJSON[i].score_hiringRate_300;

	statesData_hiringRate_1000.features[i].properties.province = _dataJSON[i].province_name;
	statesData_hiringRate_1000.features[i].properties.rawData = _dataJSON[i].hiringRate_1000;
	statesData_hiringRate_1000.features[i].properties.score = _dataJSON[i].score_hiringRate_1000;

	statesData_extinctIndex.features[i].properties.province = _dataJSON[i].province_name;
	statesData_extinctIndex.features[i].properties.rawData = _dataJSON[i].extinctIndex;
	statesData_extinctIndex.features[i].properties.score = _dataJSON[i].score_extinctIndex;

	statesData_incomeRate.features[i].properties.province = _dataJSON[i].province_name;
	statesData_incomeRate.features[i].properties.rawData = _dataJSON[i].incomeRate;
	statesData_incomeRate.features[i].properties.score = _dataJSON[i].score_incomeRate;

	statesData_R_COSTII.features[i].properties.province = _dataJSON[i].province_name;
	statesData_R_COSTII.features[i].properties.rawData = _dataJSON[i].R_COSTII;
	statesData_R_COSTII.features[i].properties.score = _dataJSON[i].score_R_COSTII;

	statesData_expertRate.features[i].properties.province = _dataJSON[i].province_name;
	statesData_expertRate.features[i].properties.rawData = _dataJSON[i].expertRate;
	statesData_expertRate.features[i].properties.score = _dataJSON[i].score_expertRate;

	statesData_meanScore.features[i].properties.province = _dataJSON[i].province_name;
	statesData_meanScore.features[i].properties.rawData = _dataJSON[i].meanScore;
	statesData_meanScore.features[i].properties.score = _dataJSON[i].meanScore;
}




// initialize whole map drawn by GeoJSON
var geojson_hiringRate_0 = L.geoJson(statesData_hiringRate_0, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_hiringRate_300 = L.geoJson(statesData_hiringRate_300, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

var geojson_hiringRate_1000 = L.geoJson(statesData_hiringRate_1000, {
	style: styleFunc,
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

var geojson_meanScore = L.geoJson(statesData_meanScore, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);



// custom legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length-1; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);



// Layer selection
// var baseMaps = {
//     "<span style='color: gray'>Grayscale</span>": grayscale//,
// //    "Streets": streets
// };
var baseMaps = {
    "1인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_0,
    "300인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_300,
    "1000인 이상 제조업 고용 / 전체 고용": geojson_hiringRate_1000,
    "소멸지수": geojson_extinctIndex,
    "소득지 근로소득 / 원천징수지 근로소득": geojson_incomeRate,
    "R-COSTII": geojson_R_COSTII,
    "관리자, 전문가 및 관련 종사자 / 전체 제조업 종사자": geojson_expertRate,
    "평균점수 (1인이상/300인이상 제조업고용은 제외)": geojson_meanScore
};

var overlayMaps = {};

L.control.layers(baseMaps, overlayMaps, {collapsed: false, hideSingleBase: true}).addTo(map);
geojson_recent = geojson_hiringRate_300;







// adding colour for choropleth map
function getColor(d) {
	return d >= 90 ? '#7F2704' :
		   d >= 80 ? '#A63603' :
		   d >= 70 ? '#D94801' :
		   d >= 60 ? '#F16913' :
		   d >= 50 ? '#FD8D3C' :
		   d >= 40 ? '#FDAE6B' :
		   d >= 30 ? '#FDD0A2' :
		   d >= 20 ? '#FEE6CE' :
		   d >= 10 ? '#FFF5EB' :
					 '#FFFFFF';
}
function styleFunc(feature) {
	return {
		fillColor: getColor(feature.properties.score),
		weight: 0.5,
		opacity: 1.0,
		color: 'blue',
		dashArray: '0',
		fillOpacity: 1.0
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
	this._div.innerHTML =  /*'<h4>' + geojson_recent.name + '</h4>' + */(props ?
		props.province + ' <b>' + props.name + '</b><br/>데이터: ' + props.rawData + '<br/>점수: ' + props.score
		: 'Hover over a state');
};
info.addTo(map);


// hover on/off events
// adding colour while hover on/off a polygon
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 1.0
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}
function resetHighlight(e) {
	geojson_recent.resetStyle(e.target); //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	info.update();
}
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}
