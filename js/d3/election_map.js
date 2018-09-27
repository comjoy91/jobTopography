
//TODO: Election_Map.blooming(), Election_Map.kerning() 상수별 재편 필요.



// const SQRT_3 = Math.sqrt(3);

function Grid_coordi (_gridX, _gridY) { // _gridArray = (_gridX, _gridY)를 받아서 Grid_coordi class object를 만듦.
	this.gridX = _gridX;
	this.gridY = _gridY;
}
Grid_coordi.prototype.getX = function() { return this.gridX; }
Grid_coordi.prototype.getY = function() { return this.gridY; }

function Actual_coordi (_coordiX, _coordiY) { // _coordiArray = (_coordiX, _coordiY)를 받아서 Actual_coordi class object를 만듦.
	this.coordiX = _coordiX;
	this.coordiY = _coordiY;
}
Actual_coordi.prototype.getX = function() { return this.coordiX; }
Actual_coordi.prototype.getY = function() { return this.coordiY; }
Actual_coordi.prototype.setX = function(_coordiX) { this.coordiX = _coordiX; }
Actual_coordi.prototype.setY = function(_coordiY) { this.coordiY = _coordiY; }

function HexCode (_province_index, _consti_index) { // _hexCodeArray = (_province_index, _consti_index)를 받아서 HexCode class object를 만듦.
	this.province_index = _province_index;
	this.consti_index = _consti_index;
}
HexCode.prototype.get_provinceIndex = function() { return this.province_index; }
HexCode.prototype.get_constiIndex = function() { return this.consti_index; }




