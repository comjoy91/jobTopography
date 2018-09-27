// BACKGROUND LAYER!!!!!
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	mbUrl = 'https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}@2x.png?key=JrAhm6tBG7Y3CCaBBIMe';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});

var map = L.map('map_background', {layers: [grayscale], zoomControl: false, scrollWheelZoom: true}).setView([36, 128], 7);
L.control.attribution({position: 'bottomleft'});


// getting colour
function getColour(_score, _hueValue) {
	var coluorFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0), {outputHue: 0, outputSaturation: '100%'});
	return coluorFunction.evaluate(_score);
}

// functions for filling search_contents.
var search_contents = [];





// functions for implementing rawData and score into initial geoJSON data.
for (var i=0; i<statesData.features.length; i++) {
	var prop = statesData.features[i].properties;
	prop.hiringRate_300 = {
		rawData: _dataJSON.municipals[i].hiringRate_300,
		score: _dataJSON.municipals[i].score_hiringRate_300,
		scoreName: "300인 이상 제조업 집중도", 
		dataName: ""
	};
	prop.hiringRate_1000 = {
		rawData: _dataJSON.municipals[i].hiringRate_1000,
		score: _dataJSON.municipals[i].score_hiringRate_1000,
		scoreName: "1000인 이상 제조업 집중도", 
		dataName: ""
	};
	prop.mainIndustryPortion = {
		rawData: _dataJSON.municipals[i].mainIndustryPortion,
		score: _dataJSON.municipals[i].score_mainIndustryPortion,
		scoreName: "제1 제조업 집중도", 
		dataName: ""
	};
	prop.rateOf20sInIndustry = {
		rawData: _dataJSON.municipals[i].rateOf20sInIndustry,
		score: _dataJSON.municipals[i].score_rateOf20sInIndustry,
		scoreName: "제조업 고령화", 
		dataName: ""
	};
	prop.industryJobCreation = {
		rawData: _dataJSON.municipals[i].industryJobCreation,
		score: _dataJSON.municipals[i].score_industryJobCreation,
		scoreName: "일자리창출률", 
		dataName: ""
	};
	prop.incomeRate = {
		rawData: _dataJSON.municipals[i].incomeRate,
		score: _dataJSON.municipals[i].score_incomeRate,
		scoreName: "직장인-주민 일치 비율", 
		dataName: ""
	};
	prop.R_COSTII = {
		rawData: _dataJSON.municipals[i].R_COSTII,
		score: _dataJSON.municipals[i].score_R_COSTII,
		scoreName: "과학기술혁신 역량 지수", 
		dataName: ""
	};
	prop.expertRate = {
		rawData: _dataJSON.municipals[i].expertRate,
		score: _dataJSON.municipals[i].score_expertRate,
		scoreName: "관리자, 전문가 비중", 
		dataName: ""
	};
	prop.otherRawData = {
		population: _dataJSON.municipals[i].population,
		mean_age: _dataJSON.municipals[i].mean_age,
		numWorkers_inDistrict: _dataJSON.municipals[i].numWorkers_inDistrict,
		numWorkers_0: _dataJSON.municipals[i].numWorkers_0,
		numWorkers_300: _dataJSON.municipals[i].numWorkers_300,
		numWorkers_1000: _dataJSON.municipals[i].numWorkers_1000,
		mainIndustry_0: _dataJSON.municipals[i].mainIndustry_0,
		mainIndustry_300: _dataJSON.municipals[i].mainIndustry_300,
		mainIndustry_1000: _dataJSON.municipals[i].mainIndustry_1000,
		factory: _dataJSON.municipals[i].factory
	};
	prop.score_total = prop.hiringRate_300.score;
}

