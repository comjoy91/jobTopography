// BACKGROUND LAYER!!!!!
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});

var map = L.map('map', {layers: [grayscale]}).setView([36, 128], 7);

// var geojsonBase_recent;
// var geojsonOverlay_recent;
// map.on('overlayadd', function(e) {
// 	geojsonOverlay_recent = e.layer;
// 	console.log(geojsonOverlay_recent);
// });
// map.on('baselayerchange', function(e) {
// 	geojsonBase_recent = e.layer;
// 	console.log(geojsonBase_recent);
// });


// getting colour
function getColour(_score, _hueValue) {
	var coluorFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0), {outputHue: 0, outputSaturation: '100%'});
	return coluorFunction.evaluate(_score);
}






// functions for implementing rawData and score into initial geoJSON data 

for (var i=0; i<statesData.features.length; i++) {
	var prop = statesData.features[i].properties;
	prop.hiringRate_300 = {
		rawData: _dataJSON[i].hiringRate_300,
		score: _dataJSON[i].score_hiringRate_300_cont,
		typeName: "300인 이상 제조업 고용 / 전체 고용"
	};
	prop.hiringRate_1000 = {
		rawData: _dataJSON[i].hiringRate_1000,
		score: _dataJSON[i].score_hiringRate_1000,
		typeName: "1000인 이상 제조업 고용 / 전체 고용"
	};
	prop.rateOf20sInManufact = {
		rawData: _dataJSON[i].rateOf20sInManufact,
		score: _dataJSON[i].score_rateOf20sInManufact,
		typeName: "제조업 종사자 중 20대 비중"
	};
	prop.incomeRate = {
		rawData: _dataJSON[i].incomeRate,
		score: _dataJSON[i].score_incomeRate,
		typeName: "소득지 근로소득 / 원천징수지 근로소득"
	};
	prop.R_COSTII = {
		rawData: _dataJSON[i].R_COSTII,
		score: _dataJSON[i].score_R_COSTII,
		typeName: "R-COSTII"
	};
	prop.expertRate = {
		rawData: _dataJSON[i].expertRate,
		score: _dataJSON[i].score_expertRate,
		typeName: "관리자, 전문가 비중"/*"관리자, 전문가 및 관련 종사자 / 전체 제조업 종사자"*/
	};
	prop.score_total = prop.hiringRate_300.score;
}

var statesData_cont_100 = statesData, 
	statesData_disCont_100 = JSON.parse(JSON.stringify(statesData)), 
	statesData_cont_50 = JSON.parse(JSON.stringify(statesData)),
	statesData_disCont_50 = JSON.parse(JSON.stringify(statesData));

for (var i=0; i<statesData.features.length; i++) {
	var prop = statesData_disCont_100.features[i].properties;
	prop.hiringRate_300.score = _dataJSON[i].score_hiringRate_300_disCont;
	prop.score_total = prop.hiringRate_300.score;

	prop = statesData_cont_50.features[i].properties;
	prop.hiringRate_300.score = Math.round(_dataJSON[i].score_hiringRate_300_cont * 100) / 200;
	prop.score_total = prop.hiringRate_300.score;

	prop = statesData_disCont_50.features[i].properties;
	prop.hiringRate_300.score = _dataJSON[i].score_hiringRate_300_disCont * 50 / 100;
	prop.score_total = prop.hiringRate_300.score;
}

var statesData_array = [statesData_cont_100, statesData_disCont_100, statesData_cont_50, statesData_disCont_50];





// initialize whole map drawn by GeoJSON
var geojson_cont_100 = L.geoJson(statesData_cont_100, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);
var geojson_disCont_100 = L.geoJson(statesData_disCont_100, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);
var geojson_cont_50 = L.geoJson(statesData_cont_50, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);
var geojson_disCont_50 = L.geoJson(statesData_disCont_50, {
	style: styleFunc,
	onEachFeature: onEachFeature
}).addTo(map);

// Layer selection
var baseMaps = {
	// "<span style='color: gray'>Grayscale</span>": grayscale,
	"300인 이상 제조업 고용 / 전체 고용: <b>100점 연속</b>": geojson_cont_100, 
	"300인 이상 제조업 고용 / 전체 고용: <b>100점 불연속</b>": geojson_disCont_100, 
	"300인 이상 제조업 고용 / 전체 고용: <b>50점 연속</b>": geojson_cont_50, 
	"300인 이상 제조업 고용 / 전체 고용: <b>50점 불연속</b>": geojson_disCont_50
};
var geojson_array = [geojson_cont_100, geojson_disCont_100, geojson_cont_50, geojson_disCont_50];
var overlayMaps = {
};

L.control.layers(baseMaps, overlayMaps, {collapsed: false, hideSingleBase: false}).addTo(map);
map.removeLayer(geojson_disCont_100); 
map.removeLayer(geojson_cont_50); 
map.removeLayer(geojson_disCont_50); 