function Election_Map (_counting_vote_json, _townCode_json, _halfEdge, _init_centerDistance, _originX, _originY) {

	this.counting_vote_json = _counting_vote_json["results"];
	this.townCode_json = _townCode_json["results"];

	//consti, hexCode와 직접 연관된 구성요소.
	this.provinceNum = this.counting_vote_json.length;
	this.constiNum_inProvince = [];
	this.constiNum = 0;
	this.consti_array = []; // private Constituency[][]. [provinceIndex][constiIndex]에 위치한 Constituency class object.
	this.hexCode_array = []; // private HexCode[]. consti_array의 순서대로 HexCode = (provinceIndex, constiIndex)를 나열한 1차원 배열.

	// constiNum_inProvince, constiNum, consti_array, hexCode_array 확정. TODO: constituency, town, 각 항목별로 어떻게 만들지?!
	switch (ELECTION_TYPE) {
		case "assembly": case "local-pp": case "local-ma": case "local-ep": 
			for (var i=0; i<this.provinceNum; i++) {
				this.consti_array.push([]);

				var province_counting_vote = this.counting_vote_json[i]["district_result"];
				var province_townCodeJSON = this.townCode_json[i]
				var province_constiCode_seq = province_townCodeJSON["consti_Seq"];
				this.constiNum_inProvince.push(province_constiCode_seq.length);

				for (var j=0; j<this.constiNum_inProvince[i]; j++) {
					this.hexCode_array.push(new HexCode(i, j));
					var constiCode = province_constiCode_seq[j];
					var constiCode_str = constiCode.toString();

					this.consti_array[i].push(new Constituency(
						constiCode,
						province_townCodeJSON["city_name"],
						province_townCodeJSON["code_toConsti"][constiCode_str],
						province_townCodeJSON["code_toConstiAcronym"][constiCode_str],
						province_townCodeJSON["code_toConstiGridCoordi"][constiCode_str][0],
						province_townCodeJSON["code_toConstiGridCoordi"][constiCode_str][1],
						province_townCodeJSON["code_toNumElected"][constiCode_str],
						province_counting_vote[j]["electorates"],
						province_counting_vote[j]["blank_ballots"],
						province_counting_vote[j]["counted_votes"],
						province_counting_vote[j]["undervotes"],
						province_counting_vote[j]["valid_votes"],
						province_counting_vote[j]["num_candidate"],
						province_counting_vote[j]["result"],
						province_counting_vote[j]["withoutVote"]
					));
					this.constiNum++;
				}
			}
			break;

		case "president": case "assembly_PR": case "local-pp_PR": case "local-pa": case "local-ea": 
			for (var i=0; i<this.provinceNum; i++) {
				this.consti_array.push([]);

				var province_counting_vote = this.counting_vote_json[i]["district_result"];
				var province_townCodeJSON = this.townCode_json[i]
				var province_townCode_seq = province_townCodeJSON["town_Seq"];
				this.constiNum_inProvince.push(province_townCode_seq.length);

				for (var j=0; j<this.constiNum_inProvince[i]; j++) {
					this.hexCode_array.push(new HexCode(i, j));
					var townCode = province_townCode_seq[j];
					var townCode_str = townCode.toString();

					this.consti_array[i].push(new Constituency(
						townCode,
						province_townCodeJSON["city_name"],
						province_townCodeJSON["code_toTown"][townCode_str],
						province_townCodeJSON["code_toTownAcronym"][townCode_str],
						province_townCodeJSON["code_toTownGridCoordi"][townCode_str][0],
						province_townCodeJSON["code_toTownGridCoordi"][townCode_str][1],
						1,
						province_counting_vote[j]["electorates"],
						province_counting_vote[j]["blank_ballots"],
						province_counting_vote[j]["counted_votes"],
						province_counting_vote[j]["undervotes"],
						province_counting_vote[j]["valid_votes"],
						province_counting_vote[j]["num_candidate"],
						province_counting_vote[j]["result"],
						province_counting_vote[j]["withoutVote"]
					));
					this.constiNum++;
				}
			};
			break;

			case "local-mp_PR": 
			for (var i=0; i<this.provinceNum; i++) {
				this.consti_array.push([]);

				var province_counting_vote = this.counting_vote_json[i]["district_result"];
				var province_townCodeJSON = this.townCode_json[i]
				var province_PR_constiCode_seq = province_townCodeJSON["PR_consti_Seq"];
				this.constiNum_inProvince.push(province_PR_constiCode_seq.length);

				for (var j=0; j<this.constiNum_inProvince[i]; j++) {
					this.hexCode_array.push(new HexCode(i, j));
					var PR_constiCode = province_PR_constiCode_seq[j];
					var PR_constiCode_str = PR_constiCode.toString();

					this.consti_array[i].push(new Constituency(
						constiCode,
						province_townCodeJSON["city_name"],
						province_townCodeJSON["PR_code_toConsti"][PR_constiCode_str],
						province_townCodeJSON["PR_code_toConstiAcronym"][PR_constiCode_str],
						province_townCodeJSON["PR_code_toConstiGridCoordi"][PR_constiCode_str][0],
						province_townCodeJSON["PR_code_toConstiGridCoordi"][PR_constiCode_str][1],
						province_townCodeJSON["PR_code_toNumElected"][PR_constiCode_str],
						province_counting_vote[j]["electorates"],
						province_counting_vote[j]["blank_ballots"],
						province_counting_vote[j]["counted_votes"],
						province_counting_vote[j]["undervotes"],
						province_counting_vote[j]["valid_votes"],
						province_counting_vote[j]["num_candidate"],
						province_counting_vote[j]["result"],
						province_counting_vote[j]["withoutVote"]
					));
					this.constiNum++;
				}
			}
			break;

		default: 
			break;
	}

	//max_grid / min_grid와 직접 연관된 구성요소.
	this.gridX_max = this.get_grid(this.get_hexCode_byIndex(0)).getX(); //최대 gridX가 될 예정.
	this.gridX_min = this.gridX_max; //최소 gridX가 될 예정.
	this.gridY_max = this.get_grid(this.get_hexCode_byIndex(0)).getY(); //최대 gridY가 될 예정.
	this.gridY_min = this.gridY_max; //최소 gridY가 될 예정.

	// gridX_max, gridY_max, gridX_min, gridY_min 확정.
	for (var i=0; i<this.get_constiNum(); i++) {
		recent_gridX = this.get_grid(this.get_hexCode_byIndex(i)).getX();
		recent_gridY = this.get_grid(this.get_hexCode_byIndex(i)).getY();
		if (recent_gridX > this.gridX_max)
		this.gridX_max = recent_gridX;
		else if (recent_gridX < this.gridX_min)
		this.gridX_min = recent_gridX;
		if (recent_gridY > this.gridY_max)
		this.gridY_max = recent_gridY;
		else if (recent_gridY < this.gridY_min)
		this.gridY_min = recent_gridY;
	}


	this.init_centerDistance = _init_centerDistance; // 초기 배열시, 각 다각형 중심끼리의 거리.
	this.halfEdge = _halfEdge; // 단위 6각형의 한 변 크기 절반의 길이.
	// 원점 좌표
	this.originX = _originX;
	this.originY = _originY;
	var grid_dx = this.init_centerDistance/2*SQRT_3;
	var grid_dy = this.init_centerDistance;
	this.bangwooiNum = 6; //총 방위개수. // (x-1 y-1):0 / (x-1 y):1 / (x y-1):3 / (x y+1):2 / (x+1 y):4 / (x+1 y+1):5
	// 각 방위로 1 길이만큼 움직이기 위해 이동해야 하는 +x방향 이동길이(a_dist), +y방향 이동길이(b_dist).
	this.a_dist = [-SQRT_3/2, -SQRT_3/2, 0, 0, SQRT_3/2, SQRT_3/2];
	this.b_dist = [-1/2, 1/2, 1, -1, -1/2, 1/2];



	this.hexCode_byGrid; // private int[][][] -> Grid_coordi[][]. [gridX][gridY] 자리의 다각형이 HexCode 몇에 이어지느냐? ((-1, -1): 존재하지 않음)
	this.coordi_byGrid; //private float[][][] -> Actual_coordi[][]. [gridX][gridY] 자리의 (x,y)좌표
	this.sideLength_ratio_byGrid; //private float[][]. [gridX][gridY] 자리의 육각형 배율(닮음비).
	this.distance_byGrid; //private (float[])[][]. [gridX][gridY]의 bangwooi번째 방향 자리의 거리.

	//hexCode_byGrid, coordi, sideLength_ratio, distance 구조 초기화.
	this.hexCode_byGrid = new Array(this.get_gridX_max()+1);
	this.coordi_byGrid = new Array(this.get_gridX_max()+1);
	this.sideLength_ratio_byGrid = new Array(this.get_gridX_max()+1);
	this.distance_byGrid = new Array(this.get_gridX_max()+1);

	for (var i=0; i<=this.get_gridX_max(); i++) {
		this.hexCode_byGrid[i] = new Array(this.get_gridY_max()+1);
		this.coordi_byGrid[i] = new Array(this.get_gridY_max()+1);
		this.sideLength_ratio_byGrid[i] = new Array(this.get_gridY_max()+1);
		this.distance_byGrid[i] = new Array(this.get_gridY_max()+1);

		for (var j=0; j<=this.get_gridY_max(); j++) {
			this.hexCode_byGrid[i][j] = new HexCode(-1, -1); // hexCode_byGrid[][]를 [-1, -1]로 초기화: '지역구가 없는 칸'에는 -1이 들어감.
			this.coordi_byGrid[i][j] = new Actual_coordi(grid_dx*i + this.originX, grid_dy*(j-i/2) + this.originY); // coordi[][]를 초기화: 중심이 균일배열되게.
			this.sideLength_ratio_byGrid[i][j] = 0.0; // sideLength_ratio[][]를 0.0으로 initialize: '지역구가 없는 칸'에는 0.0이 들어감.
			this.distance_byGrid[i][j] = new Array(this.get_bangwooiNum());

			for(var k=0; k<this.get_bangwooiNum(); k++) {
				this.distance_byGrid[i][j][k] = 0.0; // distance[][][]를 0.0으로 initialize.
			}
		}
	}

	//hexCode_byGrid, sideLength_ratio_byGrid를 실제 값에 맞게 초기화.
	for (var i=0; i<this.get_constiNum(); i++) {
		var grid = this.get_consti(this.get_hexCode_byIndex(i)).get_grid();
		var grid_x = grid.getX();
		var grid_y = grid.getY();

		this.hexCode_byGrid[grid_x][grid_y] = this.get_hexCode_byIndex(i);
		this.sideLength_ratio_byGrid[grid_x][grid_y] = this.get_consti(this.get_hexCode_byIndex(i)).get_sideLength_ratio();
	}

	this.sideLength_ratio_avg; //평균크기 다각형의 '배율': root mean square
	var sideLength_ratio_sum = 0;
	for (var i=0; i<this.get_constiNum(); i++) {
		// sideLength_ratio_squareSum += Math.pow(this.get_sideLength_ratio_byGrid(this.get_grid(this.get_hexCode_byIndex(i))), 2);
		sideLength_ratio_sum += this.get_sideLength_ratio_byGrid(this.get_grid(this.get_hexCode_byIndex(i)));
	}
	// this.sideLength_ratio_avg = Math.sqrt(sideLength_ratio_squareSum/this.get_constiNum());
	this.sideLength_ratio_avg = sideLength_ratio_sum/this.get_constiNum();
	// console.log(this.sideLength_ratio_avg);

	// this.distance_avg = 0; //평균 다각형간 거리. : (전체 흰공간)/(전체 다각형 변 길이)
	// // distance_byGrid를 실제 값에 맞게 초기화, distance_avg를 실제 값에 맞게 초기화.
	this.refresh_distance();
	// console.log(this.distance_avg);
	this.blooming();
	this.kerning();
}


