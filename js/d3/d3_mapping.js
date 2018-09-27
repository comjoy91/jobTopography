
const PI = Math.PI;
const TWO_PI = Math.PI*2;
const SQRT_3 = Math.sqrt(3);
const SQRT_5 = Math.sqrt(5);

var width;
var height;
var originX;
var originY;
var startingAngle_hexColouring = PI/3; // 각 6각형의 내부를 칠하기 시작하는 기준각도.

var POPUL_PERPLOT; // 점복자 1개당 인구
var PLOT_UNITHEX; // 단위 6각형의 점복자 개수.

var halfEdge; // 단위 6각형의 한 변 크기 절반의 길이.
var init_centerDistance; //초기 6각형 중심 사이의 거리.
var hex_PofSimilitude; //단위 6각형과 hexagon_n.svg에서 겉테두리 6각형의 닮음비: 이 비율만큼 확대되어야 함.

// const FONT_SIZE = 5.0;
// const FONT_LEADING = 7.0;
var FONT_LEADING_HEX;

const SELECTED_NATION = 0;
const SELECTED_PROVINCE = 1;
const SELECTED_MUNICIPAL = 2;
const SELECTED_CONSTI = 3;
var selected_cell;




function D3_Mapping (_counting_vote_json, _townCode_json, _party_json) {

	var d3_config = d3_config_json[ELECTION_TYPE][$("#nth .UI").val()];

	width = d3_config["width"];
	height = d3_config["height"];
	// originX = (window.innerWidth-width-400)/2;
	// originY = (window.innerHeight-height+200)/2;

	POPUL_PERPLOT = d3_config["POPUL_PERPLOT"];
	PLOT_UNITHEX = d3_config["PLOT_UNITHEX"];
	halfEdge = d3_config["halfEdge"];
	init_centerDistance = d3_config["init_centerDistance"];
	FONT_LEADING_HEX = d3_config["FONT_LEADING_HEX"];

	selected_hexCodeIndex.index_province = -1;
	selected_hexCodeIndex.index_consti = -1;

	var counting_vote_json = _counting_vote_json;
	var townCode_json = _townCode_json;
	var party_json = _party_json;
	this.partyClass_dict = this.make_partyClass_dict(_party_json["results"]); // key: 정담명, val: partyClass
	var hex_imported = hex_svg_imported;

	for (var i=0; i<counting_vote_json["results"].length; i++) {
		var province = counting_vote_json["results"][i];

		for (var j=0; j<province["district_result"].length; j++) {
			var consti = province["district_result"][j];

			for(var k=0; k<consti["result"].length; k++) {
				var candi = consti["result"][k];
				candi["partyClass"] = this.partyClass_dict[candi["party_name_kr"]];
			}
		}
	}
	this.counting_vote_json = counting_vote_json;

	
	this.hex_imported = hex_imported;

	var unitHex = d3.select(hex_imported[PLOT_UNITHEX]).select("g.PLAINHEX_LAYER polygon");
	var buffer_polygonPoints = [];
	var plotPoints_string = unitHex.attr("points").split(" ");
	for (var j=0; j<plotPoints_string.length; j++) {
		plotPoints_string[j] = plotPoints_string[j].split(",");
		buffer_polygonPoints.push([parseFloat(plotPoints_string[j][0]), parseFloat(plotPoints_string[j][1])]);
	}
	var unitHex_edge_dx = buffer_polygonPoints[0][0]-buffer_polygonPoints[1][0];
	var unitHex_edge_dy = buffer_polygonPoints[0][1]-buffer_polygonPoints[1][1];
	var unitHex_edge = Math.sqrt( (unitHex_edge_dx*unitHex_edge_dx) + (unitHex_edge_dy*unitHex_edge_dy) );
	hex_PofSimilitude = 2*halfEdge / unitHex_edge;

	this.map = new Election_Map(counting_vote_json, townCode_json, halfEdge, init_centerDistance, 0, 0); //originX, originY);
}

