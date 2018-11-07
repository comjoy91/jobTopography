









// functions for filling search_contents.
var search_contents = [];

var year_index = 2;








// getting colour
function getColour(_score, _hueValue) {
	var colourFunction = new L.HSLLuminosityFunction(new L.Point(0, 1), new L.Point(100, 0), {outputHue: 0, outputSaturation: '100%'});
	return colourFunction.evaluate(_score);
}

// initialize whole map drawn by GeoJSON

function onEachFeature_municipal(_feature, _layer) {
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
function styleFunc(feature) {
	if ( feature.properties.score_total <= 0 ) {
		return {
			fillColor: "#c3c9cb",
			weight: 0.5,
			opacity: 0.15,
			color: 'blue',
			dashArray: '',
			fillOpacity: 0.85 // 1.0
		}
	}
	else return {
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
		opacity: 0.25,
		fillColor: 'black', 
		fillOpacity: 0
	}
}



var layer_municipal = L.geoJson(municipalGeoJSON, {
	style: styleFunc,
	onEachFeature: onEachFeature_municipal
}).addTo(map);

var layer_province_border = L.geoJson(provinceGeoJSON, {
	style: styleFunc_province_border
}).addTo(map);









// Layer selection
var geojson_array = [layer_municipal, layer_province_border];




function updateScore() {
	for (var geojson of geojson_array) {
		geojson.eachLayer(function(_layer) {

			var prop = _layer.feature.properties;
			var data = prop.data[year_index];
			prop.score_total = data.hiringRate_300.score;

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

			if (prop.score_total <= 0) 
				_layer.setStyle({
					fillColor: "#c3c9cb",
					fillOpacity: 0.85 // 1.0
				});
			else  
				_layer.setStyle({
					fillColor: getColour(prop.score_total, 16),
					fillOpacity: 0.7
				});
		});
	}
	if (current_municipal_layer)
		change_dataInfo(current_municipal_layer.feature.properties);
};













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
	var tooltipHTML;
	if ( e.target.feature.properties.score_total <= 0) 
		tooltipHTML = e.target.feature.properties.province_name + " <b>" 
					+ e.target.feature.properties.municipal_name + "</b><br> 300인 이상 제조업체 없음";
	else
		tooltipHTML = e.target.feature.properties.province_name + " <b>" 
					+ e.target.feature.properties.municipal_name + "</b><br> 현재 Total: " 
					+ d3.format(".1f")(e.target.feature.properties.score_total);// + " / 100.0";

	tooltip.html( tooltipHTML )
		.style("left", (e.containerPoint.x - $(".tooltip").innerWidth()/2) + "px")
		.style("top", (e.containerPoint.y) + "px");
		// .css("transition")
}

function resetHighlight_layer(_layer) {
	if (_layer != current_municipal_layer) {
		_layer.setStyle({
			weight: 0.5,
			opacity: 0.15,
			color: 'blue'
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			_layer.bringToBack();
			if (current_municipal_layer) {
				current_municipal_layer.bringToFront();
			}
		}
	}	
	// info.update();
	tooltip.style("display", "none");
}
function resetHighlight(e) { //reset geojson(=map drawn by geoJSON) style just like it had been initialized
	resetHighlight_layer(e.target);
}

function municipal_toProvince_layer(_layer) {
	return layer_province_border.getLayers()[_layer.feature.properties.province_index];
}
function municipal_toProvince_prop(_prop) {
	return layer_province_border.getLayers()[_prop.province_index].feature.properties;
}

function cancel_selectingHighlight_layer() {
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
		layer_province_border.resetStyle(current_province_layer);
}
function zoomToFeature_layer(_layer) {
	cancel_selectingHighlight_layer();

	current_municipal_layer = _layer;
	current_province_layer = municipal_toProvince_layer(_layer)
	// map.fitBounds(current_province_layer.getBounds(), {paddingBottomRight: [382, 32], paddingTopLeft: [224, 32]});



	{ // extra working by different browser window width.
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
		color: '#248'
	});
	_layer.setStyle({
		weight: 4,
		color: '#248',
		dashArray: '', 
		opacity: 1//,
		// fillOpacity: 0.5
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








$('.ui.search').search({
	source: search_contents,
	searchFields: ['title_string'],
	showNoResults: false,
	fullTextSearch: 'exact',
	maxResults: 8,
	onSelect: function(result, response) { zoomToFeature_layer (result.layer); }
});





// $('#menu_municipal, #menu_province').on('click', function() {
// 	$('#menu_municipal, #menu_province').removeClass("active");
// 	$(this).addClass("active");
// 	if (current_municipal_layer)
// 		change_dataInfo(current_municipal_layer.feature.properties);
// });