Election_Map.prototype.get_provinceNum = function() { return this.provinceNum; }
Election_Map.prototype.get_constiNum_inProvince = function(i) { return this.constiNum_inProvince[i]; }
Election_Map.prototype.get_constiNum = function() { return this.constiNum; }

Election_Map.prototype.get_gridX_max = function() { return this.gridX_max; }
Election_Map.prototype.get_gridY_max = function() { return this.gridY_max; }
Election_Map.prototype.get_gridX_min = function() { return this.gridX_min; }
Election_Map.prototype.get_gridY_min = function() { return this.gridY_min; }

Election_Map.prototype.get_consti = function(_hexCode) { // _hexCode = (_province_index, _consti_index)의 Constituency class object를 얻음.
	return this.consti_array[_hexCode.get_provinceIndex()][_hexCode.get_constiIndex()];
}
Election_Map.prototype.get_grid = function(_hexCode) { // _hexCode = (_province_index, _consti_index)의 grid = (gridX, gridY)를 return.
	return this.get_consti(_hexCode).get_grid();
}
Election_Map.prototype.get_coordi_byHexCode = function(_hexCode) { // _hexCode = (_province_index, _consti_index)의 coordi = (coordiX, coordiY)를 return.
	return this.get_coordi_byGrid(this.get_grid(_hexCode));
}
Election_Map.prototype.get_hexCode_byIndex = function(_i) { // _i번째 hexCode를 return.
	return this.hexCode_array[_i]
}


