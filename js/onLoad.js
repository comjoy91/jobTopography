// BACKGROUND LAYER
var mbAttr = '<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
	mbUrl = 'https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}@2x.png?key=JrAhm6tBG7Y3CCaBBIMe';
var grayscale = L.tileLayer(mbUrl, {attribution: mbAttr});

var map = L.map('map_background', {layers: [grayscale], zoomControl: false, attributionControl: false, minZoom: 6, scrollWheelZoom: true}).setView([36, 128], 7);
L.control.attribution({position: 'bottomleft'}).addTo(map);
L.control.zoom({position: 'topleft'}).addTo(map);


// functions for implementing rawData and score into initial geoJSON data.
function data_object(_dataJson_district) {
	var returnObject = {	
		"hiringRate_300": {
			"rawData": _dataJson_district.hiringRate_300,
			"score": _dataJson_district.score_hiringRate_300
		}, 
		"hiringRate_1000": {
			"rawData": _dataJson_district.hiringRate_1000,
			"score": _dataJson_district.score_hiringRate_1000
		}, 
		"mainIndustryPortion": {
			"rawData": _dataJson_district.mainIndustryPortion,
			"score": _dataJson_district.score_mainIndustryPortion
		}, 
		"rateOf20sInIndustry": {
			"rawData": _dataJson_district.rateOf20sInIndustry,
			"score": _dataJson_district.score_rateOf20sInIndustry
		}, 
		"industryJobCreation": {
			"rawData": _dataJson_district.industryJobCreation,
			"score": _dataJson_district.score_industryJobCreation
		}, 
		"incomeRate": {
			"rawData": _dataJson_district.incomeRate,
			"score": _dataJson_district.score_incomeRate
		}, 
		"R_COSTII": {
			"rawData": _dataJson_district.R_COSTII,
			"score": _dataJson_district.score_R_COSTII
		}, 
		"expertRate": {
			"rawData": _dataJson_district.expertRate,
			"score": _dataJson_district.score_expertRate
		},
		"population": _dataJson_district.population, 
		"mean_age": _dataJson_district.mean_age, 
		"numWorkers_inDistrict": _dataJson_district.numWorkers_inDistrict, 
		// "numWorkers_0": _dataJson_district.numWorkers_0, 
		// "numWorkers_300": _dataJson_district.numWorkers_300, 
		// "numWorkers_1000": _dataJson_district.numWorkers_1000, 
		// "mainIndustry_0": _dataJson_district.mainIndustry_0, 
		"mainIndustry_300": _dataJson_district.mainIndustry_300, 
		// "mainIndustry_1000": _dataJson_district.mainIndustry_1000,
		"factory": _dataJson_district.factory, 
		"additional_note": _dataJson_district.additional_note
	};

	return returnObject;
};

function dataInsertion(_featureArray, _dataArray) {
	for (var i=0; i<_featureArray.features.length; i++) {
		var prop = _featureArray.features[i].properties;
		prop.data = [];

		for (var j=0; j<_dataArray.length; j++) {
			prop.data.push(data_object(_dataArray[j][i]));
		}
		
		prop.score_total = _dataArray[_dataArray.length-1][i].score_hiringRate_300;
	}
};

var municipalData = [_dataJSON_2014.municipals, _dataJSON_2015.municipals, _dataJSON_2016.municipals];
var provinceData = [_dataJSON_2014.provinces, _dataJSON_2015.provinces, _dataJSON_2016.provinces];
dataInsertion(municipalGeoJSON, municipalData);
dataInsertion(provinceGeoJSON, provinceData);

(function($){
	$(window).on("load", function() {//먼저 js파일들을 모두 로드. 

		// Layer selection with #mapYear slidebar
		$("#mapYear_slider").slider({
			animate: true,
			min: 0,
			max: 2,
			value: 2,
			slide: function(event, ui) {
				year_index = ui.value; updateScore();
			}
		});

		$('#municipal_name, #province_name').tab(); // menu tab initialize
		$('#cancel_selecting').click( function() { // canceling selecting
			cancel_selectingHighlight_layer();
			current_municipal_layer = null;
			change_dataInfo();
		})
		$('#layerControl_legend, #dataInfo_municipal_legend').click( function() { // modal popup
			$('#popup_modal').modal('show');
		});

		var check_hiringRate_1000 = document.getElementById("check_hiringRate_1000"),  
			check_mainIndustryPortion = document.getElementById("check_mainIndustryPortion"),
			check_rateOf20sInIndustry = document.getElementById("check_rateOf20sInIndustry"),
			check_industryJobCreation = document.getElementById("check_industryJobCreation"), 
			check_incomeRate = document.getElementById("check_incomeRate"), 
			check_R_COSTII = document.getElementById("check_R_COSTII"), 
			check_expertRate = document.getElementById("check_expertRate");


		$("#checkUI_hiringRate_1000").checkbox({
			onChange: function(){
				$("#result_municipal_hiringRate_1000").toggleClass("unlayered"); 
				$("#result_province_hiringRate_1000").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_mainIndustryPortion").checkbox({
			onChange: function(){
				$("#result_municipal_mainIndustryPortion").toggleClass("unlayered"); 
				$("#result_province_mainIndustryPortion").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_rateOf20sInIndustry").checkbox({
			onChange: function(){
				$("#result_municipal_rateOf20sInIndustry").toggleClass("unlayered"); 
				$("#result_province_rateOf20sInIndustry").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_industryJobCreation").checkbox({
			onChange: function(){
				$("#result_municipal_industryJobCreation").toggleClass("unlayered"); 
				$("#result_province_industryJobCreation").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_incomeRate").checkbox({
			onChange: function(){
				$("#result_municipal_incomeRate").toggleClass("unlayered"); 
				$("#result_province_incomeRate").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_R_COSTII").checkbox({
			onChange: function(){
				$("#result_municipal_R_COSTII").toggleClass("unlayered"); 
				$("#result_province_R_COSTII").toggleClass("unlayered"); 
				updateScore();
			}
		});
		$("#checkUI_expertRate").checkbox({
			onChange: function(){
				$("#result_municipal_expertRate").toggleClass("unlayered"); 
				$("#result_province_expertRate").toggleClass("unlayered"); 
				updateScore();
			}
		});

		change_dataInfo();
		popup_update();
	});

})(jQuery);