D3_Mapping.prototype.make_partyClass_dict = function(_party_json) {
	var return_dict = new Object();
	for (var i=0; i<_party_json.length; i++) {
		var party = _party_json[i];
		return_dict[party["NAME"]] = party["partyClass"];
	}
	return return_dict;
}

D3_Mapping.prototype.get_hex_imported = function(_plot_num) { return this.hex_imported[_plot_num]; }




D3_Mapping.prototype.print_map = function() { // Election_Map _map -> svg html로 변환해서 #map_body_svg에 append.


	// var upperRegion_click_function = function(_currentNode) {
	// 	var upperRegion_node = _currentNode.parentNode;
	// 	d3.select("#upperRegion")
	// 		.classed("inactive", false)
	// 		.on("click", function() {
	// 				d3.select(_currentNode).classed("selected", false).classed("unselected", true);
	// 				d3.select(upperRegion_node).classed("selected", true).classed("unselected", false);
	// 				if (d3.select(upperRegion_node).classed("nation")) {
	// 					d3.select("#upperRegion").classed("inactive", true).on("click", null);
	// 					d3.select("#dataInfo").classed("plot_large plot_medium", false).classed("plot_small", true);
	// 					selected_cell = SELECTED_NATION;
	// 					selected_hexCodeIndex.index_province = -1;
	// 					selected_hexCodeIndex.index_consti = -1;
	// 					// info_votes_needtoSelect();
	// 					info_votes(upperRegion_node.__data__);
	// 				}
	// 				else if (d3.select(upperRegion_node).classed("province")) {
	// 					// onClickCallback_province_g(upperRegion_node);
	// 					upperRegion_click_function(upperRegion_node);
	// 					d3.select("#dataInfo").classed("plot_large plot_small", false).classed("plot_medium", true);
	// 					selected_cell = SELECTED_PROVINCE;
	// 					selected_hexCodeIndex.index_consti = -1;
	// 					info_votes(upperRegion_node.__data__);
	// 				}
	// 				else { // (d3.select(upperRegion_node).classed("municipal"))
	// 					onClickCallback_province_g(upperRegion_node);
	// 					// upperRegion_click_function(upperRegion_node);
	// 					// d3.select("#dataInfo").classed("plot_medium plot_small", false).classed("plot_large", true);
	// 					// selected_cell = SELECTED_MUNICIPAL;
	// 					// info_votes(upperRegion_node.__data__);
	// 				}
	// 		});
	// };



	var _map = this.map;
	var provinceNum = _map.get_provinceNum();
	var counting_vote_json = this.counting_vote_json;
	var search_contents = [];

	//initialize SVG element
	var removed_provinces = svgContainer.classed("nation selected", true).classed("unselected", false).selectAll("g").remove();

	var receving_data = null;
	svgContainer.datum(this.counting_vote_json["national_result"]);
	receving_data = svgContainer.node().__data__;
	if (receving_data != undefined) {
		receving_data["elected_original_index"] = [];
		receving_data.result.forEach(function(candi, _i) {
			candi["original_index"] = _i;
			candi["elected"] = false;
		});
		receving_data.result.sort(function (a, b) {
			return b.votenum - a.votenum;
		});
		for (var _i=0; _i<receving_data.num_elected; _i++) {
			receving_data.result[_i].elected = true;
			receving_data.elected_original_index.push(receving_data.result[_i].original_index);
		}
	}
	

	for (var i=0; i<provinceNum; i++) {
		var counting_vote_json_province = this.counting_vote_json["results"][i];
		var province_g = svgContainer.append("g")
						.classed("province unselected", true)
						.datum(counting_vote_json_province["province_result"]);
		receving_data = province_g.node().__data__;

		if (receving_data != undefined) {
			receving_data["elected_original_index"] = [];
			receving_data.result.forEach(function(candi, _i) {
				candi["original_index"] = _i;
				candi["elected"] = false;
			});

			if (svgContainer.node().__data__ != undefined) {
				receving_data.elected_original_index = svgContainer.node().__data__.elected_original_index;
				var original_index;
				for (var _i=0; _i<receving_data.elected_original_index.length; _i++) {
					original_index = receving_data.elected_original_index[_i];
					receving_data.result[original_index].elected = true;
				}
				receving_data.result.sort(function (a, b) {
					return b.votenum - a.votenum;
				});
			}			
			else {
				receving_data.result.sort(function (a, b) {
					return b.votenum - a.votenum;
				});
				for (var _i=0; _i<receving_data.num_elected; _i++) {
					receving_data.result[_i].elected = true;
					receving_data.elected_original_index.push(receving_data.result[_i].original_index);
				}
			}
		}

		search_contents.push({
			title: counting_vote_json_province["province_name"]+" ",
			province_name: counting_vote_json_province["province_name"],
			municipal_name: "",
			index_province: i,
			index_consti: -1
		});


		var constiNum_inProvince = _map.get_constiNum_inProvince(i);
		for (var j=0; j<constiNum_inProvince; j++) {
			var hexCode = new HexCode(i, j);
			var consti = _map.get_consti(hexCode)
			var plot_num = consti.get_total_plot();
			var counting_vote_json_consti = counting_vote_json_province["district_result"][j];
			search_contents.push({
				title: counting_vote_json_consti["province_name"] + " <b>" + counting_vote_json_consti["district_name"] + "</b>",
				title_string: counting_vote_json_consti["province_name"] + " " + counting_vote_json_consti["district_name"],
				province_name: counting_vote_json_consti["province_name"],
				municipal_name: counting_vote_json_consti["district_name"],
				index_province: i,
				index_consti: j
			});

			var consti_g = province_g.append("g").html(this.get_hex_imported(plot_num).innerHTML)
						.classed("constituency unselected", true)
						.attr("transform", "translate("+_map.get_coordi_byHexCode(hexCode).getX()+", "+_map.get_coordi_byHexCode(hexCode).getY()+")")
						.datum(counting_vote_json_consti);
			receving_data = consti_g.node().__data__;

			if (receving_data != undefined) {
				receving_data["elected_original_index"] = [];
				receving_data.result.forEach(function(candi, _i) {
					candi["original_index"] = _i;
					candi["elected"] = false;
				});

				if (province_g.node().__data__ != undefined) {
					var original_index;
					receving_data.elected_original_index = province_g.node().__data__.elected_original_index;
					for (var _i=0; _i<receving_data.elected_original_index.length; _i++) {
						original_index = receving_data.elected_original_index[_i];
						receving_data.result[original_index].elected = true;
					}
					receving_data.result.sort(function (a, b) {
						return b.votenum - a.votenum;
					});
				}			
				else {
					receving_data.result.sort(function (a, b) {
						return b.votenum - a.votenum;
					});
					for (var _i=0; _i<receving_data.num_elected; _i++) {
						receving_data.result[_i].elected = true;
						receving_data.elected_original_index.push(receving_data.result[_i].original_index);
					}
				}
			}

			var plothex_layer = consti_g.select("g.PLOTHEX_LAYER")
										.classed("infoHex_layer", true)
										.attr("transform", "scale("+hex_PofSimilitude+")");
			var plainhex_layer = consti_g.select("g.PLAINHEX_LAYER")
										.classed("infoHex_layer", true)
										.attr("transform", "scale("+hex_PofSimilitude+")");
			var edgehex_layer = consti_g./*insert("g", ".PLOTHEX_LAYER")*/append("g").classed("edgeHEX_LAYER", true).html(plainhex_layer.html())
										// .attr("transform", "scale("+hex_PofSimilitude*(consti.get_sideLength_ratio()+0.5)/consti.get_sideLength_ratio()+")");
										.attr("transform", "scale("+hex_PofSimilitude+")");

			var midpoint = function (pointstr_A, pointstr_B) {
				var pointA = pointstr_A.split(",");
				var pointB = pointstr_B.split(",");
				var x = (parseFloat(pointA[0])+parseFloat(pointB[0]))/2;
				var y = (parseFloat(pointA[1])+parseFloat(pointB[1]))/2;
				return x+","+y;
			}
			var mult_point = function (pointstr, mult) {
				var point = pointstr.split(",");
				var x = parseFloat(point[0])*mult;
				var y = parseFloat(point[1])*mult;
				return x+","+y;
			}
			switch (consti.get_num_elected()) {
				case 1: break;
				case 2: 
					var plain_hex = plainhex_layer.select("polygon.plain_hex").remove();
					var hexPoints_string = plain_hex.attr("points").split(" ");
					var hexPoints = hexPoints_string;
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[3]+" "+hexPoints[4]+" "+hexPoints[5]+" "+hexPoints[0]);
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[0]+" "+hexPoints[1]+" "+hexPoints[2]+" "+hexPoints[3]);
					break;

				case 3: 
					var plain_hex = plainhex_layer.select("polygon.plain_hex").remove();
					var hexPoints_string = plain_hex.attr("points").split(" ");
					var hexPoints = hexPoints_string;
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[3]+" "+hexPoints[4]+" "+hexPoints[5]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[5]+" "+hexPoints[0]+" "+hexPoints[1]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[1]+" "+hexPoints[2]+" "+hexPoints[3]+" 0,0");
					break;

				case 4: 
					var plain_hex = plainhex_layer.select("polygon.plain_hex").remove();
					var hexPoints_string = plain_hex.attr("points").split(" ");
					var hexPoints = hexPoints_string;
					var midpoint_4and5 = midpoint(hexPoints[4], hexPoints[5]);
					var midpoint_1and2 = midpoint(hexPoints[1], hexPoints[2]);
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[3]+" "+hexPoints[4]+" "+midpoint_4and5+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", midpoint_4and5+" "+hexPoints[5]+" "+hexPoints[0]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[0]+" "+hexPoints[1]+" "+midpoint_1and2+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", midpoint_1and2+" "+hexPoints[2]+" "+hexPoints[3]+" 0,0");
					break;

				case 5: 
					var plain_hex = plainhex_layer.select("polygon.plain_hex").remove();
					var hexPoints_string = plain_hex.attr("points").split(" ");
					var hexPoints = hexPoints_string;
					var midpoint_4and5 = midpoint(hexPoints[4], hexPoints[5]);
					var midpoint_1and2 = midpoint(hexPoints[1], hexPoints[2]);
					// for (var i=0; i<6; i++) {
					// 	// plotPoints_string[i] = plotPoints_string[i].split(",");
					// 	hexPoints[5-i] = hexPoints_string[i]; // [parseFloat(plotPoints_string[i][0]), parseFloat(plotPoints_string[i][1])];
					// }
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[3]+" "+hexPoints[4]+" "+midpoint_4and5+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", midpoint_4and5+" "+hexPoints[5]+" "+hexPoints[0]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[0]+" "+hexPoints[1]+" "+midpoint_1and2+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", midpoint_1and2+" "+hexPoints[2]+" "+hexPoints[3]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", mult_point(hexPoints[0], 1/SQRT_5)+" "+mult_point(hexPoints[1], 1/SQRT_5)+" "+mult_point(hexPoints[2], 1/SQRT_5)+" "+mult_point(hexPoints[3], 1/SQRT_5)+" "+mult_point(hexPoints[4], 1/SQRT_5)+" "+mult_point(hexPoints[5], 1/SQRT_5));
					break;

				 case 6: 
					var plain_hex = plainhex_layer.select("polygon.plain_hex").remove();
					var hexPoints_string = plain_hex.attr("points").split(" ");
					var hexPoints = hexPoints_string;
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[3]+" "+hexPoints[4]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[4]+" "+hexPoints[5]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[5]+" "+hexPoints[0]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[0]+" "+hexPoints[1]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[1]+" "+hexPoints[2]+" 0,0");
					plainhex_layer.append("polygon").classed("plain_hex", true).attr("points", hexPoints[2]+" "+hexPoints[3]+" 0,0");
					break;
				default: break;
			}

			this.colour_hex_votes(consti, plothex_layer);
			this.colour_hex_elects(consti, plainhex_layer);
			if (consti.did_withoutVote())/* (plothex_layer.select("polygon").node() == null) */ { plothex_layer.html(plainhex_layer.html()); }
			this.print_constiName(consti, consti_g);
			selected_cell = SELECTED_NATION;

			// console.log(i+", "+j+", "+" plot개수: "+plot_num+" 총 후보수: " + consti.get_num_candidate() + " 지역구 이름: " + consti.get_constiName_acronym());
		}

		province_g.on("click", function(data, index, group) {
			onClickCallback_province_g(this);
		});
	}


	// var onClickCallback_province_g = function (_node) {
	// 	var selection_province = d3.select(_node);
	// 	if (selection_province.classed("unselected")) {
	// 		d3.selectAll("#map_body_svg .selected").classed("selected", false).classed("unselected", true);

	// 		selection_province.classed("selected", true).classed("unselected", false)
	// 			.selectAll(".constituency").each(function() {
	// 				var selection_consti = d3.select(this);
	// 				selection_consti.on("click", function() {
	// 					onClickCallback_consti_g(this);
	// 				});
	// 			});
	// 		d3.select("#dataInfo").classed("plot_large plot_small", false).classed("plot_medium", true);
	// 		selected_cell = SELECTED_PROVINCE;
	// 		selected_hexCodeIndex.index_province = $(_node.parentNode.children).index(_node);
	// 		selected_hexCodeIndex.index_consti = -1;
	// 		info_votes(_node.__data__);
	// 		upperRegion_click_function(_node);
	// 	}
	// 	// .on("mouseover", )
	// 	// .on("mouseout", );
	// };

	// var onClickCallback_consti_g = function (_node) {
	// 	d3.selectAll("#map_body_svg .constituency.selected").classed("selected", false).classed("unselected", true);
	// 	d3.select(_node).classed("selected", true).classed("unselected", false);
	// 	d3.select("#dataInfo").classed("plot_medium plot_small", false).classed("plot_large", true);
	// 	selected_cell = SELECTED_CONSTI;
	// 	selected_hexCodeIndex.index_consti = $(_node.parentNode.children).index(_node);
	// 	info_votes(_node.__data__);
	// 	upperRegion_click_function(_node);
	// 	// .on("mouseover", )
	// 	// .on("mouseout", );
	// };

	var select_onTarget = function (_target) { // _target == {index_province: a, index_consti: b}
		if (_target.index_province >= 0) {
			var select_province = svgContainer.selectAll(".province").select(function(d, i) {
				if (i == _target.index_province) {
					return this;
				}
				else return null;
			});

			if (_target.index_consti < 0) {
				onClickCallback_province_g(select_province.node());
			}
			else {
				var select_consti = select_province.selectAll(".constituency").select(function(d, j) {
					if (j == _target.index_consti) {
						return this;
					}
					else return null;
				});
				onClickCallback_province_g(select_province.node());
				onClickCallback_consti_g(select_consti.node());
			}
		}

		else {
			d3.select("#upperRegion").classed("inactive", true).on("click", null);
			d3.select("#dataInfo").classed("plot_large plot_medium", false).classed("plot_small", true);
			selected_cell = SELECTED_NATION;
			info_votes(svgContainer.node().__data__);
		}
	};

	select_onTarget(selected_hexCodeIndex);
	console.log("SVG print finish.");

	$('.ui.search').search({
		source: search_contents,
		searchFields: ['title', 'title_string', 'province_name', 'municipal_name'],
		showNoResults: false,
		// searchFullText: true,
		fullTextSearch: 'exact',
		maxResults: 0,
		onSelect: function(result, response) { select_onTarget(result); }
	});



}