Election_Map.prototype.get_coordi_byGrid = function(_grid) { // _grid = (_gridX, _gridY)번째 점의 coordi = (coordiX, coordiY)를 return.
	return this.coordi_byGrid[_grid.getX()][_grid.getY()];
}
Election_Map.prototype.set_coordiX_byGrid = function(_grid, _coordi_x) { // _grid = (_gridX, _gridY)번째 점의 x좌표를 _coordi_x로 변경.
	this.coordi_byGrid[_grid.getX()][_grid.getY()].setX(_coordi_x);
}
Election_Map.prototype.set_coordiY_byGrid = function(_grid, _coordi_y) { // _grid = (_gridX, _gridY)번째 점의 y좌표를 _coordi_y로 변경.
	this.coordi_byGrid[_grid.getX()][_grid.getY()].setY(_coordi_y);
}

Election_Map.prototype.get_bangwooiNum = function() { return this.bangwooiNum; }


Election_Map.prototype.get_a_dist = function(_bangwooi) { // _bangwooi 방향으로 향하는 단위 벡터의 x방향 성분
	return this.a_dist[_bangwooi];
}
Election_Map.prototype.get_b_dist = function(_bangwooi) { // _bangwooi 방향으로 향하는 단위 벡터의 y방향 성분
	return this.b_dist[_bangwooi];
}
Election_Map.prototype.get_halfEdge = function() { return this.halfEdge; }


