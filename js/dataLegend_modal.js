function thead_update(_th_array) {
	var html_string = '';
	for (var th_elem of _th_array) {
		html_string += '<th>' + th_elem + '</th>';
	}
	html_string = '<thead><tr>' + html_string + '</tr></thead>';
	return html_string;
}
function tbody_update(_td_array) {
	var html_string = '';
	for (var td_elem of _td_array) {
		html_string += '<td style="background-color: hsl(0, 100%, ' + (100-td_elem) + '%);">' + td_elem + '</td>'; //'점</td>';
	}
	html_string = '<tbody><tr>' + html_string + '</tr></tbody>';
	return html_string;
}

function modal_update() {
	for (var data_explanation of _data_legend) {
		var html_string = 
			'<div class="data_explanation">' +
				'<h1>' + data_explanation.name + '</h1>' +
				'<div class="explanation_line">' +
					'<div class="explanation_title">원데이터 및 출처</div>' +
					'<div class="explanation">' + 
						data_explanation.calculation + 
						'<div class="source">' + data_explanation.source + '</div>' + 
					'</div>' +
				'</div>' +
				'<div class="explanation_line">' +
					'<div class="explanation_title">색상 반영도</div>' +
					// '<div class="explanation">' + 
						// '최대 ' + data_explanation.max_score + '점' + 
						'<table class="ui unstackable celled collapsing table explanation_table">' +
							thead_update(data_explanation.dataValue_array) + 
							tbody_update(data_explanation.score_array) +
						'</table>' + 
					// '</div>' +
				'</div>' +
			'</div>';

		$("#modal_content").append(html_string);
	}
}