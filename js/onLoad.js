// BACKGROUND LAYER

var windowWidth, windowHeight, wideRatio = 0;
windowWidth = $(window).width();
windowHeight = $(window).height();
wideRatio = windowWidth / windowHeight;

var mbAttr = '<a href="https://www.maptiler.com/license/maps/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
	mbUrl = 'https://maps.tilehosting.com/styles/positron/{z}/{x}/{y}@2x.png?key=JrAhm6tBG7Y3CCaBBIMe';
var grayscale = L.tileLayer(mbUrl, {attribution: mbAttr});

var map = L.map( 'map_background', {
					layers: [grayscale], 
					zoomControl: false, 
					attributionControl: false,
					minZoom: 5, 
					maxZoom: 12,
					scrollWheelZoom: true} );
var attribution = L.control.attribution({position: 'bottomleft'}).addTo(map);
L.control.zoom({position: 'topleft'}).addTo(map);
if ( !L.Browser.touch ) {
	$("#map_background").addClass("leaflet-touch"); // add class .leaflet-touch for every browser to expand size of zoom control button.
}

{ // initial map view setting by different browser window width.
	if ( windowWidth >= 1025 ) {
		map.setView([36, 128], 7);
	}
	else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
		map.setView([36, 131], 6);
	}
	else if ( windowWidth >= 768 ) {
		map.setView([36.3, 129.3], 7);
	}
	else { 
		map.setView([34.5, 127.7], 6);
	}
}


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
		
		if ( /*_dataArray[_dataArray.length-1][i].score_hiringRate_300*/ prop.data[j-1].hiringRate_300.score > 0 ) prop.validForResearch = true;
		else prop.validForResearch = false;
		prop.score_total = prop.data[j-1].hiringRate_300.score;
	}
};

var municipalData = [_dataJSON_2014.municipals, _dataJSON_2015.municipals, _dataJSON_2016.municipals];
var provinceData = [_dataJSON_2014.provinces, _dataJSON_2015.provinces, _dataJSON_2016.provinces];
dataInsertion(municipalGeoJSON, municipalData);
dataInsertion(provinceGeoJSON, provinceData);

var updateScore = function() { updateScore_check(); }; // recent "updateScore" function variable, depends on which layer is selected.