// custom legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
		labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length-1; i++) {
		div.innerHTML +=
			'<i style="background:' + getColour((grades[i]+grades[i+1])/2, 0) + '"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}

	return div;
};

legend.addTo(map);







// checkboxes for adding score.
var checkboxes = L.control();
checkboxes.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'checkboxes'); // create a div with a class "checkboxes"
	this._div.innerHTML = '<input type="checkbox" id="check_hiringRate_1000" onclick="updateScore()"> 1000인 이상 제조업 고용 / 전체 고용<br/>'
						+ '<input type="checkbox" id="check_rateOf20sInManufact" onclick="updateScore()"> 제조업 종사자 중 20대 비중<br/>'
						+ '<input type="checkbox" id="check_incomeRate" onclick="updateScore()"> 소득지 근로소득 / 원천징수지 근로소득<br/>'
						+ '<input type="checkbox" id="check_R_COSTII" onclick="updateScore()"> R-COSTII<br/>'
						+ '<input type="checkbox" id="check_expertRate" onclick="updateScore()"> 관리자, 전문가 비중<br/>';
	return this._div;
};
function updateScore() {
	var check_hiringRate_1000 = document.getElementById("check_hiringRate_1000"), 
		check_rateOf20sInManufact = document.getElementById("check_rateOf20sInManufact"), 
		check_incomeRate = document.getElementById("check_incomeRate"), 
		check_R_COSTII = document.getElementById("check_R_COSTII"), 
		check_expertRate = document.getElementById("check_expertRate");

	for (var statesData of statesData_array) {
		for (var feature of statesData.features) {
			var prop = feature.properties;
			prop.score_total = prop.hiringRate_300.score;
			if (check_hiringRate_1000.checked) {
				prop.score_total += prop.hiringRate_1000.score;
			}
			if (check_rateOf20sInManufact.checked) {
				prop.score_total += prop.rateOf20sInManufact.score;
			}
			if (check_incomeRate.checked) {
				prop.score_total += prop.incomeRate.score;
			}
			if (check_R_COSTII.checked) {
				prop.score_total += prop.R_COSTII.score;
			}
			if (check_expertRate.checked) {
				prop.score_total += prop.expertRate.score;
			}

			if (prop.score_total > 100) prop.score_total = 100;
		}
	}

	for (var geojson of geojson_array) {
		geojson.eachLayer(function(layer) {
			layer.setStyle({
				fillColor: getColour(layer.feature.properties.score_total, 16)
			});
		});
	}
};
checkboxes.addTo(map);







// adding colour for choropleth map
function styleFunc(feature) {
	return {
		fillColor: getColour(feature.properties.score_total, 16),
		weight: 0.5,
		opacity: 1,
		color: 'blue',
		dashArray: '',
		fillOpacity: 0.7
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
	if (props) {
		this._div.innerHTML = props.province_name + ' <b>' + props.municipal_name + '</b>'
							+ '<h4>현재 지도상의 점수: ' + props.score_total + '</h4>'
							+ '<b>' + props.hiringRate_300.typeName + '</b><br/>' + '데이터: ' + props.hiringRate_300.rawData + '<br/>점수: ' + props.hiringRate_300.score + '<br/><br/>'
							+ '<b>' + props.hiringRate_1000.typeName + '</b><br/>' + '데이터: ' + props.hiringRate_1000.rawData + '<br/>점수: ' + props.hiringRate_1000.score + '<br/><br/>'
							+ '<b>' + props.rateOf20sInManufact.typeName + '</b><br/>' + '데이터: ' + props.rateOf20sInManufact.rawData + '<br/>점수: ' + props.rateOf20sInManufact.score + '<br/><br/>'
							+ '<b>' + props.incomeRate.typeName + '</b><br/>' + '데이터: ' + props.incomeRate.rawData + '<br/>점수: ' + props.incomeRate.score + '<br/><br/>'
							+ '<b>' + props.R_COSTII.typeName + '</b><br/>' + '데이터: ' + props.R_COSTII.rawData + '<br/>점수: ' + props.R_COSTII.score + '<br/><br/>'
							+ '<b>' + props.expertRate.typeName + '</b><br/>' + '데이터: ' + props.expertRate.rawData + '<br/>점수: ' + props.expertRate.score;
	}
	else this._div.innerHTML = 'Hover over a state';
};
info.addTo(map);


// hover on/off events
// adding colour while hover on/off a polygon
function highlightFeature(e) {
	var layer = e.target;
	// console.log(layer);

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
function resetHighlight(e) { //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	e.target.setStyle({
		weight: 0.5, 
		color: 'blue'
	})
	info.update();
}
function zoomToFeature(e) {
	// map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight//,
		// click: zoomToFeature
	});
}