Election_Map.prototype.get_hexCode_byGrid = function(_grid) { // _grid = (_gridX, _gridY)번째 점의 hexCode_byGrid integer.
	return this.hexCode_byGrid[_grid.getX()][_grid.getY()];
}

Election_Map.prototype.get_sideLength_ratio_byGrid = function(_grid) { // _grid = (_gridX, _gridY)번째 다각형의 변의 unitHex에 대한 닮음비.
	return this.sideLength_ratio_byGrid[_grid.getX()][_grid.getY()];
}
Election_Map.prototype.get_sideLength_ratio_avg = function() { return this.sideLength_ratio_avg; }

Election_Map.prototype.get_distance_byGrid = function(_grid, _bangwooi) { // _grid = (_gridX, _gridY)번째 다각형이 _bangwooi방향 이웃 다각형과 떨어진 거리 (저장한 값).
	return this.distance_byGrid[_grid.getX()][_grid.getY()][_bangwooi];
}
Election_Map.prototype.set_distance_byGrid = function(_grid, _bangwooi, _dist) { // _grid = (_gridX, _gridY)번째 다각형이 _bangwooi방향 이웃 다각형과 떨어진 거리를  _dist로 지정.
	this.distance_byGrid[_grid.getX()][_grid.getY()][_bangwooi] = _dist;
}
// Election_Map.prototype.get_distance_avg = function() { return this.distance_avg; }
Election_Map.prototype.measure_distance = function(_grid, _bangwooi) { // _gridX = (_gridX, _gridY)번째 다각형이 _bangwooi방향 이웃 다각형과 떨어진 거리 (즉석에서 계산한 값).
	var next_grid = this.grid_neighbour(_grid, _bangwooi);
	return this.get_a_dist(_bangwooi)*(this.get_coordi_byGrid(next_grid).getX()-this.get_coordi_byGrid(_grid).getX())
	+ this.get_b_dist(_bangwooi)*(this.get_coordi_byGrid(next_grid).getY()-this.get_coordi_byGrid(_grid).getY())
	- this.get_halfEdge()*SQRT_3*(this.get_sideLength_ratio_byGrid(next_grid)+this.get_sideLength_ratio_byGrid(_grid)); // 빼는 값: 두 다각형의 중심~변까지의 수직거리.
}

Election_Map.prototype.dist_move = function(_grid, _distance, _bangwooi) { // _grid의 다각형을 bangwooi 방향으로 distance만큼 움직임.
	var x = this.get_coordi_byGrid(_grid).getX() + (_distance * this.get_a_dist(_bangwooi));
	var y = this.get_coordi_byGrid(_grid).getY() + (_distance * this.get_b_dist(_bangwooi));

	this.set_coordiX_byGrid(_grid, x);
	this.set_coordiY_byGrid(_grid, y);
}

// Election_Map.prototype.neighbour_sideLength_ratio_mean = function(_grid) { // _grid 지점 이웃 다각형 6개의 sideLength_ratio 평균.
// 	var sideLength_ratio_sum = 0;
// 	var hex_count = 0;
// 	for (var bang=0; bang<this.get_bangwooiNum(); bang++) {
// 		var neighbour_grid = this.grid_neighbour(_grid, bang);
// 		if (this.isExist_byGrid(neighbour_grid)) {
// 			sideLength_ratio_sum += Math.pow(this.get_sideLength_ratio_byGrid(neighbour_grid), 2);
// 			hex_count++;
// 		}
// 	}
// 	return Math.sqrt(sideLength_ratio_sum/hex_count);
// }
// Election_Map.prototype.NOTExist_sideLength_ratio = function(_grid) { // kerning() 메소드에서, _grid 지점에 다각형이 없을 경우, sideLength_ratio를 그 이웃 6개 다각형의 평균으로 취급.
// 	return this.neighbour_sideLength_ratio_mean(_grid);
// }

