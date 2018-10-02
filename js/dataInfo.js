

function insert_dataInfo(_dataName, _dataValue) {
	return "<div class=\"dataInfo\">"
	+ "<div class=\"dataName\">" + _dataName + "</div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div></div>"
}




// function isProvince_menu() {
// 	return $("#menu_province").hasClass("active");
// }

function change_dataInfo(_prop) {
	(function($){
		if (_prop == null) {
			change_dataInfo_needtoSelect();
		}

		else {

			// if (isProvince_menu())
			// 	_prop = municipal_toProvince_data(_prop);
			
			var province_name = _prop.province_name;
			var municipal_name = _prop.municipal_name;
			var _data = _prop.data[year_index];

			var _prop_province = municipal_toProvince_prop(_prop);
			var _data_province = _prop_province.data[year_index];

			$("#selectNotice").html("");
			$("#province_name").html(province_name);
			$("#municipal_name").html(municipal_name);


			$(".dataInfo").detach();

			// province basic info.
			$("#basicInfo_province").append(insert_dataInfo("시도 전체 인구", d3.format(",")(_data_province.population)+"명"));
			$("#basicInfo_province").append(insert_dataInfo("시도 지역 평균연령", d3.format(".1f")(_data_province.mean_age)+"세"));
			$("#basicInfo_province").append(insert_dataInfo("시도 지역 전체 종사자", d3.format(",")(_data_province.numWorkers_inDistrict)+"명"));
			$("#basicInfo_province").append(insert_dataInfo("시도 최대 고용 제조업 종류<br>(300인 이상 대기업 중)", _data_province.mainIndustry_300));


			// province score.
			$("#result_province_total .score").html(_prop.score_total + "점");
			$("#result_province_total .scoreName").html("시도 전체 점수");


			// municipal basic info.
			$("#basicInfo_municipal").append(insert_dataInfo("시군구 전체 인구", d3.format(",")(_data.population)+"명"));
			$("#basicInfo_municipal").append(insert_dataInfo("시군구 지역 평균연령", d3.format(".1f")(_data.mean_age)+"세"));
			$("#basicInfo_municipal").append(insert_dataInfo("시군구 지역 전체 종사자", d3.format(",")(_data.numWorkers_inDistrict)+"명"));
			$("#basicInfo_municipal").append(insert_dataInfo("시군구 최대 고용 제조업 종류<br>(300인 이상 대기업 중)", _data.mainIndustry_300));

			// municipal score.
			$("#result_municipal_total .score").html(_prop.score_total + "점");
			$("#result_municipal_total .scoreName").html("시군구 전체 점수");

			$("#result_municipal_hiringRate_300 .score").html("= " + _data.hiringRate_300.score + "점");
			$("#result_municipal_hiringRate_300 .scoreName").html("300인 이상 제조업 집중도");
				$("#result_municipal_hiringRate_300 .scoreInfo").append(insert_dataInfo("300인 이상 대기업 종사자", d3.format(",")(_data.numWorkers_300)+"명"));
				$("#result_municipal_hiringRate_300 .scoreInfo").append(insert_dataInfo("300인 이상 대기업 종사자 비율", _data.hiringRate_300.rawData));

			$("#result_municipal_hiringRate_1000 .score").html("+ " + _data.hiringRate_1000.score + "점");
			$("#result_municipal_hiringRate_1000 .scoreName").html("1000인 이상 제조업 집중도");
				$("#result_municipal_hiringRate_1000 .scoreInfo").append(insert_dataInfo("1000인 이상 대기업 종사자", d3.format(",")(_data.numWorkers_1000)+"명"));
				$("#result_municipal_hiringRate_1000 .scoreInfo").append(insert_dataInfo("1000인 이상 대기업 종사자 비율", _data.hiringRate_1000.rawData));

			$("#result_municipal_mainIndustryPortion .score").html("+ " + _data.mainIndustryPortion.score + "점");
			$("#result_municipal_mainIndustryPortion .scoreName").html("제1 제조업 집중도");
				$("#result_municipal_mainIndustryPortion .scoreInfo").append(insert_dataInfo("제1 제조업 종사자 비율", _data.mainIndustryPortion.rawData));
				$("#result_municipal_mainIndustryPortion .scoreInfo").append(insert_dataInfo("최대 고용 제조업 종류<br>(300인 이상 대기업 중)", _data.mainIndustry_300));

			$("#result_municipal_rateOf20sInIndustry .score").html("+ " + _data.rateOf20sInIndustry.score + "점");
			$("#result_municipal_rateOf20sInIndustry .scoreName").html("제조업 고령화");
				$("#result_municipal_rateOf20sInIndustry .scoreInfo").append(insert_dataInfo("제조업 종사자 중 20대 비율", _data.rateOf20sInIndustry.rawData));

			$("#result_municipal_industryJobCreation .score").html("+ " + _data.industryJobCreation.score + "점");
			$("#result_municipal_industryJobCreation .scoreName").html("일자리창출률");

			$("#result_municipal_incomeRate .score").html("+ " + _data.incomeRate.score + "점");
			$("#result_municipal_incomeRate .scoreName").html("직장인-주민 일치 비율");
				$("#result_municipal_incomeRate .scoreInfo").append(insert_dataInfo("거주지 기준 근로소득 금액 ÷ <br>원천징수지 기준 근로소득 금액", _data.incomeRate.rawData));

			$("#result_municipal_R_COSTII .score").html("+ " + _data.R_COSTII.score + "점");
			$("#result_municipal_R_COSTII .scoreName").html("과학기술혁신 역량 지수");
				$("#result_municipal_R_COSTII .scoreInfo").append(insert_dataInfo("과학기술혁신역량지수 R-COSTII", _data.R_COSTII.rawData));

			$("#result_municipal_expertRate .score").html("+ " + _data.expertRate.score + "점");
			$("#result_municipal_expertRate .scoreName").html("관리자, 전문가 비중");
				$("#result_municipal_expertRate .scoreInfo").append(insert_dataInfo("전체 취업자 중 관리자, 전문가 수", _data.expertRate.rawData));

		}
		
	})(jQuery)
};

function change_dataInfo_needtoSelect() {
	(function($){
		$("#selectNotice").html("지도에서 자치구·시·군을 선택하면 지역별 수치를 확인할 수 있습니다. 또는, 상단에서 자치구·시·군 이름을 검색할 수 있습니다.");
		// $("#electionType_name").html("");
		$("#province_name").html("");
		$("#municipal_name").html("");
		$("#info_hyperlink").css("display", "none");
		$("#vote_result").html("");
		$("#vote_result_sum").css("display", "none");
	})(jQuery)
}
