


var d3_mapping_config_json_file = "/SKorean-election-map/assets/d3_mapping_config.json";
var counting_vote_json_file;
var townCode_json_file;
var party_json_file;
var hex_svg_file = "/SKorean-election-map/assets/hexagon_svg/hexagon_final.svg";
var plot_double_svg_file = "/SKorean-election-map/assets/img/plot_double.svg";
var plot_single_svg_file = "/SKorean-election-map/assets/img/plot_single.svg";

var d3_mapping_variable;
var svgContainer;
var zoomedMap;

var d3_config_json
var d3_config;
var ELECTION_TYPE;
var counting_vote_json;
var townCode_json;
var party_json;

var hex_svg_imported;
const HEX_MIN = 1;
const HEX_MAX = 141;
var sorting_plots = function(_total_plot, _hex_imported) {
		var plot_selection = d3.select(_hex_imported).select(".PLOTHEX_LAYER").selectAll("polygon.plot");

		var plot_array = plot_selection.nodes()
		var radius_radian = [];
		for (var i=0; i<_total_plot; i++) {
			var buffer_polygonPoints = [];
			var plotPoints_string = d3.select(plot_array[i]).attr("points").split(" ");
			for (var j=0; j<plotPoints_string.length; j++) {
				plotPoints_string[j] = plotPoints_string[j].split(",");
				buffer_polygonPoints.push([parseFloat(plotPoints_string[j][0]), parseFloat(plotPoints_string[j][1])]);
			}
			var centroid_plot = d3.polygonCentroid(buffer_polygonPoints);
			var angle = Math.atan2(centroid_plot[1], centroid_plot[0]) + startingAngle_hexColouring; //(centroid_plot[1], centroid_plot[0]) = (y, x).
			if (angle < 0) {
				angle = TWO_PI + angle;
			}
			radius_radian.push({'angle': angle});
		}
		plot_selection.data(radius_radian).sort(function(a, b) { return a['angle'] - b['angle']; });
	};


	
var plot_double_svg_imported;
var plot_single_svg_imported;

var party_class = {};

const UNIFORM_AREA = 1;
const PROPORTIONAL_AREA = 0;
var prop_or_sameArea = PROPORTIONAL_AREA;
const CONSTI_CANDIDATE = 0;
const PR_PARTY = 1;
var consti_or_PR = CONSTI_CANDIDATE;

var electionId = "0000000000";
var oldElectionType = 1; 
var electionType = 1;
var electionName = "20170509";
var electionCode = 1;
var cityCode = 1100;
var proportionalRepresentationCode = -1;
var sggCityCode = -1;
var townCode = -1;
var sggTownCode = -1;

var selected_hexCodeIndex = {index_province: -1, index_consti: -1};






