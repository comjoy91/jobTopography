
// function newMap_proportionalArea() {
// 	(function($){
// 		$("#proportionalArea").addClass("selected");
// 		$("#uniformArea").removeClass("selected");
// 		prop_or_sameArea = PROPORTIONAL_AREA;
// 		ELECTION_TYPE = counting_vote_json[consti_or_PR]['election_type'];

// 		d3_mapping_variable = new D3_Mapping(counting_vote_json[consti_or_PR], townCode_json, party_json);
// 		d3_mapping_variable.print_map();
// 		change_infoType();
// 		$("#legend_point, #legend_point_dataInfo").html("卜 1개 = 약 " + d3.format(",")(POPUL_PERPLOT) + "명");
// 	})(jQuery)
// };

// function newMap_uniformArea() {
// 	(function($){
// 		$("#uniformArea").addClass("selected");
// 		$("#proportionalArea").removeClass("selected");
// 		prop_or_sameArea = UNIFORM_AREA;
// 		ELECTION_TYPE = counting_vote_json[consti_or_PR]['election_type'];

// 		d3_mapping_variable = new D3_Mapping(counting_vote_json[consti_or_PR], townCode_json, party_json);
// 		d3_mapping_variable.print_map();
// 		change_infoType();
// 		$("#legend_point, #legend_point_dataInfo").html("卜: 각 6각형(시군구)마다 " + PLOT_UNITHEX + "개 배치");
// 	})(jQuery)
// };