for (var i=0; i<_province_border.features.length; i++) {
	var prop = _province_border.features[i].properties;
	prop.hiringRate_300 = {
		rawData: _dataJSON.provinces[i].hiringRate_300,
		score: _dataJSON.provinces[i].score_hiringRate_300,
		scoreName: "300인 이상 제조업 집중도", 
		dataName: ""
	};
	prop.hiringRate_1000 = {
		rawData: _dataJSON.provinces[i].hiringRate_1000,
		score: _dataJSON.provinces[i].score_hiringRate_1000,
		scoreName: "1000인 이상 제조업 집중도", 
		dataName: ""
	};
	prop.mainIndustryPortion = {
		rawData: _dataJSON.municipals[i].mainIndustryPortion,
		score: _dataJSON.municipals[i].score_mainIndustryPortion,
		scoreName: "제1 제조업 집중도", 
		dataName: ""
	};
	prop.rateOf20sInIndustry = {
		rawData: _dataJSON.provinces[i].rateOf20sInIndustry,
		score: _dataJSON.provinces[i].score_rateOf20sInIndustry,
		scoreName: "제조업 고령화", 
		dataName: ""
	};
	prop.industryJobCreation = {
		rawData: _dataJSON.municipals[i].industryJobCreation,
		score: _dataJSON.municipals[i].score_industryJobCreation,
		scoreName: "일자리창출률", 
		dataName: ""
	};
	prop.incomeRate = {
		rawData: _dataJSON.provinces[i].incomeRate,
		score: _dataJSON.provinces[i].score_incomeRate,
		scoreName: "직장인-주민 일치 비율", 
		dataName: ""
	};
	prop.R_COSTII = {
		rawData: _dataJSON.provinces[i].R_COSTII,
		score: _dataJSON.provinces[i].score_R_COSTII,
		scoreName: "과학기술혁신 역량 지수", 
		dataName: ""
	};
	prop.expertRate = {
		rawData: _dataJSON.provinces[i].expertRate,
		score: _dataJSON.provinces[i].score_expertRate,
		scoreName: "관리자, 전문가 비중", 
		dataName: ""
	};
	prop.otherRawData = {
		population: _dataJSON.provinces[i].population,
		mean_age: _dataJSON.provinces[i].mean_age,
		numWorkers_inDistrict: _dataJSON.provinces[i].numWorkers_inDistrict,
		numWorkers_0: _dataJSON.provinces[i].numWorkers_0,
		numWorkers_300: _dataJSON.provinces[i].numWorkers_300,
		numWorkers_1000: _dataJSON.provinces[i].numWorkers_1000,
		mainIndustry_0: _dataJSON.provinces[i].mainIndustry_0,
		mainIndustry_300: _dataJSON.provinces[i].mainIndustry_300,
		mainIndustry_1000: _dataJSON.provinces[i].mainIndustry_1000,
		factory: _dataJSON.provinces[i].factory
	};
	prop.score_total = prop.hiringRate_300.score;
}






// var	statesData_disCont_50 = JSON.parse(JSON.stringify(statesData));
var statesData_array = [statesData, _province_border];




// initialize whole map drawn by GeoJSON
var geojson_statesData = L.geoJson(statesData, {
	style: styleFunc,
	onEachFeature: onEachFeature_municipal
}).addTo(map);
var geojson_province_border = L.geoJson(_province_border, {
	style: styleFunc_province_border,
	onEachFeature: onEachFeature_province
}).addTo(map);

// functions for filling search_contents.
geojson_statesData.eachLayer(function (_layer) {
	var prop = _layer.feature.properties;
	search_contents.push({
		title: prop.province_name + " <b>" + prop.municipal_name + "</b>",
		title_string: prop.province_name + " " + prop.municipal_name,
		province_name: prop.province_name,
		municipal_name: prop.municipal_name,
		layer: _layer
	});
});

// Layer selection
var baseMaps = {
	// "<span style='color: gray'>Grayscale</span>": grayscale,
	"300인 이상 제조업 집중도": geojson_statesData
};
var geojson_array = [geojson_statesData, geojson_province_border];
var overlayMaps = {
};

// L.control.layers(baseMaps, overlayMaps, {collapsed: false, hideSingleBase: false, position: 'topleft'}).addTo(map);
// map.removeLayer(geojson_disCont_100); 







// custom legend control
// var legend = L.control({position: 'bottomleft'});

// legend.onAdd = function (map) {

// 	var div = L.DomUtil.create('div', 'info legend'),
// 		grades = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
// 		labels = [];

// 	// loop through our density intervals and generate a label with a colored square for each interval
// 	for (var i = 0; i < grades.length-1; i++) {
// 		div.innerHTML +=
// 			'<i style="background:' + getColour((grades[i]+grades[i+1])/2, 0) + '"></i> ' +
// 			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// 	}