Election_Map.prototype.hex_distance_avg = function(_grid) { // _grid 지점 이웃 다각형 6개의 sideLength_ratio 평균. 만약 이웃이 전혀 없으면 0을 return.
	var distance_sum = 0;
	var dist_count = 0;
	for (var bang=0; bang<this.get_bangwooiNum(); bang++) {
		var neighbour_grid = this.grid_neighbour(_grid, bang);
		if (this.isExist_byGrid(neighbour_grid)) {
			distance_sum += this.measure_distance(_grid, bang);
			dist_count++;
		}
	}
	if (dist_count == 0) return 0;
	else return distance_sum/dist_count;
}
Election_Map.prototype.NOTExist_distance = function(_grid, _bang) { // kerning() 메소드에서, _grid 지점의 _bang 방향에 이웃한 다각형이 없을 경우, distance를 _grid의 나머지 방향 distance의 평균으로 취급.
	return this.hex_distance_avg(_grid);
}


//////////////////////////


Election_Map.prototype.isExist_byGrid = function(_grid) { // _grid = (_gridX, _gridY)번째 점에 다각형(지역구)가 존재하는가?
	var _x = _grid.getX();
	var _y = _grid.getY();
	if (_x > this.get_gridX_max() || _x < this.get_gridX_min() || _y > this.get_gridY_max() || _y < this.get_gridY_min()) // _x, _y가 최대/최소값 범위를 벗어난다면...
	return false;
	else if (this.get_hexCode_byGrid(_grid).get_provinceIndex() > -1) //그 위치에 실제로 다각형(지역구)가 존재한다면, 이 값이 -1보단 커야지.
	return true;
	else return false;
}
Election_Map.prototype.grid_neighbour = function(_grid, _bangwooi) { // _grid = (_gridX, _gridY)의 다각형의 _bangwooi방향 이웃 다각형의 grid좌표.
	return new Grid_coordi(_grid.getX()+(Math.floor(_bangwooi/2) - 1), _grid.getY()+(_bangwooi%3 - 1));
}
Election_Map.prototype.refresh_distance = function() {
	// var distance_area = 0;
	// var sideLength_ratio_count = 0;

	// var distance_sum = 0;
	// var sideLength_count = 0;

	for (var i=0; i<this.get_constiNum(); i++) {
		var consti_grid = this.get_grid(this.get_hexCode_byIndex(i));

		for (var j=0; j<this.get_bangwooiNum(); j++) { // bangwooi를 증가시키면서, distance[][][]를 gridX, gridY initialize함. (중심이 균일배열되게.)
			var next_grid = this.grid_neighbour(consti_grid, j);

			if (this.isExist_byGrid(next_grid)) { //거리를 잴 상대위치에 실제로 다각형(지역구)가 존재한다면...
				var distance_val = this.measure_distance(consti_grid, j);
				this.set_distance_byGrid(consti_grid, j, distance_val);
				// distance_area += (this.get_sideLength_ratio_byGrid(consti_grid)+this.get_sideLength_ratio_byGrid(next_grid))*distance_val/2;
				// sideLength_ratio_count += this.get_sideLength_ratio_byGrid(next_grid);

				// distance_sum += distance_val;
				// sideLength_ratio_count += 1;
			}
			else {
				this.set_distance_byGrid(consti_grid, j, this.NOTExist_distance(consti_grid, j));
			}
		}
	}
	// this.distance_avg = distance_area / sideLength_ratio_count; // distance_avg: 평균!
	// this.distance_avg = distance_sum / sideLength_count;
}