// function change_partyClass() {
// 	var party_list = party_json['results']
// 	var num_party = party_list.length;
// 	party_class = {};
// 	for (var i=0; i<num_party; i++) {
// 		party_class[party_list[i].NAME] = party_list[i].partyClass;
// 	}
// };
function change_election() {
	var type_folder = $("#electionType .UI").val();
	var nth = $("#nth .UI").val();
	electionName = $("#nth .UI option:selected").attr('electinId');

	counting_vote_json_file = "/SKorean-election-map/assets/data/" + type_folder + "/counting_vote/" + type_folder + "-counting_vote-" + nth + ".json";
	townCode_json_file = "/SKorean-election-map/assets/data/" + type_folder + "/townCode/" + type_folder + "-townCode-" + nth + ".json";
	party_json_file = "/SKorean-election-map/assets/data/" + type_folder + "/partyCode/" + type_folder + "-partyCode-" + nth + ".json";

	var q = d3.queue();
	q.defer( d3.json, counting_vote_json_file )
	.defer( d3.json, townCode_json_file )
	.defer( d3.json, party_json_file )
	.await(function(error, _counting_vote_json, _townCode_json, _party_json) {
		if (error) throw error;

		counting_vote_json = _counting_vote_json;
		townCode_json = _townCode_json;
		party_json = _party_json;

		change_partyClass();
		if (prop_or_sameArea == PROPORTIONAL_AREA) { newMap_proportionalArea(); }
		else /* (prop_or_sameArea == UNIFORM_AREA) */ { newMap_uniformArea(); }

	});
};
function change_electionType() {
	var nth_options;
	var infoType_purehex;
	// switch ($("#electionType .UI").val()) {
	// 	case "assembly": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 2;
	// 		electionCode = 2;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"20\">2016. 04.</option>\
	// 						<option value=\"19\" disabled>2012. 04.</option>\
	// 						<option value=\"18\" disabled>2008. 04.</option>\
	// 						<option value=\"17\" disabled>2004. 04.</option>\
	// 						<option value=\"16\" disabled>2000. 04.</option>\
	// 						<option value=\"15\" disabled>1996. 04.</option>\
	// 						<option value=\"14\" disabled>1992. 03.</option>\
	// 						<option value=\"13\" disabled>1988. 04.</option>\
	// 						<option value=\"12\">1985. 02.</option>\
	// 						<option value=\"11\" disabled>1981. 03.</option>\
	// 						<option value=\"10\" disabled>1978. 12.</option>\
	// 						<option value=\"9\" disabled>1973. 02.</option>\
	// 						<option value=\"8\" disabled>1971. 05.</option>\
	// 						<option value=\"7\" disabled>1967. 06.</option>\
	// 						<option value=\"6\" disabled>1963. 11.</option>\
	// 						<option value=\"5\" disabled>1960. 07.</option>\
	// 						<option value=\"4\" disabled>1958. 05.</option>\
	// 						<option value=\"3\" disabled>1954. 05.</option>\
	// 						<option value=\"2\" disabled>1950. 05.</option>\
	// 						<option value=\"1\" disabled>1948. 05.</option>";
	// 		infoType_purehex = "당선결과";
	// 		$("#consti_or_PR").attr("style", "");
	// 		break;

	// 	case "president": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 1;
	// 		electionCode = 1;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"19\">2017. 05.</option>\
	// 						<option value=\"18\" disabled>2012. 12.</option>\
	// 						<option value=\"17\" disabled>2007. 12.</option>\
	// 						<option value=\"16\" disabled>2002. 12.</option>\
	// 						<option value=\"15\" disabled>1997. 12.</option>\
	// 						<option value=\"14\" disabled>1992. 12.</option>\
	// 						<option value=\"13\" disabled>1987. 12.</option>\
	// 						<option value=\"12\" disabled>1981. 02.</option>\
	// 						<option value=\"11\" disabled>1980. 08.</option>\
	// 						<option value=\"10\" disabled>1979. 12.</option>\
	// 						<option value=\"9\" disabled>1978. 07.</option>\
	// 						<option value=\"8\" disabled>1972. 12.</option>\
	// 						<option value=\"7\" disabled>1971. 04.</option>\
	// 						<option value=\"6\" disabled>1967. 05.</option>\
	// 						<option value=\"5\" disabled>1963. 10.</option>\
	// 						<option value=\"4.5\" disabled>1960. 08.</option>\
	// 						<option value=\"4\" disabled>1960. 03. (무효)</option>\
	// 						<option value=\"3\" disabled>1956. 05.</option>\
	// 						<option value=\"2\" disabled>1952. 08.</option>\
	// 						<option value=\"1\" disabled>1948. 07.</option>";
	// 		infoType_purehex = "구역별 1위";
	// 		$("#consti_or_PR").attr("style", "display: none");
	// 		break;

	// 	case "local-pp": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 5;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\">2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>\
	// 						<option value=\"4\" disabled>2006. 05.</option>\
	// 						<option value=\"3\" disabled>2002. 06.</option>\
	// 						<option value=\"2\" disabled>1998. 06.</option>\
	// 						<option value=\"1\" disabled>1995. 06.</option>";
	// 		infoType_purehex = "당선결과";
	// 		$("#consti_or_PR").attr("style", "");
	// 		break;

	// 	case "local-pa": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 3;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\">2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>\
	// 						<option value=\"4\" disabled>2006. 05.</option>\
	// 						<option value=\"3\" disabled>2002. 06.</option>\
	// 						<option value=\"2\" disabled>1998. 06.</option>\
	// 						<option value=\"1\" disabled>1995. 06.</option>";
	// 		infoType_purehex = "구역별 1위";
	// 		$("#consti_or_PR").attr("style", "display: none");
	// 		break;

	// 	case "local-ep": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 10;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = 1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\" disabled>2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>\
	// 						<option value=\"4\" disabled>2006. 05.</option>";
	// 		infoType_purehex = "당선결과";
	// 		$("#consti_or_PR").attr("style", "display: none");
	// 		break;

	// 	case "local-ea": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 11;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\">2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>";
	// 		infoType_purehex = "구역별 1위";
	// 		$("#consti_or_PR").attr("style", "display: none");
	// 		break;

	// 	case "local-mp": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 6;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\" disabled>2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>\
	// 						<option value=\"4\" disabled>2006. 05.</option>\
	// 						<option value=\"3\" disabled>2002. 06.</option>\
	// 						<option value=\"2\" disabled>1998. 06.</option>\
	// 						<option value=\"1\" disabled>1995. 06.</option>";
	// 		infoType_purehex = "당선결과";
	// 		$("#consti_or_PR").attr("style", "");
	// 		break;

	// 	case "local-ma": 
	// 		electionId = "0000000000";
	// 		oldElectionType = 1;
	// 		electionType = 4;
	// 		electionCode = 4;
	// 		cityCode = -1;
	// 		proportionalRepresentationCode = -1;
	// 		sggCityCode = -1;
	// 		townCode = -1;
	// 		sggTownCode = -1;

	// 		nth_options = "<option value=\"6\">2014. 06.</option>\
	// 						<option value=\"5\" disabled>2010. 06.</option>\
	// 						<option value=\"4\" disabled>2006. 05.</option>\
	// 						<option value=\"3\" disabled>2002. 06.</option>\
	// 						<option value=\"2\" disabled>1998. 06.</option>\
	// 						<option value=\"1\" disabled>1995. 06.</option>";
	// 		infoType_purehex = "당선결과";
	// 		$("#consti_or_PR").attr("style", "display: none");
	// 		break;

	// 	default: 
	// 		break;
	// }

	$("#nth .UI").html(nth_options);
	$("#infoType .UI option:nth(2)").html(infoType_purehex);

	$("#consti").addClass("selected");
	$("#PR").removeClass("selected");
	consti_or_PR = CONSTI_CANDIDATE;
	change_election();
};