// 	return div;
// };

// legend.addTo(map);


// checkboxes for adding score.
// var checkboxes = L.control({position: 'topleft'});
// checkboxes.onAdd = function (map) {
// 	this._div = L.DomUtil.create('div', 'checkboxes'); // create a div with a class "checkboxes"
// 	this._div.innerHTML = '<div class="selectbox" id="electionType">\
// 								<div class="UIName">조사년도</div>\
// 								<select class="UI" onchange="change_electionType()">\
// 									<option value="local-pp" disabled>2014</option>\
// 									<option value="local-pa" disabled>2015</option>\
// 									<option value="local-ea" selected>2016</option>\
// 								</select>\
// 							</div>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_hiringRate_300" disabled="disabled" checked="checked"> <label>300인 이상 제조업 집중도</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_hiringRate_1000" onclick="updateScore()"> <label>1000인 이상 제조업 집중도</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_mainIndustryPortion" onclick="updateScore()"> <label>제1 제조업 집중도</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_rateOf20sInIndustry" onclick="updateScore()"> <label>제조업 고령화</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_industryJobCreation" onclick="updateScore()"> <label>일자리창출률</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_incomeRate" onclick="updateScore()"> <label>직장인-주민 일치 비율</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_R_COSTII" onclick="updateScore()"> <label>과학기술혁신 역량 지수</label></div><br/>\
// 							<div class="ui checkbox"> <input type="checkbox" id="check_expertRate" onclick="updateScore()"> <label>관리자, 전문가 비중</label></div>';
// 	return this._div;
// };


var check_hiringRate_1000 = document.getElementById("check_hiringRate_1000"),  
	check_mainIndustryPortion = document.getElementById("check_mainIndustryPortion"),
	check_rateOf20sInIndustry = document.getElementById("check_rateOf20sInIndustry"),
	check_industryJobCreation = document.getElementById("check_industryJobCreation"), 
	check_incomeRate = document.getElementById("check_incomeRate"), 
	check_R_COSTII = document.getElementById("check_R_COSTII"), 
	check_expertRate = document.getElementById("check_expertRate");


