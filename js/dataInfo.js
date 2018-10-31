

function append_basic_dataInfo(_dataName, _dataValue) {
	return "<div class=\"dataInfo\">"
	+ "<div class=\"name\">" + _dataName + "</div>"
	+ "<div class=\"value\">" + _dataValue + "</div></div>"
}

function append_province_dataInfo(_scoreName, _dataValue, _dataName) {
	return "<div class=\"scoreName\">" + _scoreName + "</div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div>"
	+ "<div class=\"dataName\">" + _dataName + "</div>";
}

function append_municipal_dataInfo(_scoreName, _dataValue, _score, _dataName) {
	return "<div class=\"scoreName\">" + _scoreName + "</div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div>"
	+ "<div class=\"score\">" + d3.format(".1f")(_score) + "</div><br>"
	+ "<div class=\"dataName\">" + _dataName + "</div>";
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
			
			var province_name = _prop.province_name;
			var municipal_name = _prop.municipal_name;
			var _data = _prop.data[year_index];

			var _prop_province = municipal_toProvince_prop(_prop);
			var _data_province = _prop_province.data[year_index];

			$("#selectNotice").css("display", "none");
			$("#info_nameContainer").css("display", "");
			$("#province_name").html(province_name);
			$("#municipal_name").html(municipal_name);


			$("#result_municipal, #result_province").css("display", "");


			$(".dataInfo").detach();
			$(".result_storage").empty();


			// ----------- municipal ------------

			// municipal basic info.
			$("#basicInfo_municipal").append(append_basic_dataInfo("전체 인구", d3.format(",")(_data.population)+"명"));
			$("#basicInfo_municipal").append(append_basic_dataInfo("평균 연령", d3.format(".1f")(_data.mean_age)+"세"));
			$("#basicInfo_municipal").append(append_basic_dataInfo("전체 종사자수", d3.format(",")(_data.numWorkers_inDistrict)+"명"));
			$("#basicInfo_municipal").append(append_basic_dataInfo("제1제조업 (300인 이상 대기업의 최대 고용 제조업종)", _data.mainIndustry_300)); //<br>(300인 이상 대기업 중)
			$("#basicInfo_municipal").append(append_basic_dataInfo("주요 사업체 (1000인 이상 대기업)", _data.factory));
			var factory_html = $("#basicInfo_municipal .dataInfo").eq(4);
			if ($(factory_html).children(".value").html() == "") $(factory_html).children(".value").html("-");//$(factory_html).css("display", "none");
			// else factory_html.css("display", "");

			// municipal explanation.
			$("#textbox_explain_municipal").html(_data.explanation);
			if ( $("#textbox_explain_municipal").html() == "" ) $("#textbox_explain_municipal").css("display", "none");
			else $("#textbox_explain_municipal").css("display", "");

			// municipal score.
			$("#result_municipal_hiringRate_300").append(
				append_municipal_dataInfo("300인 이상 제조업 집중도", _data.hiringRate_300.rawData, _data.hiringRate_300.score, "300인 이상 대기업 종사자 / 전체 종사자")
			);
			$("#result_municipal_hiringRate_1000").append(
				append_municipal_dataInfo("1000인 이상 제조업 집중도", _data.hiringRate_1000.rawData, _data.hiringRate_1000.score, "1000인 이상 대기업 종사자 / 전체 종사자")
			);
			$("#result_municipal_mainIndustryPortion").append(
				append_municipal_dataInfo("제1제조업 집중도", _data.mainIndustryPortion.rawData, _data.mainIndustryPortion.score, "제1제조업(300인 이상 기업) 종사자 / 전체 종사자")
			);
			$("#result_municipal_rateOf20sInIndustry").append(
				append_municipal_dataInfo("제조업 고령화", _data.rateOf20sInIndustry.rawData, _data.rateOf20sInIndustry.score, "제조업 종사자 중 20대 비율")
			);
			$("#result_municipal_industryJobCreation").append(
				append_municipal_dataInfo("일자리 창출 위험도", "(비공개)", _data.industryJobCreation.score, "일자리 창출량 / 일자리 총 규모")
			);
			$("#result_municipal_incomeRate").append(
				append_municipal_dataInfo("직장인-주민 괴리도(2016)", _data.incomeRate.rawData, _data.incomeRate.score, "거주지 기준 근로소득 금액 / 근무지 기준 근로소득 금액")
			);
			$("#result_municipal_R_COSTII").append(
				append_municipal_dataInfo("과학기술혁신 역량 위험도", _data.R_COSTII.rawData, _data.R_COSTII.score, "과학기술혁신역량지수 R-COSTII")
			);
			$("#result_municipal_expertRate").append(
				append_municipal_dataInfo("관리자, 전문가 비중 위험도", _data.expertRate.rawData, _data.expertRate.score, "관리자, 전문가 수 / 전체 취업자 수")
			);

			if (_data.hiringRate_300.score > 0) {
				$("#result_municipal_total .score").html(d3.format(".1f")(_prop.score_total) + " / 100.0");
				$("#description_municipal_total").css("display", "none");
			}
			else {
				$(".result_storage .score").append("*");
				$("#result_municipal_total .score").html("0.0* / 100.0");
				$("#description_municipal_total").css("display", "");
			}

			// ----------- province ------------

			// province basic info.
			$("#basicInfo_province").append(append_basic_dataInfo("전체 인구", d3.format(",")(_data_province.population)+"명"));
			$("#basicInfo_province").append(append_basic_dataInfo("평균 연령", d3.format(".1f")(_data_province.mean_age)+"세"));
			$("#basicInfo_province").append(append_basic_dataInfo("전체 종사자수", d3.format(",")(_data_province.numWorkers_inDistrict)+"명"));
			$("#basicInfo_province").append(append_basic_dataInfo("제1제조업 (300인 이상 대기업의 최대 고용 제조업종)", _data_province.mainIndustry_300));

			// province explanation.
			$("#textbox_explain_province").html(_data_province.explanation);
			if ( $("#textbox_explain_province").html() == "" ) $("#textbox_explain_province").css("display", "none");
			else $("#textbox_explain_province").css("display", "");

			// province score.
			$("#result_province_hiringRate_300").append(
				append_province_dataInfo("300인 이상 제조업 집중도", _data_province.hiringRate_300.rawData, "300인 이상 대기업 종사자 / 전체 종사자")
			);
			$("#result_province_hiringRate_1000").append(
				append_province_dataInfo("1000인 이상 제조업 집중도", _data_province.hiringRate_1000.rawData, "1000인 이상 대기업 종사자 / 전체 종사자")
			);
			$("#result_province_mainIndustryPortion").append(
				append_province_dataInfo("제1제조업 집중도", _data_province.mainIndustryPortion.rawData, "제1제조업(300인 이상 기업) 종사자 / 전체 종사자")
			);
			$("#result_province_rateOf20sInIndustry").append(
				append_province_dataInfo("제조업 고령화", _data_province.rateOf20sInIndustry.rawData, "제조업 종사자 중 20대 비율")
			);
			$("#result_province_industryJobCreation").append(
				append_province_dataInfo("일자리 창출 위험도", "(비공개)", "일자리 창출량 / 일자리 총 규모")
			);
			$("#result_province_incomeRate").append(
				append_province_dataInfo("직장인-주민 괴리도(2016)", _data_province.incomeRate.rawData, "거주지 기준 근로소득 금액 / 근무지 기준 근로소득 금액")
			);
			$("#result_province_R_COSTII").append(
				append_province_dataInfo("과학기술혁신 역량 위험도", _data_province.R_COSTII.rawData, "과학기술혁신역량지수 R-COSTII")
			);
			$("#result_province_expertRate").append(
				append_province_dataInfo("관리자, 전문가 비중 위험도", _data_province.expertRate.rawData, "관리자, 전문가 수 / 전체 취업자 수")
			);
		}
		
	})(jQuery)
};

function change_dataInfo_needtoSelect() {
	(function($){
		$("#selectNotice").css("display", "");
		// $("#electionType_name").html("");
		$("#info_nameContainer").css("display", "none");
		$("#info_hyperlink").css("display", "none");
		$("#result_municipal, #result_province").css("display", "none");
	})(jQuery)
}