//////////////////////////


Election_Map.prototype.blooming = function() {
	var i_, j_, k;
	var div_c;
	var consti_grid;
	var move_dist;
	var sideLength_ratio_avg = this.get_sideLength_ratio_avg();
	var halfEdge = this.get_halfEdge();
	var gridX_max = this.get_gridX_max();
	var gridY_max = this.get_gridY_max();
	var gridX_min = this.get_gridX_min();
	var gridY_min = this.get_gridY_min();

	for (var i=0; i<=gridX_max; i++) {
		for (var j=0; j<=gridY_max; j++) { // i, j: 기준점(blooming될) 다각형의 정수좌표. i_, j_: blooming하면서 이동할 다각형의 정수좌표. k: k의 최대/최소 제한을 명기하는 변수.
			var origin_grid = new Grid_coordi(i, j);
			var moving_grid;
			if (this.isExist_byGrid(origin_grid)) {
				move_dist = (this.get_sideLength_ratio_byGrid(origin_grid) - sideLength_ratio_avg) * halfEdge * SQRT_3 / 12;

				for (i_=i-1; i_>=gridX_min; i_--) {
					moving_grid = new Grid_coordi(i_, j);
					this.dist_move(moving_grid, move_dist*4, 1);

					k = j - (i-i_);
					if (k>=gridY_min) {
						moving_grid = new Grid_coordi(i_, k);
						this.dist_move(moving_grid, move_dist*4, 0);
					}
					// for (j_=j-1; (j_>k && j_>=gridY_min); j_--) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = j-k;
					// 	this.dist_move(moving_grid, move_dist/div_c*(j_-k)*0, 1);
					// 	this.dist_move(moving_grid, move_dist/div_c*(j-j_)*0, 0);
					// }
					// for (j_=k-1; j_>=gridY_min; j_--) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = j-j_;
					// 	this.dist_move(moving_grid, move_dist/div_c*(i-i_)*0, 0);
					// 	this.dist_move(moving_grid, move_dist/div_c*(div_c-(i-i_))*0, 3);
					// }
					// for (j_=j+1; j_<=gridY_max; j_++) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = (i-i_)+(j_-j);
					// 	this.dist_move(moving_grid, move_dist/div_c*(i-i_)*0, 1);
					// 	this.dist_move(moving_grid, move_dist/div_c*(j_-j)*0, 2);
					// }
				}
				for (i_=i+1; i_<=gridX_max; i_++) {
					moving_grid = new Grid_coordi(i_, j);
					this.dist_move(moving_grid, move_dist*4, 4);

					k = j + (i_-i);
					if (k<=gridY_max) {
						moving_grid = new Grid_coordi(i_, k);
						this.dist_move(moving_grid, move_dist*4, 5);
					}
					// for (j_=j+1; (j_<k && j_<=gridY_max); j_++) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = k-j;
					// 	this.dist_move(moving_grid, move_dist/div_c*(k-j_)*0, 4);
					// 	this.dist_move(moving_grid, move_dist/div_c*(j_-j)*0, 5);
					// }
					// for (j_=j-1; j_>=gridY_min; j_--) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = (i_-i)+(j-j_);
					// 	this.dist_move(moving_grid, move_dist/div_c*(i_-i)*0, 4);
					// 	this.dist_move(moving_grid, move_dist/div_c*(j-j_)*0, 3);
					// }
					// for (j_=k+1; j_<=gridY_max; j_++) {
					// 	moving_grid = new Grid_coordi(i_, j_);
					// 	div_c = j_-j;
					// 	this.dist_move(moving_grid, move_dist/div_c*(i_-i)*0, 5);
					// 	this.dist_move(moving_grid, move_dist/div_c*(div_c-(i_-i))*0, 2);
					// }
				}
				for (j_=j-1; j_>=gridY_min; j_--) {
					moving_grid = new Grid_coordi(i, j_);
					this.dist_move(moving_grid, move_dist*4, 3);
				}
				for (j_=j+1; j_<=gridY_max; j_++){
					moving_grid = new Grid_coordi(i, j_);
					this.dist_move(moving_grid, move_dist*4, 2);
				}
			}
		}
	}

	this.refresh_distance();
}