$("#checkUI_hiringRate_1000").checkbox({
	onChange: function(){
		$("#result_municipal_hiringRate_1000").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_mainIndustryPortion").checkbox({
	onChange: function(){
		$("#result_municipal_mainIndustryPortion").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_rateOf20sInIndustry").checkbox({
	onChange: function(){
		$("#result_municipal_rateOf20sInIndustry").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_industryJobCreation").checkbox({
	onChange: function(){
		$("#result_municipal_industryJobCreation").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_incomeRate").checkbox({
	onChange: function(){
		$("#result_municipal_incomeRate").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_R_COSTII").checkbox({
	onChange: function(){
		$("#result_municipal_R_COSTII").toggleClass("unlayered"); updateScore();
	}
});
$("#checkUI_expertRate").checkbox({
	onChange: function(){
		$("#result_municipal_expertRate").toggleClass("unlayered"); updateScore();
	}
});


function updateScore() {
	for (var statesData of statesData_array) {
		for (var feature of statesData.features) {
			var prop = feature.properties;
			prop.score_total = prop.hiringRate_300.score;

			if (check_hiringRate_1000.checked)
				prop.score_total += prop.hiringRate_1000.score;
			if (check_mainIndustryPortion.checked)
				prop.score_total += prop.mainIndustryPortion.score;
			if (check_rateOf20sInIndustry.checked)
				prop.score_total += prop.rateOf20sInIndustry.score;
			if (check_industryJobCreation.checked)
				prop.score_total += prop.industryJobCreation.score;
			if (check_incomeRate.checked)
				prop.score_total += prop.incomeRate.score;
			if (check_R_COSTII.checked)
				prop.score_total += prop.R_COSTII.score;
			if (check_expertRate.checked)
				prop.score_total += prop.expertRate.score;

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
	if (current_municipal_layer)
		info_votes(current_municipal_layer.feature.properties);
};
// checkboxes.addTo(map);



L.control.zoom({position: 'bottomleft'}).addTo(map);





// adding colour for choropleth map
function styleFunc(feature) {
	return {
		fillColor: getColour(feature.properties.score_total, 16),
		weight: 0.5,
		opacity: 0.15,
		color: 'blue',
		dashArray: '',
		fillOpacity: 0.7
	};
}

function styleFunc_province_border(feature) {
	return {
		color: 'green', 
		weight: 1.4, 
		opacity: 1,
		fillColor: 'black', 
		fillOpacity: 0
	}
}



// hover on/off events
// adding colour while hover on/off a polygon
var current_municipal_layer = null;
var current_province_layer = null;


function highlightFeature(e) {
	var layer = e.target;
	if (layer != current_municipal_layer) {
		layer.setStyle({
			weight: 4,
			color: '#248',
			dashArray: '', 
			opacity: 0.7//,
			// fillOpacity: 0.5
		});
	}
	

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
		// if (current_municipal_layer) {
		// 	current_municipal_layer.bringToFront();
		// }
	}
	// info.update(layer.feature.properties);
	tooltip.style("display", "inline");
}

var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("display", "none");
function districtTooltip(e) { //build tooltip for mouseover layer
	tooltip.html(e.target.feature.properties.province_name + " <b>" + e.target.feature.properties.municipal_name + "</b><br> 현재 점수: " + e.target.feature.properties.score_total + "/100")
		.style("left", (e.containerPoint.x - 34) + "px")
		.style("top", (e.containerPoint.y - 12) + "px");
}
function resetHighlight(e) { //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	if (e.target != current_municipal_layer) {
		e.target.setStyle({
			weight: 0.5,
			opacity: 0.15,
			color: 'blue'
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			e.target.bringToBack();
			if (current_municipal_layer) {
				current_municipal_layer.bringToFront();
			}
		}
	}
		
	// info.update();
	tooltip.style("display", "none");
}

function municipal_toProvince(_layer) {
	return geojson_province_border.getLayers()[_layer.feature.properties.province_index];
}
function municipal_toProvince_data(_prop) {
	return geojson_province_border.getLayers()[_prop.province_index].feature.properties;
}

function zoomToFeature_layer(_layer) {
	if (current_municipal_layer) {
		current_municipal_layer.setStyle({
			weight: 0.5,
			opacity: 0.15,
			color: 'blue'
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			current_municipal_layer.bringToBack();
		}
	}
	if (current_province_layer)
		geojson_province_border.resetStyle(current_province_layer);


	current_municipal_layer = _layer;
	current_province_layer = municipal_toProvince(_layer)
	map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [380, 0]});
	current_province_layer.setStyle({
		color: '#248'
	});
	_layer.setStyle({
		weight: 4,
		color: '#248',
		dashArray: '', 
		opacity: 1//,
		// fillOpacity: 0.5
	});
	info_votes(_layer.feature.properties);
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		current_province_layer.bringToFront();
		current_municipal_layer.bringToFront();
	}
}
function zoomToFeature(e) {
	zoomToFeature_layer(e.target);
}




function onEachFeature_municipal(_feature, _layer) {
	_layer.on({
		mouseover: highlightFeature,
		mousemove: districtTooltip,
		mouseout: resetHighlight,
		click: zoomToFeature
	});

	
}

function onEachFeature_province(_feature, _layer) {
	// _layer.on({
	// 	mouseover: highlightFeature,
	// 	mousemove: districtTooltip,
	// 	mouseout: resetHighlight,
	// 	click: zoomToFeature
	// });

	// functions for filling search_contents.
	var prop = _feature.properties;
	search_contents.push({
		title: "<b>" + prop.province_name + "</b> (전체)",
		title_string: prop.province_name + " (전체)",
		province_name: "",
		municipal_name: prop.province_name,
		layer: _layer
	});
}



$('.ui.search').search({
	source: search_contents,
	searchFields: ['title_string'],
	showNoResults: false,
	fullTextSearch: 'exact',
	maxResults: 8,
	onSelect: function(result, response) { zoomToFeature_layer (result.layer); }
});





$('#menu_municipal, #menu_province').on('click', function() {
	$('#menu_municipal, #menu_province').removeClass("active");
	$(this).addClass("active");
	if (current_municipal_layer)
		info_votes(current_municipal_layer.feature.properties);
});


