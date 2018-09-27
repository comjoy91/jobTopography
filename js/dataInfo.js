
// function plots_html(_num, _div_candidate_plot, _candi_party_class) {
// 	var num_double = Math.floor(_num/2);
// 	var num_single = _num - (num_double*2);
// 	var return_html_string = "";
// 	for (var i=0; i<num_double; i++) {
// 		_div_candidate_plot.append("div").classed("plot_double", true)
// 							.html(plot_double_svg_imported+_candi_party_class+".svg\">");
// 	}
// 	if (num_single == 1) {
// 		_div_candidate_plot.append("div").classed("plot_single", true)
// 							.html(plot_single_svg_imported+_candi_party_class+".svg\">");
// 	}
// }

// function info_votes_candidate(_candi_data, _num_plot, _div_candidate) {
// 	var candi_name = _candi_data.name_kr;
// 	var candi_party_name = _candi_data.party_name_kr;
// 	var candi_party_class = party_class[candi_party_name];
// 	var candi_elected = _candi_data.elected;
// 	var num_votes = _candi_data.votenum;
// 	var voterate = _candi_data.voterate;

// 	_div_candidate.classed(candi_party_class, true);
// 	if (candi_elected) {
// 		_div_candidate.classed("elected", true);
// 	}

// 	var div_candidate_text = _div_candidate.append("div").classed("candidate_text", true);
// 	var div_candidate_plot = _div_candidate.append("div").classed("candidate_plot", true);

// 	if (consti_or_PR == CONSTI_CANDIDATE) {
// 		div_candidate_text.append("div").classed("elected_check", true);
// 		div_candidate_text.append("div").classed("candidate_name", true)
// 			.html(candi_name);
// 		div_candidate_text.append("div").classed("candidate_party", true)
// 			.html(candi_party_name);
// 	}
// 	else {
// 		div_candidate_text.append("div").classed("candidate_name", true)
// 			.html(candi_party_name);
// 	}
// 	div_candidate_text.append("div").classed("num_votes", true)
// 		.html(d3.format(",")(num_votes)+"표");
// 	div_candidate_text.append("div").classed("rate_votes", true)
// 		.html(d3.format("." + d3.precisionFixed(0.01) + "f")(voterate)+"%");

// 	if (prop_or_sameArea == PROPORTIONAL_AREA || selected_cell == SELECTED_CONSTI) {
// 		plots_html(_num_plot, div_candidate_plot, candi_party_class);
// 	}

// }

// function info_votes_candidate_withoutElection(_candi_data, _div_candidate) {
// 	var candi_name = _candi_data.name_kr;
// 	var candi_party_name = _candi_data.party_name_kr;
// 	var candi_elected = _candi_data.elected;

// 	var div_candidate_text = _div_candidate.append("div").classed("candidate_text", true);

// 	if (consti_or_PR == CONSTI_CANDIDATE) {
// 		if (candi_elected) {
// 			_div_candidate.classed("elected", true);
// 		}
// 		div_candidate_text.append("div").classed("elected_check", true);
// 		div_candidate_text.append("div").classed("candidate_name", true)
// 			.html(candi_name);
// 		div_candidate_text.append("div").classed("candidate_party", true)
// 			.html(candi_party_name);
// 	}
// 	else {
// 		div_candidate_text.append("div").classed("candidate_name", true)
// 			.html(candi_party_name);
// 	}
// 	div_candidate_text.append("div").classed("rate_votes", true)
// 		.html("무투표 당선");
// }


function insert_dataInfo(_dataName, _dataValue) {
	return "<div class=\"dataInfo\">"
	+ "<div class=\"dataName\">" + _dataName + "</div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div></div>"
}




// function isProvince_menu() {
// 	return $("#menu_province").hasClass("active");
// }