(function($){

	function resizeWindow() { // extra working by different browser window width.
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		wideRatio = windowWidth / windowHeight;
		if ( windowWidth >= 1025 ) {
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#map_layerControl").attr( {class: "", style: ""} );
			attribution.setPosition("bottomleft");
		}

		else if ( windowWidth >= 768 && wideRatio > 2/1) { // "iPhone X"
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#map_layerControl").addClass( "ui popup bottom right" );
			attribution.setPosition("bottomleft");
		}

		else if ( windowWidth >= 768 ) {
			$("#mapYear_slider").slider( "option", "orientation", "vertical" );
			$("#map_layerControl").attr( {class: "", style: ""} );
			attribution.setPosition("bottomleft");
		}

		else { 
			$("#mapYear_slider").slider( "option", "orientation", "horizontal" );
			$("#map_layerControl").addClass( "ui popup bottom right" );
			attribution.setPosition("topright");
		}
	}

	$(window).on("load", function() {//먼저 js파일들을 모두 로드. 

		$("#mapYear_slider").slider({ // Layer selection with #mapYear slidebar
			animate: true,
			orientation: "horizontal",
			min: 0,
			max: 2,
			value: 2,
			slide: function(event, ui) {
				year_index = ui.value; 
				updateScore();
			}
		});

		$('#municipal_name, #province_name').tab(); // municipal & province name menu tab initialize
		$('#cancel_selecting').click( function() { // canceling selecting
			cancel_selectingHighlight_layer();
			current_municipal_layer = null;
			change_dataInfo();
		})

		$('#layerControl_legend, #dataInfo_municipal_legend').click( function() { // modal popup
			$('#popup_modal').modal('show');
		});

		$('#layerControl_popup').popup( { // popup button for #map_layerControl in mobile devices.
			popup 		: '#map_layerControl',
		    on 			: 'click',
			inline		: true,
			position	: 'right center',
			delay		: { show: 300, hide: 800 }, 
			distanceAway		: 8
		});	

		$("#info_scrollingTop").click( function() { // scroll #dataInfo down in mobile devices.
			event.preventDefault();
			$('html, body').stop().animate({
				scrollTop: 0
			}, 600,'easeOutCubic');
		});


		var check_hiringRate_300 = document.getElementById("check_hiringRate_300"),
			check_hiringRate_1000 = document.getElementById("check_hiringRate_1000"),  
			check_mainIndustryPortion = document.getElementById("check_mainIndustryPortion"),
			check_rateOf20sInIndustry = document.getElementById("check_rateOf20sInIndustry"),
			check_industryJobCreation = document.getElementById("check_industryJobCreation"), 
			check_incomeRate = document.getElementById("check_incomeRate"), 
			check_R_COSTII = document.getElementById("check_R_COSTII"), 
			check_expertRate = document.getElementById("check_expertRate");

		// $("#checkUI_hiringRate_300").checkbox({
		// 	onChange: function(){
		// 		$("#result_municipal_hiringRate_300").toggleClass("unlayered"); 
		// 		$("#result_province_hiringRate_300").toggleClass("unlayered"); 
		// 		updateScore_check();
		// 	}
		// });
		$("#checkUI_hiringRate_1000").checkbox({
			onChange: function(){
				$("#result_municipal_hiringRate_1000").toggleClass("unlayered"); 
				$("#result_province_hiringRate_1000").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_mainIndustryPortion").checkbox({
			onChange: function(){
				$("#result_municipal_mainIndustryPortion").toggleClass("unlayered"); 
				$("#result_province_mainIndustryPortion").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_rateOf20sInIndustry").checkbox({
			onChange: function(){
				$("#result_municipal_rateOf20sInIndustry").toggleClass("unlayered"); 
				$("#result_province_rateOf20sInIndustry").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_industryJobCreation").checkbox({
			onChange: function(){
				$("#result_municipal_industryJobCreation").toggleClass("unlayered"); 
				$("#result_province_industryJobCreation").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_incomeRate").checkbox({
			onChange: function(){
				$("#result_municipal_incomeRate").toggleClass("unlayered"); 
				$("#result_province_incomeRate").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_R_COSTII").checkbox({
			onChange: function(){
				$("#result_municipal_R_COSTII").toggleClass("unlayered"); 
				$("#result_province_R_COSTII").toggleClass("unlayered"); 
				updateScore_check();
			}
		});
		$("#checkUI_expertRate").checkbox({
			onChange: function(){
				$("#result_municipal_expertRate").toggleClass("unlayered"); 
				$("#result_province_expertRate").toggleClass("unlayered"); 
				updateScore_check();
			}
		});


		var radio_hiringRate_300 = document.getElementById("radio_hiringRate_300"),
			radio_hiringRate_1000 = document.getElementById("radio_hiringRate_1000"),  
			radio_mainIndustryPortion = document.getElementById("radio_mainIndustryPortion"),
			radio_rateOf20sInIndustry = document.getElementById("radio_rateOf20sInIndustry"),
			radio_industryJobCreation = document.getElementById("radio_industryJobCreation"), 
			radio_incomeRate = document.getElementById("radio_incomeRate"), 
			radio_R_COSTII = document.getElementById("radio_R_COSTII"), 
			radio_expertRate = document.getElementById("radio_expertRate");

		$("#radioUI_hiringRate_300").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_hiringRate_300").removeClass("unlayered");
				$("#result_province_hiringRate_300").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_hiringRate_1000").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_hiringRate_1000").removeClass("unlayered");
				$("#result_province_hiringRate_1000").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_mainIndustryPortion").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_mainIndustryPortion").removeClass("unlayered");
				$("#result_province_mainIndustryPortion").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_rateOf20sInIndustry").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_rateOf20sInIndustry").removeClass("unlayered");
				$("#result_province_rateOf20sInIndustry").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_industryJobCreation").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_industryJobCreation").removeClass("unlayered");
				$("#result_province_industryJobCreation").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_incomeRate").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_incomeRate").removeClass("unlayered");
				$("#result_province_incomeRate").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_R_COSTII").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_R_COSTII").removeClass("unlayered");
				$("#result_province_R_COSTII").removeClass("unlayered");
				updateScore_radio();
			}
		});
		$("#radioUI_expertRate").checkbox({
			onChecked: function(){
				$(".score_storage").addClass("unlayered");
				$("#result_municipal_expertRate").removeClass("unlayered");
				$("#result_province_expertRate").removeClass("unlayered");
				updateScore_radio();
			}
		});

		// layerControl(single-layer OR multi-layer) menu tab initialize
		$("#menu_multiLayer, #menu_singleLayer").tab();
		$("#menu_multiLayer").click( function() {
			updateScore_check();
			updateScore = function() { updateScore_check(); }; // Layer selection with #mapYear slidebar

			$("#score_legend_multiLayer").css( "display", "" );
			$("#score_legend_singleLayer").css( "display", "none" );

			$(".score_storage").addClass("unlayered");
			if (check_hiringRate_300.checked) {
				$("#result_municipal_hiringRate_300").removeClass("unlayered");
				$("#result_province_hiringRate_300").removeClass("unlayered");
			}	
			if (check_hiringRate_1000.checked) {
				$("#result_municipal_hiringRate_1000").removeClass("unlayered");
				$("#result_province_hiringRate_1000").removeClass("unlayered");
			}	
			if (check_mainIndustryPortion.checked) {
				$("#result_municipal_mainIndustryPortion").removeClass("unlayered");
				$("#result_province_mainIndustryPortion").removeClass("unlayered");
			}
			if (check_rateOf20sInIndustry.checked) {
				$("#result_municipal_rateOf20sInIndustry").removeClass("unlayered");
				$("#result_province_rateOf20sInIndustry").removeClass("unlayered");
			}
			if (check_industryJobCreation.checked) {
				$("#result_municipal_industryJobCreation").removeClass("unlayered");
				$("#result_province_industryJobCreation").removeClass("unlayered");
			}
			if (check_incomeRate.checked) {
				$("#result_municipal_incomeRate").removeClass("unlayered");
				$("#result_province_incomeRate").removeClass("unlayered");
			}
			if (check_R_COSTII.checked) {
				$("#result_municipal_R_COSTII").removeClass("unlayered");
				$("#result_province_R_COSTII").removeClass("unlayered");
			}
			if (check_expertRate.checked) {
				$("#result_municipal_expertRate").removeClass("unlayered");
				$("#result_province_expertRate").removeClass("unlayered");
			}
		}); 
		$("#menu_singleLayer").click( function() {
			updateScore_radio();
			updateScore = function() { updateScore_radio(); }; // Layer selection with #mapYear slidebar

			$("#score_legend_multiLayer").css( "display", "none" );
			$("#score_legend_singleLayer").css( "display", "" );

			$(".score_storage").addClass("unlayered");
			if (radio_hiringRate_300.checked) {
				$("#result_municipal_hiringRate_300").removeClass("unlayered");
				$("#result_province_hiringRate_300").removeClass("unlayered");
			}	
			else if (radio_hiringRate_1000.checked) {
				$("#result_municipal_hiringRate_1000").removeClass("unlayered");
				$("#result_province_hiringRate_1000").removeClass("unlayered");
			}	
			else if (radio_mainIndustryPortion.checked) {
				$("#result_municipal_mainIndustryPortion").removeClass("unlayered");
				$("#result_province_mainIndustryPortion").removeClass("unlayered");
			}
			else if (radio_rateOf20sInIndustry.checked) {
				$("#result_municipal_rateOf20sInIndustry").removeClass("unlayered");
				$("#result_province_rateOf20sInIndustry").removeClass("unlayered");
			}
			else if (radio_industryJobCreation.checked) {
				$("#result_municipal_industryJobCreation").removeClass("unlayered");
				$("#result_province_industryJobCreation").removeClass("unlayered");
			}
			else if (radio_incomeRate.checked) {
				$("#result_municipal_incomeRate").removeClass("unlayered");
				$("#result_province_incomeRate").removeClass("unlayered");
			}
			else if (radio_R_COSTII.checked) {
				$("#result_municipal_R_COSTII").removeClass("unlayered");
				$("#result_province_R_COSTII").removeClass("unlayered");
			}
			else if (radio_expertRate.checked) {
				$("#result_municipal_expertRate").removeClass("unlayered");
				$("#result_province_expertRate").removeClass("unlayered");
			}
		});




		updateScore_check();
		resizeWindow();
		if ( (windowWidth >= 768 && windowWidth < 1025 && wideRatio > 2/1) || (windowWidth < 768) )  { // show popup initially.
			$("#layerControl_popup").popup('show');
		}
		change_dataInfo();
		popup_update();
	});

	$(window).on("resize", resizeWindow); // 창 크기가 바뀔 때에는

})(jQuery);