D3_Mapping.prototype.colour_hex_votes = function(_consti, _hex) {
	var total_plot = _consti.get_total_plot();
	var num_candi = _consti.get_num_candidate();
	var plot_nodes = _hex.selectAll("polygon.plot").nodes();

	var plot_coloured = 0;

	for(var i=0; i<num_candi; i++) {
		var plot_candi = _consti.get_candi_plot(i);
		var class_candi = _consti.get_candi_partyClass(i);
		for (var j=0; j<plot_candi; j++){
			d3.select(plot_nodes[plot_coloured]).classed(class_candi, true);
			plot_coloured++;
		}
	}
	while(plot_coloured < total_plot) {
		d3.select(plot_nodes[plot_coloured]).classed("undervotes_plot", true);
		plot_coloured++;
	}
}


D3_Mapping.prototype.colour_hex_elects = function(_consti, _hex) {

	var candi_list = [];
	var num_candi = _consti.get_num_candidate();
	for(var i=0; i<num_candi; i++) {
		candi_list.push(i);
	}
	candi_list.sort(function (a, b) {
		return _consti.get_candi_votes(b) - _consti.get_candi_votes(a);
	});

	var num_elected = _consti.get_num_elected();
	var plain_hex_list = _hex.selectAll("polygon.plain_hex").nodes()
	for(var i=0; i<num_elected; i++) {
		var candi_index = candi_list[i];
		var class_candi = _consti.get_candi_partyClass(candi_index);
		d3.select(plain_hex_list[i]).classed(class_candi, true);
	}
};