// function change_counting_vote() {
// 	svgContainer.selectAll("g.PLOTHEX_LAYER").attr("style", "");
// 	svgContainer.selectAll("g.PLAINHEX_LAYER").attr("style", "display: none");
// };
// function change_elected() {
// 	svgContainer.selectAll("g.PLOTHEX_LAYER").attr("style", "display: none");
// 	svgContainer.selectAll("g.PLAINHEX_LAYER").attr("style", "");
// };
// function change_infoType() {
// 	if ($("#infoType .UI").val() == "counting_vote") { change_counting_vote(); }
// 	else /* $("#infoType .UI").val() == "elected" */ { change_elected(); }
// };


// function change_consti() {
// 	(function($){
// 		$("#consti").addClass("selected");
// 		$("#PR").removeClass("selected");

// 		switch ($("#electionType .UI").val()) {
// 			case "assembly": 
// 				electionCode = 2;
// 				proportionalRepresentationCode = -1;
// 				break;
// 			case "local-pp": 
// 				electionCode = 5;
// 				proportionalRepresentationCode = -1;
// 				break;
// 			case "local-mp": 
// 				electionCode = 6;
// 				proportionalRepresentationCode = -1;
// 				break;
// 			default: 
// 				break;
// 		}

// 		consti_or_PR = CONSTI_CANDIDATE;
// 		if (prop_or_sameArea == PROPORTIONAL_AREA) { newMap_proportionalArea(); }
// 		else { newMap_uniformArea(); }
// 	})(jQuery)
// };

// function change_PR() {
// 	(function($){
// 		$("#PR").addClass("selected");
// 		$("#consti").removeClass("selected");

// 		switch ($("#electionType .UI").val()) {
// 			case "assembly": 
// 				electionCode = 7;
// 				proportionalRepresentationCode = 0;
// 				break;
// 			case "local-pp": 
// 				electionCode = 8;
// 				proportionalRepresentationCode = -1;
// 				break;
// 			case "local-mp": 
// 				electionCode = 9;
// 				proportionalRepresentationCode = -1;
// 				break;
// 			default: 
// 				break;
// 		}

// 		consti_or_PR = PR_PARTY;
// 		if (prop_or_sameArea == PROPORTIONAL_AREA) { newMap_proportionalArea(); }
// 		else { newMap_uniformArea(); }
// 	})(jQuery)
// };