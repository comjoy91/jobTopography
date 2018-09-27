
function Constituency (_code, _provinceName, _constiName, _dist_acry, _grid_x, _grid_y, _num_elected,
	_electorates, _blank_ballots, _counted_votes, _undervotes, _valid_votes,
	_num_candidate, _result, _withoutVote) {
		this.code = _code; //integer. 지역구별 고유 code.
		this.provinceName = _provinceName; //광역자치단체 이름.
		this.constiName = _constiName; //지역구 이름.
		this.constiName_acronym = _dist_acry; //지역구 이름 약어.
		this.constiName_textAlign; //지역구 이름을 표시할 정6각형에 대한 상대위치. 0:좌상, 1:좌하, 2:우상, 3:우하.
		switch (_provinceName) {
			case "인천": case "인천광역시":
			case "대전": case "대전광역시":
			case "세종특별자치시":
			case "충북": case "충청북도":
			case "충남": case "충청남도":
			case "제주": case "제주도": case "제주특별자치도":
			this.constiName_textAlign = 0;
			break;

			case "광주": case "광주광역시":
			case "경기": case "경기도":
			case "전북": case "전라북도":
			case "전남": case "전라남도":
			this.constiName_textAlign = 1;
			break;

			case "서울": case "서울특별시":
			case "대구": case "대구광역시":
			case "강원": case "강원도":
			case "경북": case "경상북도":
			this.constiName_textAlign = 2;
			break;

			case "부산": case "부산광역시":
			case "울산": case "울산광역시":
			case "경남": case "경상남도":
			this.constiName_textAlign = 3;
			break;

			default:
			this.constiName_textAlign = 2;
			break;
		}

		this.grid_x = _grid_x; //gridX 좌표 정수값.
		this.grid_y = _grid_y; //gridY 좌표 정수값.

		this.withoutVote = _withoutVote //무투표당선 여부. true: 무투표임. false: 투표 했음.
		if (this.withoutVote == null) { this.withoutVote = false; }
		this.electorates = _electorates; //선거인수.
		this.blank_ballots = _blank_ballots; //기권.
		this.counted_votes = _counted_votes; //투표수.
		this.undervotes = _undervotes; //무효표수.
		this.valid_votes = _valid_votes; //유효표수.

		this.num_elected = _num_elected; //총 당선자수.

		this.num_candidate = _num_candidate; //총 후보자수.
		this.votes_array = new Array(_num_candidate); //int[]. 후보별 실득표수.
		this.partyClass_candiArray = new Array(_num_candidate); //String[]. 후보별 partyClass(=당명에 따른 당 분류).
		var candi_arr = _result; //JSONArray. 후보별 득표 및 정보.
		for (var i=0; i<_num_candidate; i++) {
			this.votes_array[i] = candi_arr[i]["votenum"];
			this.partyClass_candiArray[i] = candi_arr[i]["partyClass"];
		}

		var total_plot;
		if (prop_or_sameArea == PROPORTIONAL_AREA) {
			if (this.counted_votes <= 0) { total_plot = 0; } 
			else {
				total_plot = Math.round(this.counted_votes / POPUL_PERPLOT);
				if (total_plot <= 0) { total_plot = 1; } 
			}
		}
		else {
			total_plot = PLOT_UNITHEX * this.num_elected;
		}

		this.total_plot = total_plot; //지역구 전체 점복자 개수.
		if (total_plot <= 0) {
			this.sideLength_ratio = Math.sqrt(6 / PLOT_UNITHEX); // 점복자 개수가 0이나 음수일 때, sideLength_ratio가 최소한 점 6개짜리 6각형과 같도록 함.
		}
		else if (total_plot < 6) {
			this.sideLength_ratio = Math.sqrt(6 / PLOT_UNITHEX); // 점복자 개수가 6 미만일 때, sideLength_ratio가 최소한 점 6개짜리 6각형과 같도록 함.
		}
		else if (total_plot < 9) {
			this.sideLength_ratio = Math.sqrt(9 / PLOT_UNITHEX); // 점복자 개수가 9 미만일 때, sideLength_ratio가 최소한 점 9개짜리 6각형과 같도록 함.
		}
		else if (total_plot < 12) {
			this.sideLength_ratio = Math.sqrt(12 / PLOT_UNITHEX); // 점복자 개수가 12 미만일 때, sideLength_ratio가 최소한 점 12개짜리 6각형과 같도록 함.
		}
		else {
			this.sideLength_ratio = Math.sqrt((total_plot-(total_plot%3)) / PLOT_UNITHEX); // 6각형 면적은 점복자 모드 때의 면적으로 할 것이냐, 절대적인 인구비례로 할 것인가.
		}
		// this.sideLength_ratio = Math.sqrt(total_plot / PLOT_UNITHEX); // 6각형 면적은 점복자 모드 때의 면적으로 할 것이냐, 절대적인 인구비례로 할 것인가.


		// 기준 - 총 투표수: 각 후보별 + 무표효의 점복자 숫자를 구한다. Sainte-Laguë method 방법에 의한 배분.
		this.plots_candiArray = new Array(_num_candidate); //int[]. 각 후보별 점복자 개수.
		this.plots_undervotes = 0; //int. 무효표의 점복자 개수.

		var quotient_candidateArray = new Array(_num_candidate); //float[]. 각 후보별 Sainte-Laguë quotient.
		var quotient_undervote; //float. 무효표의 Sainte-Laguë quotient.
			//quotient, plots 초기화.
		for(var i=0; i<_num_candidate; i++) {
			quotient_candidateArray[i] = this.get_candi_votes(i) / 0.5;
			this.plots_candiArray[i] = 0;
		}
		quotient_undervote = this.get_undervotes() / 0.5;

		var round = 0; //Sainte-Laguë round.
		while (round < total_plot) {
			var max=0;
			for(var i=0; i<_num_candidate; i++) {
				if (quotient_candidateArray[max] < quotient_candidateArray[i])
				max = i;
			}
			if (quotient_candidateArray[max] >= quotient_undervote) {
				this.plots_candiArray[max] += 1;
				quotient_candidateArray[max] = this.get_candi_votes(max) / (this.plots_candiArray[max]+0.5);
			}
			else {
				this.plots_undervotes += 1;
				quotient_undervote = this.get_undervotes() / (this.plots_undervotes+0.5);
			}
			round += 1;
		}

}