D3_Mapping.prototype.print_constiName = function (_consti, _consti_g) {

	var constiName_g = _consti_g.append("text")
						.attr("text-rendering", "optimizeLegibility")
						.html(_consti.get_constiName_acronym());

	var halfEdge_consti = _consti.get_sideLength_ratio() * halfEdge;
	var purehex_vertexX = [-halfEdge_consti*2 - FONT_LEADING_HEX*SQRT_3,
							-halfEdge_consti*2 - FONT_LEADING_HEX*SQRT_3/2,
							halfEdge_consti*2 + FONT_LEADING_HEX*SQRT_3/2,
							halfEdge_consti*2 + FONT_LEADING_HEX*SQRT_3];
	var purehex_vertexY = [FONT_LEADING_HEX, -FONT_LEADING_HEX/2, -FONT_LEADING_HEX/2, FONT_LEADING_HEX];

	switch (_consti.get_constiName_textAlign()) {
		case 0:
			constiName_g.classed("leftBottom", true) // align은 CSS text-anchor로 지정.
			.attr("transform", "translate("+purehex_vertexX[0]+", "+purehex_vertexY[0]+") rotate(60)");
		break;

		case 1:
			constiName_g.classed("leftTop", true)
			.attr("transform", "translate("+purehex_vertexX[1]+", "+purehex_vertexY[1]+") rotate(-60)");
		break;

		case 2:
			constiName_g.classed("rightTop", true)
			.attr("transform", "translate("+purehex_vertexX[2]+", "+purehex_vertexY[2]+") rotate(60)");
		break;

		case 3:
			constiName_g.classed("rightBottom", true)
			.attr("transform", "translate("+purehex_vertexX[3]+", "+purehex_vertexY[3]+") rotate(-60)");
		break;

		default:
			constiName_g.classed("rightBottom", true)
			.attr("transform", "translate("+purehex_vertexX[2]+", "+purehex_vertexY[2]+") rotate(60)");
		break;
	}
}