(function($){
	$(window).on("load", function(){//먼저 JSON 파일 로드를 한 뒤, langSearch 변수를 이용한 작업을 진행.

		prop_or_sameArea = PROPORTIONAL_AREA;

		// $("#electionType select")[0].selectedIndex = 1;
		// $("#nth select")[0].selectedIndex = 0;
		// $("#infoType select")[0].selectedIndex = 1;

		// $('#initial_instruction_PC').dimmer('show');
		// $('#initial_instruction_PC').click(function() {
		//   $('#initial_instruction_PC').dimmer('hide');
		// });



		$("#proportionalArea").click( function() {
			if (!$("#proportionalArea").hasClass("selected")) { newMap_proportionalArea(); }
		});
		$("#uniformArea").click( function() {
			if (!$("#uniformArea").hasClass("selected")) { newMap_uniformArea(); }
		});

		// $("#infoType .UI").change(change_infoType);

		// $("#consti").click( function() {
		// 	if (!$("#consti").hasClass("selected")) { change_consti(); }
		// });
		// $("#PR").click( function() {
		// 	if (!$("#PR").hasClass("selected")) { change_PR(); }
		// });

		$("#legend_elected, #legend_elected_dataInfo").click( function() {
			$('#electroral_system').modal('show');
		});


		//Create SVG element
		d3.select("#map_body_svg").append("g").classed("nation", true);
		svgContainer = d3.select("#map_body_svg").selectAll("g.nation")
		zoomedMap = d3.zoom()
						.scaleExtent([0.5, 15])
						// .translateExtent([[-width*1.5, -height*1.5], [width*5, height*5]])
						.on("zoom", function() {
							document.body.style.cursor="move";
							svgContainer.attr("transform", d3.event.transform); })
						.on("end", function() { document.body.style.cursor="default"; } );

		// $("#fullView").on("click", function() { // TODO: 전국지도 버튼.

		// 	originX = (window.innerWidth-width)/2;
		// 	originY = (window.innerHeight-height+200)/2;	
		// 	d3.select("#map_background").transition().duration(1000).call(zoomedMap.transform, d3.zoomIdentity.scale(1).translate(originX, originY));
		// 	d3.select("#map_body_svg .selected").classed("selected", false).classed("unselected", true);
		// 	d3.select("#map_body_svg .nation").classed("selected", true).classed("unselected", false);
		// 	selected_hexCodeIndex.index_province = -1;
		// 	selected_hexCodeIndex.index_consti = -1;

		// 	// d3.select("#upperRegion").classed("inactive", true).on("click", null);
		// 	d3.select("#dataInfo").classed("plot_large plot_medium", false).classed("plot_small", true);
			info_votes_needtoSelect();
			// info_votes(svgContainer.node().__data__);
		// });
		$("#largeView").on("click", function() { // TODO: 전국지도 버튼.
			d3.select("#map_background").transition().duration(500).call(zoomedMap.scaleBy, 1.5);
		});
		$("#smallView").on("click", function() { // TODO: 전국지도 버튼.
			d3.select("#map_background").transition().duration(500).call(zoomedMap.scaleBy, 0.66);
		});

		$("#info_scrollingTop").on("click", function(event) { // TODO: scroll to top.
			event.preventDefault();
			$('html, body').stop().animate({
				scrollTop: 0
			}, 600,'easeOutCubic');
		});


		// var q_init = d3.queue();
		// q_init.defer( d3.json, d3_mapping_config_json_file )
		// .defer( d3.xml, hex_svg_file )
		// .defer( d3.xml, plot_double_svg_file )
		// .defer( d3.xml, plot_single_svg_file )
		// .await(function(error, _d3_config_json, _hex_xml, _plot_double_xml, _plot_single_xml) {
		// 	if (error) throw error;

		// 	hex_svg_imported = d3.select(_hex_xml.documentElement).selectAll("g.hex_group").nodes();
		// 	for(var i=HEX_MIN; i<HEX_MAX+1; i++) {
		// 		sorting_plots( i, hex_svg_imported[i] );
		// 	}
		// 	// plot_double_svg_imported = d3.select(_plot_double_xml.documentElement).node().outerHTML;
		// 	// plot_single_svg_imported = d3.select(_plot_single_xml.documentElement).node().outerHTML;
		// 	plot_double_svg_imported = "<img src=\"/SKorean-election-map/assets/img/plot_double/plot_double_";
		// 	plot_single_svg_imported = "<img src=\"/SKorean-election-map/assets/img/plot_single/plot_single_";

		// 	d3_config_json = _d3_config_json;
		// 	d3_config = d3_config_json[$("#electionType .UI").val()][$("#nth .UI").val()];
		// 	width = d3_config["width"];
		// 	height = d3_config["height"];
		// 	originX = (window.innerWidth-width)/2;
		// 	originY = (window.innerHeight-height+200)/2;			
		// 	d3.select("#map_background").call(zoomedMap);
		// 	d3.select("#map_background").call(zoomedMap.transform, d3.zoomIdentity.scale(1).translate(originX, originY));

		// 	$("#consti").addClass("selected");
		// 	change_election();
		// });
	});
})(jQuery)