function info_votes(data) {
	(function($){
		if (data == null) {
			info_votes_needtoSelect();
		}

		else {

			// if (isProvince_menu())
			// 	data = municipal_toProvince_data(data);
			
			var province_name = data.province_name;
			var municipal_name = data.municipal_name;

			$("#selectNotice").html("");
			$("#province_name").html(province_name);
			$("#municipal_name").html(municipal_name);


			$(".dataInfo").detach();

			// document.getElementById("result_municipal_hiringRate_300")

			// $("#result_municipal").html('<h4>현재 지도상의 점수: ' + data.score_total + '</h4>'
			// 				+ '<b>' + data.hiringRate_300.scoreName + '</b><br/>' + '데이터: ' + data.hiringRate_300.rawData + ' / 점수: ' + data.hiringRate_300.score + '<br/><br/>'
			// 				+ '<b>' + data.hiringRate_1000.scoreName + '</b><br/>' + '데이터: ' + data.hiringRate_1000.rawData + ' / 점수: ' + data.hiringRate_1000.score + '<br/><br/>'
			// 				+ '<b>' + data.mainIndustryPortion.scoreName + '</b><br/>' + '데이터: ' + data.mainIndustryPortion.rawData + ' / 점수: ' + data.mainIndustryPortion.score + '<br/><br/>'
			// 				+ '<b>' + data.rateOf20sInIndustry.scoreName + '</b><br/>' + '데이터: ' + data.rateOf20sInIndustry.rawData + ' / 점수: ' + data.rateOf20sInIndustry.score + '<br/><br/>'
			// 				+ '<b>' + data.industryJobCreation.scoreName + '</b><br/>' + '데이터: ' + data.industryJobCreation.rawData + ' / 점수: ' + data.industryJobCreation.score + '<br/><br/>'
			// 				+ '<b>' + data.incomeRate.scoreName + '</b><br/>' + '데이터: ' + data.incomeRate.rawData + ' / 점수: ' + data.incomeRate.score + '<br/><br/>'
			// 				+ '<b>' + data.R_COSTII.scoreName + '</b><br/>' + '데이터: ' + data.R_COSTII.rawData + ' / 점수: ' + data.R_COSTII.score + '<br/><br/>'
			// 				+ '<b>' + data.expertRate.scoreName + '</b><br/>' + '데이터: ' + data.expertRate.rawData + ' / 점수: ' + data.expertRate.score);

			$("#result_municipal_total .score").html(data.score_total + "점");
			$("#result_municipal_total .scoreName").html("전체 점수");

			$("#result_municipal_hiringRate_300 .score").html("= " + data.hiringRate_300.score + "점");
			$("#result_municipal_hiringRate_300 .scoreName").html(data.hiringRate_300.scoreName);
				$("#result_municipal_hiringRate_300 .scoreInfo").append(insert_dataInfo("지역 전체 종사자", d3.format(",")(data.otherRawData.numWorkers_inDistrict)+"명"));
				$("#result_municipal_hiringRate_300 .scoreInfo").append(insert_dataInfo("300인 이상 대기업 종사자", d3.format(",")(data.otherRawData.numWorkers_300)+"명"));
				$("#result_municipal_hiringRate_300 .scoreInfo").append(insert_dataInfo("300인 이상 대기업 종사자 비율", data.hiringRate_300.rawData));

			$("#result_municipal_hiringRate_1000 .score").html("+ " + data.hiringRate_1000.score + "점");
			$("#result_municipal_hiringRate_1000 .scoreName").html(data.hiringRate_1000.scoreName);
				$("#result_municipal_hiringRate_1000 .scoreInfo").append(insert_dataInfo("지역 전체 종사자", d3.format(",")(data.otherRawData.numWorkers_inDistrict)+"명"));
				$("#result_municipal_hiringRate_1000 .scoreInfo").append(insert_dataInfo("1000인 이상 대기업 종사자", d3.format(",")(data.otherRawData.numWorkers_1000)+"명"));
				$("#result_municipal_hiringRate_1000 .scoreInfo").append(insert_dataInfo("1000인 이상 대기업 종사자 비율", data.hiringRate_1000.rawData));

			$("#result_municipal_mainIndustryPortion .score").html("+ " + data.mainIndustryPortion.score + "점");
			$("#result_municipal_mainIndustryPortion .scoreName").html(data.mainIndustryPortion.scoreName);
				$("#result_municipal_mainIndustryPortion .scoreInfo").append(insert_dataInfo("제1 제조업 종사자 비율", data.mainIndustryPortion.rawData));
				$("#result_municipal_mainIndustryPortion .scoreInfo").append(insert_dataInfo("최대 고용 제조업 종류", data.otherRawData.mainIndustry_0));
				$("#result_municipal_mainIndustryPortion .scoreInfo").append(insert_dataInfo("최대 고용 제조업 종류<br>(300인 이상 대기업 중)", data.otherRawData.mainIndustry_300));

			$("#result_municipal_rateOf20sInIndustry .score").html("+ " + data.rateOf20sInIndustry.score + "점");
			$("#result_municipal_rateOf20sInIndustry .scoreName").html(data.rateOf20sInIndustry.scoreName);
				$("#result_municipal_rateOf20sInIndustry .scoreInfo").append(insert_dataInfo("제조업 종사자 중 20대 비율", data.rateOf20sInIndustry.rawData));
				// $("#result_municipal_rateOf20sInIndustry .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));
				// $("#result_municipal_rateOf20sInIndustry .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));

			$("#result_municipal_industryJobCreation .score").html("+ " + data.industryJobCreation.score + "점");
			$("#result_municipal_industryJobCreation .scoreName").html(data.industryJobCreation.scoreName);
				$("#result_municipal_industryJobCreation .scoreInfo").append(insert_dataInfo("지역 일자리 창출량 ÷ <br>지역 일자리 규모", data.industryJobCreation.rawData));
				// $("#result_municipal_industryJobCreation .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));
				// $("#result_municipal_industryJobCreation .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));

			$("#result_municipal_incomeRate .score").html("+ " + data.incomeRate.score + "점");
			$("#result_municipal_incomeRate .scoreName").html(data.incomeRate.scoreName);
				$("#result_municipal_incomeRate .scoreInfo").append(insert_dataInfo("거주지 기준 근로소득 금액 ÷ <br>원천징수지 기준 근로소득 금액", data.incomeRate.rawData));
				// $("#result_municipal_incomeRate .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));
				// $("#result_municipal_incomeRate .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));

			$("#result_municipal_R_COSTII .score").html("+ " + data.R_COSTII.score + "점");
			$("#result_municipal_R_COSTII .scoreName").html(data.R_COSTII.scoreName);
				$("#result_municipal_R_COSTII .scoreInfo").append(insert_dataInfo("과학기술혁신역량지수 R-COSTII", data.R_COSTII.rawData));
				// $("#result_municipal_R_COSTII .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));
				// $("#result_municipal_R_COSTII .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));

			$("#result_municipal_expertRate .score").html("+ " + data.expertRate.score + "점");
			$("#result_municipal_expertRate .scoreName").html(data.expertRate.scoreName);
				$("#result_municipal_expertRate .scoreInfo").append(insert_dataInfo("전체 취업자 중 관리자, 전문가 수", data.expertRate.rawData));
				// $("#result_municipal_expertRate .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));
				// $("#result_municipal_expertRate .scoreInfo").append(insert_dataInfo(_dataName, data.otherRawData));

		}
		
	})(jQuery)
};

function info_votes_needtoSelect() {
	(function($){
		$("#selectNotice").html("지도에서 자치구·시·군을 선택하면 지역별 수치를 확인할 수 있습니다. 또는, 상단에서 지역 이름(광역시·도, 자치구·시·군)을 검색할 수 있습니다.");
		// $("#electionType_name").html("");
		$("#province_name").html("");
		$("#municipal_name").html("");
		$("#info_hyperlink").css("display", "none");
		$("#vote_result").html("");
		$("#vote_result_sum").css("display", "none");
	})(jQuery)
}
