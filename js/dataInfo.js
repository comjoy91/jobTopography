

function append_basicInfo(_dataName, _dataValue) {
	return "<div class=\"basicInfo\">"
	+ "<div class=\"name\">" + _dataName + "</div>"
	+ "<div class=\"value\">" + _dataValue + "</div></div>"
}

function append_province_result(_scoreName, _dataValue, _dataName) {
	return "<div class=\"scoreName\">" + _scoreName + "</div>"
	+ "<div class=\"score\"></div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div>"
	+ "<div class=\"dataName\">" + _dataName + "</div>";
}

function append_municipal_result(_scoreName, _dataValue, _score, _dataName) {
	return "<div class=\"scoreName\">" + _scoreName + "</div>"
	+ "<div class=\"score\">" + d3.format(".1f")(_score) + "</div>"
	+ "<div class=\"dataValue\">" + _dataValue + "</div>"
	+ "<div class=\"dataName\">" + _dataName + "</div>";
}




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

			$("#initialNotice").css("display", "none");
			$("#nameContainer").css("display", "");
			$("#province_name").html(province_name);
			$("#municipal_name").html(municipal_name);


			$("#result_municipal, #result_province").css("display", "");


			$(".basicInfo").detach();
			$(".score_storage").empty();


			// ----------- municipal ------------

			// municipal basic info.
			$("#basicInfo_municipal").append(append_basicInfo("전체 인구", d3.format(",")(_data.population)+"명"));
			$("#basicInfo_municipal").append(append_basicInfo("평균 연령", d3.format(".1f")(_data.mean_age)+"세"));
			$("#basicInfo_municipal").append(append_basicInfo("전체 종사자수", d3.format(",")(_data.numWorkers_inDistrict)+"명"));
			$("#basicInfo_municipal").append(append_basicInfo("제1제조업 (300인 이상 제조업 중 최대 고용 업종)", _data.mainIndustry_300));
			$("#basicInfo_municipal").append(append_basicInfo("주요 사업체", _data.factory));
			var factory_html = $("#basicInfo_municipal .basicInfo").eq(4);
			if ($(factory_html).children(".value").html() == "") $(factory_html).children(".value").html("-");//$(factory_html).css("display", "none");
			// else factory_html.css("display", "");

			// municipal explanation.
			$("#textbox_explain_municipal").html(_data.explanation);
			if ( $("#textbox_explain_municipal").html() == "" ) $("#textbox_explain_municipal").css("display", "none");
			else $("#textbox_explain_municipal").css("display", "");

			// municipal score.
			$("#result_municipal_hiringRate_300").append(
				append_municipal_result("300인 이상 제조업 집중도", _data.hiringRate_300.rawData, _data.hiringRate_300.score, "제조업 종사자 중 300인 이상 제조업체 종사 비율")
			);
			$("#result_municipal_hiringRate_1000").append(
				append_municipal_result("1000인 이상 제조업 집중도", _data.hiringRate_1000.rawData, _data.hiringRate_1000.score, "제조업 종사자 중 1000인 이상 제조업체 종사 비율")
			);
			$("#result_municipal_mainIndustryPortion").append(
				append_municipal_result("제1제조업 집중도", _data.mainIndustryPortion.rawData, _data.mainIndustryPortion.score, "300인 이상 제조업체 종사자 중 제1제조업 종사 비율")
			);
			$("#result_municipal_rateOf20sInIndustry").append(
				append_municipal_result("제조업 고령화", _data.rateOf20sInIndustry.rawData, _data.rateOf20sInIndustry.score, "제조업체 종사자 중 20대 비율")
			);
			$("#result_municipal_industryJobCreation").append(
				append_municipal_result("일자리 창출 위험도", "(비공개)", _data.industryJobCreation.score, "일자리 총 규모 대비 일자리 창출량")
			);
			$("#result_municipal_incomeRate").append(
				append_municipal_result("직장인-주민 괴리도(2016)", _data.incomeRate.rawData, _data.incomeRate.score, "(거주지 기준) 지역내 급여 총액 /<br> (근무지 기준) 지역내 급여 총액")
			);
			$("#result_municipal_R_COSTII").append(
				append_municipal_result("과학기술혁신역량 위험도", _data.R_COSTII.rawData, _data.R_COSTII.score, "과학기술혁신역량지수 R-COSTII")
			);
			$("#result_municipal_expertRate").append(
				append_municipal_result("관리자·전문가 비중 위험도", _data.expertRate.rawData, _data.expertRate.score, "전체 취업자 중 관리자·전문가 비율")
			);

			// municipal total score.
			if ( _data.hiringRate_300.score > 0 ) {
				$("#score_municipal_total .score").html(d3.format(".1f")(_prop.score_total)); // + " / 100.0");
				$("#description_municipal_total").css("display", "none");
			}
			else {
				$(".score_storage .score").append("*");
				$("#score_municipal_total .score").html("0.0* / 100.0");
				$("#description_municipal_total").css("display", "");
			}

			// municipal explanation.
			if ( _data.additional_note == "" ) $("#description_additional_note").css("display", "none");
			else $("#description_additional_note").html("Note: <br>" + _data.additional_note).css("display", "");


			// ----------- province ------------

			// province basic info.
			$("#basicInfo_province").append(append_basicInfo("전체 인구", d3.format(",")(_data_province.population)+"명"));
			$("#basicInfo_province").append(append_basicInfo("평균 연령", d3.format(".1f")(_data_province.mean_age)+"세"));
			$("#basicInfo_province").append(append_basicInfo("전체 종사자수", d3.format(",")(_data_province.numWorkers_inDistrict)+"명"));
			$("#basicInfo_province").append(append_basicInfo("제1제조업 (300인 이상 제조업 중 최대 고용 업종)", _data_province.mainIndustry_300));
			if ( _data_province.factory != "" ) 
				$("#basicInfo_province").append(append_basicInfo("주요 사업체", _data_province.factory));

			// province score.
			$("#result_province_hiringRate_300").append(
				append_province_result("300인 이상 제조업 집중도", _data_province.hiringRate_300.rawData, "제조업 종사자 중 300인 이상 제조업체 종사 비율")
			);
			$("#result_province_hiringRate_1000").append(
				append_province_result("1000인 이상 제조업 집중도", _data_province.hiringRate_1000.rawData, "제조업 종사자 중 1000인 이상 제조업체 종사 비율")
			);
			$("#result_province_mainIndustryPortion").append(
				append_province_result("제1제조업 집중도", _data_province.mainIndustryPortion.rawData, "300인 이상 제조업체 종사자 중 제1제조업 종사 비율")
			);
			$("#result_province_rateOf20sInIndustry").append(
				append_province_result("제조업 고령화", _data_province.rateOf20sInIndustry.rawData, "제조업체 종사자 중 20대 비율")
			);
			$("#result_province_industryJobCreation").append(
				append_province_result("일자리 창출 위험도", "(비공개)", "일자리 총 규모 대비 일자리 창출량")
			);
			$("#result_province_incomeRate").append(
				append_province_result("직장인-주민 괴리도(2016)", _data_province.incomeRate.rawData, "(거주지 기준) 지역내 급여 총액 /<br> (근무지 기준) 지역내 급여 총액")
			);
			$("#result_province_R_COSTII").append(
				append_province_result("과학기술혁신역량 위험도", _data_province.R_COSTII.rawData, "과학기술혁신역량지수 R-COSTII")
			);
			$("#result_province_expertRate").append(
				append_province_result("관리자·전문가 비중 위험도", _data_province.expertRate.rawData, "전체 취업자 중 관리자·전문가 비율")
			);
		}
		
	})(jQuery)
};

function change_dataInfo_needtoSelect() {
	(function($){
		$("#initialNotice").css("display", "");
		$("#nameContainer").css("display", "none");
		$("#result_municipal, #result_province").css("display", "none");
	})(jQuery)
}