Constituency.prototype.get_code = function() { return this.code; }
Constituency.prototype.get_provinceName = function() { return this.provinceName; }
Constituency.prototype.get_constiName = function() { return this.constiName; }
Constituency.prototype.get_constiName_acronym = function() { return this.constiName_acronym; }
Constituency.prototype.get_constiName_textAlign = function() { return this.constiName_textAlign; }

Constituency.prototype.get_grid = function() { return new Grid_coordi(this.grid_x, this.grid_y); }

Constituency.prototype.did_withoutVote = function() { return this.withoutVote; }
Constituency.prototype.get_electorates = function() { return this.electorates; }
Constituency.prototype.get_blank_ballots = function() { return this.blank_ballots; }
Constituency.prototype.get_counted_votes = function() { return this.counted_votes; }
Constituency.prototype.get_undervotes = function() { return this.undervotes; }
Constituency.prototype.get_valid_votes = function() { return this.valid_votes; }
Constituency.prototype.get_num_elected = function() { return this.num_elected; }

Constituency.prototype.get_total_plot = function() { return this.total_plot; }
Constituency.prototype.get_sideLength_ratio = function() { return this.sideLength_ratio; }

Constituency.prototype.get_num_candidate = function() { return this.num_candidate; }
Constituency.prototype.get_candi_votes = function(_i) { return this.votes_array[_i]; } //_i번째 후보의 실제 득표수.
Constituency.prototype.get_candi_plot = function(_i) { return this.plots_candiArray[_i]; } //_i번째 후보의 점복자 개수.
Constituency.prototype.get_undervotes_plot = function(_i) { return this.plots_undervotes; } //무효표 점복자 개수.
Constituency.prototype.get_candi_partyClass = function(_i) { return this.partyClass_candiArray[_i]; } //_i번째 후보의 partyClass.