Election_Map.prototype.kerning = function() {
	var move_dist;
	var moving_grid;
	var gridX_max = this.get_gridX_max();
	var gridY_max = this.get_gridY_max();
	var gridX_min = this.get_gridX_min();
	var gridY_min = this.get_gridY_min();

	// for (var i=0; i<=gridX_max; i++) {
	// 	for (var j=0; j<=gridY_max; j++) {
	// 		moving_grid = new Grid_coordi(i, j);

	// 		move_dist = (this.get_distance_byGrid(moving_grid, 0) - this.get_distance_byGrid(moving_grid, 5)) / 6;
	// 		this.dist_move(moving_grid, move_dist, 0);
	// 		move_dist = (this.get_distance_byGrid(moving_grid, 1) - this.get_distance_byGrid(moving_grid, 4)) / 6;
	// 		this.dist_move(moving_grid, move_dist, 1);
	// 		move_dist = (this.get_distance_byGrid(moving_grid, 2) - this.get_distance_byGrid(moving_grid, 3)) / 6;
	// 		this.dist_move(moving_grid, move_dist, 2);
	// 	}
	// }

	// for (var i=0; i<=gridX_max; i++) {
	// 	for (var j=0; j<=gridY_max; j++) {
	// 		moving_grid = new Grid_coordi(i, j);
	// 		move_dist = (this.get_distance_byGrid(moving_grid, 0) + this.get_distance_byGrid(moving_grid, 1) - this.get_distance_byGrid(moving_grid, 4) - this.get_distance_byGrid(moving_grid, 5)) / 4;
	// 		this.dist_move(moving_grid, move_dist, 0);
	// 		this.dist_move(moving_grid, move_dist, 1);		
	// 		move_dist = (this.get_distance_byGrid(moving_grid, 1) + this.get_distance_byGrid(moving_grid, 2) - this.get_distance_byGrid(moving_grid, 3) - this.get_distance_byGrid(moving_grid, 4)) / 4;	
	// 		this.dist_move(moving_grid, move_dist, 1);
	// 		this.dist_move(moving_grid, move_dist, 2);		
	// 		move_dist = (this.get_distance_byGrid(moving_grid, 0) + this.get_distance_byGrid(moving_grid, 3) - this.get_distance_byGrid(moving_grid, 2) - this.get_distance_byGrid(moving_grid, 5)) / 4;
	// 		this.dist_move(moving_grid, move_dist, 3);
	// 		this.dist_move(moving_grid, move_dist, 0);
	// 	}
	// }

	for (var i=0; i<this.get_constiNum(); i++) {
		moving_grid = this.get_grid(this.get_hexCode_byIndex(i));
		move_dist = (this.get_distance_byGrid(moving_grid, 0) + this.get_distance_byGrid(moving_grid, 1) - this.get_distance_byGrid(moving_grid, 4) - this.get_distance_byGrid(moving_grid, 5)) / 4;
		this.dist_move(moving_grid, move_dist, 0);
		this.dist_move(moving_grid, move_dist, 1);		
		move_dist = (this.get_distance_byGrid(moving_grid, 1) + this.get_distance_byGrid(moving_grid, 2) - this.get_distance_byGrid(moving_grid, 3) - this.get_distance_byGrid(moving_grid, 4)) / 4;	
		this.dist_move(moving_grid, move_dist, 1);
		this.dist_move(moving_grid, move_dist, 2);		
		move_dist = (this.get_distance_byGrid(moving_grid, 0) + this.get_distance_byGrid(moving_grid, 3) - this.get_distance_byGrid(moving_grid, 2) - this.get_distance_byGrid(moving_grid, 5)) / 4;
		this.dist_move(moving_grid, move_dist, 3);
		this.dist_move(moving_grid, move_dist, 0);
	}


	this.refresh_distance();

}
