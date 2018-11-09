
// ---------- constant variable for styling polygon layers ----------

const municipal_style = {
	fillOpacity: 0.7,
	fillColor_invalid: "#aaaaaa",
	fillOpacity_invalid: 0.85,
	color: 'blue',
	opacity: 0.15,
	weight: 0.5,
	color_hover: '#248', 
	opacity_hover: 0.7, 
	weight_hover: 4, 
	color_selected: '#248',
	opacity_selected: 1.0,
	weight_selected: 4
};

const province_style = {
	fillColor: 'black', 
	fillOpacity: 0,
	color: 'green', 
	opacity: 0.25,
	weight: 1.4, 
	color_selected: '#248',
	opacity_selected: 1.0,
	weight_selected: 1.4
}







// ---------- getting colour ----------

function getColour_multiLayer(_score) { // _outputHue == 0, _maxColourValue == 100
	var colourFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0), {outputHue: 0, outputSaturation: '100%'});
	return colourFunction.evaluate(_score);
}
function getColour_singleLayer(_score, _maxScore) { // _outputHue == 35, _maxColourValue == 50
	var colourFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0), {outputHue: 35, outputSaturation: '100%'});
	return colourFunction.evaluate(_score / _maxScore * 50);
}

// ---------- choose province(layer or properties) which include selected municipal ----------

function municipal_toProvince_layer(_layer) {
	return layer_province_border.getLayers()[_layer.feature.properties.province_index];
}
function municipal_toProvince_prop(_prop) {
	return layer_province_border.getLayers()[_prop.province_index].feature.properties;
}


// ---------- initialize whole map drawn by GeoJSON ----------

function onEachFeature_municipal(_feature, _layer) { // 
	_layer.on({
		mouseover: highlightFeature,
		mousemove: districtTooltip,
		mouseout: resetHighlight,
		click: zoomToFeature
	});

	// functions for filling search_contents.
	var prop = _layer.feature.properties;
	search_contents.push({
		title: prop.province_name + " <b>" + prop.municipal_name + "</b>",
		title_string: prop.province_name + " " + prop.municipal_name,
		province_name: prop.province_name,
		municipal_name: prop.municipal_name,
		layer: _layer
	});	
}


// adding colour for choropleth map
function styleFunc_municipal(feature) {
	if ( feature.properties.score_total <= 0 ) {
		return {
			fillColor: municipal_style.fillColor_invalid,
			fillOpacity: municipal_style.fillOpacity_invalid,
			color: municipal_style.color,
			opacity: municipal_style.opacity,
			weight: municipal_style.weight
		}
	}
	else return {
		fillColor: getColour_multiLayer(feature.properties.score_total),
		fillOpacity: municipal_style.fillOpacity,
		color: municipal_style.color,
		opacity: municipal_style.opacity,
		weight: municipal_style.weight
	};
}

function styleFunc_province_border(feature) {
	return {
		fillColor: province_style.fillColor, 
		fillOpacity: province_style.fillOpacity,
		color: province_style.color, 
		opacity: province_style.opacity,
		weight: province_style.weight
	}
}

var layer_municipal = L.geoJson(municipalGeoJSON, {
	style: styleFunc_municipal,
	onEachFeature: onEachFeature_municipal
}).addTo(map);

var layer_province_border = L.geoJson(provinceGeoJSON, {
	style: styleFunc_province_border
}).addTo(map);




// ---------- updating score to re-colour the map. ----------

function updateScore_check() {
	layer_municipal.eachLayer(function(_layer) {

		var prop = _layer.feature.properties;
		var data = prop.data[year_index];
		prop.score_total = data.hiringRate_300.score;

		if ( data.hiringRate_300.score > 0 ) {
			if (check_hiringRate_1000.checked)
				prop.score_total += data.hiringRate_1000.score;
			if (check_mainIndustryPortion.checked)
				prop.score_total += data.mainIndustryPortion.score;
			if (check_rateOf20sInIndustry.checked)
				prop.score_total += data.rateOf20sInIndustry.score;
			if (check_industryJobCreation.checked)
				prop.score_total += data.industryJobCreation.score;
			if (check_incomeRate.checked)
				prop.score_total += data.incomeRate.score;
			if (check_R_COSTII.checked)
				prop.score_total += data.R_COSTII.score;
			if (check_expertRate.checked)
				prop.score_total += data.expertRate.score;

			if (prop.score_total > 100) prop.score_total = 100;

			prop.validForResearch = true;
			_layer.setStyle({
				fillColor: getColour_multiLayer(prop.score_total),
				fillOpacity: municipal_style.fillOpacity
			});
		}

		else {
			prop.validForResearch = false;
			_layer.setStyle({
				fillColor: municipal_style.fillColor_invalid,
				fillOpacity: municipal_style.fillOpacity_invalid
			});
		}
	});

	if (current_municipal_layer)
		change_dataInfo(current_municipal_layer.feature.properties);
};



function updateScore_radio() {
	layer_municipal.eachLayer(function(_layer) {

		var prop = _layer.feature.properties;
		var data = prop.data[year_index];
		var max_score;

		if ( data.hiringRate_300.score > 0 ) {
			if (radio_hiringRate_300.checked) {
				prop.score_total = data.hiringRate_300.score;
				max_score = 30;
			}
			else if (radio_hiringRate_1000.checked) {
				prop.score_total = data.hiringRate_1000.score;
				max_score = 10;
			}
			else if (radio_mainIndustryPortion.checked) {
				prop.score_total = data.mainIndustryPortion.score;
				max_score = 10;
			}
			else if (radio_rateOf20sInIndustry.checked) {
				prop.score_total = data.rateOf20sInIndustry.score;
				max_score = 10;
			}
			else if (radio_industryJobCreation.checked) {
				prop.score_total = data.industryJobCreation.score;
				max_score = 10;
			}
			else if (radio_incomeRate.checked) {
				prop.score_total = data.incomeRate.score;
				max_score = 10;
			}
			else if (radio_R_COSTII.checked) {
				prop.score_total = data.R_COSTII.score;
				max_score = 10;
			}
			else if (radio_expertRate.checked) {
				prop.score_total = data.expertRate.score;
				max_score = 10;
			}

			prop.validForResearch = true;
			_layer.setStyle({
				fillColor: getColour_singleLayer(prop.score_total, max_score),
				fillOpacity: municipal_style.fillOpacity
			});
		}

		else {
			prop.validForResearch = false;
			_layer.setStyle({
				fillColor: municipal_style.fillColor_invalid,
				fillOpacity: municipal_style.fillOpacity_invalid
			});
		}

	});

	if (current_municipal_layer)
		change_dataInfo(current_municipal_layer.feature.properties);
};







// ---------- hover on events ----------

// 1. highlight the feature. 
function highlightFeature(e) {
	var layer = e.target;
	if (layer != current_municipal_layer) {
		layer.setStyle({
			color: municipal_style.color_hover,
			opacity: municipal_style.opacity_hover,
			weight: municipal_style.weight_hover,
		});
	}
	
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	tooltip.style("display", "inline");
}

// 2. build a tooltip.
var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("display", "none");
function districtTooltip(e) { //build tooltip for mouseover layer
	var tooltipHTML;
	if ( e.target.feature.properties.validForResearch ) 
		tooltipHTML = e.target.feature.properties.province_name + " <b>" 
					+ e.target.feature.properties.municipal_name + "</b><br> 현재 Total: " 
					+ d3.format(".1f")(e.target.feature.properties.score_total);// + " / 100.0";
	else
		tooltipHTML = e.target.feature.properties.province_name + " <b>" 
					+ e.target.feature.properties.municipal_name + "</b><br> 300인 이상 제조업체 없음";
		

	tooltip.html( tooltipHTML )
		.style("left", (e.containerPoint.x - $(".tooltip").innerWidth()/2) + "px")
		.style("top", (e.containerPoint.y) + "px");
}


// ---------- hover off events ----------
// 1. de-highlight the feature. 2. destroy the tooltip.
function resetHighlight_layer(_layer) {
	if (_layer != current_municipal_layer) {
		_layer.setStyle({
			color: municipal_style.color,
			opacity: municipal_style.opacity,
			weight: municipal_style.weight
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			_layer.bringToBack();
			if (current_municipal_layer) {
				current_municipal_layer.bringToFront();
			}
		}
	}
	tooltip.style("display", "none");
}
function resetHighlight(e) { //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	resetHighlight_layer(e.target);
}


// ---------- de-hightlight the feature when a user clicked X. More on "js/onLoad.js" ----------

function cancel_selectingHighlight_layer() {
	if (current_municipal_layer) {
		current_municipal_layer.setStyle({
			color: municipal_style.color,
			opacity: municipal_style.opacity,
			weight: municipal_style.weight
		});
		layer_province_border.resetStyle(current_province_layer);
	}
}

// ---------- zoom the map when a user clicked a polygon. ----------

function zoomToFeature_layer(_layer) {
	cancel_selectingHighlight_layer();

	current_municipal_layer = _layer;
	current_province_layer = municipal_toProvince_layer(_layer)

	{ // define maximum area to zoom in, for each different browser window width.
		if ( windowWidth >= 1025 ) {
			map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [382, 32], paddingTopLeft: [224, 32]});
		}

		else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
			map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [336, 16], paddingTopLeft: [40, 16]});
		}

		else if ( windowWidth >= 768 ) {
			map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [336, 16], paddingTopLeft: [16, 144]});
		}

		else { 
			map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [0, windowHeight/10*3], paddingTopLeft: [16, 48]});
		}
	}

	current_province_layer.setStyle({
		color: province_style.color_selected, 
		opacity: province_style.opacity_selected
	});
	_layer.setStyle({
		color: municipal_style.color_selected,
		opacity: municipal_style.opacity_selected, 
		weight: municipal_style.weight_selected
	});
	change_dataInfo(_layer.feature.properties);
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		current_province_layer.bringToFront();
		current_municipal_layer.bringToFront();
	}
}
function zoomToFeature(e) {
	zoomToFeature_layer(e.target);
	tooltip.style("display", "none");
}





