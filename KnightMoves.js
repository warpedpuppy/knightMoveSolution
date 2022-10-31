(function(){

	const knight = document.querySelector('#knight'),
	      endPoint = document.querySelector('#target'),
		  calculatePathButton = document.querySelector("#calculate-path"),
		  squares = [];
	buildBoard ()

	let currentPosition, target;

	function getShortestPath(currentPosition) {
		return move(currentPosition);
		function move (arr) {
			let returnArr = [],
			    solved = false,
				solutions;
			for (let i = 0; i < arr.length; i++) {
				let moveSeries = arr[i];
		
				let lastMove = moveSeries[moveSeries.length - 1]
				let x = lastMove[0], y = lastMove[1];

				if (x === target[0] && y === target[1]) {
					returnArr.push(moveSeries);
					continue;
				}
				
				if (x <= 6) {
					if (y <= 7 && !isInArray([x + 2, y + 1], moveSeries)) {returnArr.push([...moveSeries, [x + 2, y + 1]]); }
					if (y >= 2 && !isInArray([x + 2, y - 1], moveSeries)) {returnArr.push([...moveSeries, [x + 2, y - 1]]);  }
				} 
		
				if (x >= 3) {
					if (y <= 7 && !isInArray([x - 2, y + 1], moveSeries)) {returnArr.push([...moveSeries, [x - 2, y + 1]]); }
					if (y >= 2 && !isInArray([x - 2, y - 1], moveSeries)) {returnArr.push([...moveSeries, [x - 2, y - 1]]); }
				} 
		
				if (y <= 6) {
					if (x <= 7 && !isInArray([x + 1, y + 2], moveSeries)) {returnArr.push([...moveSeries, [x + 1, y + 2]]); }
					if (x >= 2 && !isInArray([x - 1, y + 2], moveSeries)) {returnArr.push([...moveSeries, [x - 1, y + 2]]); }
				} 
		
				if (y >= 3) {
					if (x <= 7 && !isInArray([x + 1, y - 2], moveSeries)) {returnArr.push([...moveSeries, [x + 1, y - 2]]); }
					if (x >= 2 && !isInArray([x - 1, y - 2], moveSeries)) {returnArr.push([...moveSeries, [x - 1, y - 2]]); }
				} 
				
				solutions = returnArr.filter( item => item[item.length - 1][0] == target[0] && item[item.length - 1][1] == target[1]);
				if (solutions.length) solved = true;

			}
			if (solved) {
				return solutions.map( item => item.slice(1)).sort( (a,b) => a.length - b.length)[0];
			} else {
				return move(returnArr)
			}
		}
	}

	function isInArray(item, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][0] === item[0] && arr[i][1] === item[1]) {
				return true;
			}
		}
		return false;
	}
	
	function buildBoard () {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				let square = document.createElement("div");
				square.classList.add(i % 2 === 0 ? 'even' : 'odd')
				squares.push(square);
				square.setAttribute('data-row', i + 1)
				square.setAttribute('data-col', j + 1)
				square.addEventListener('dragover', dragOverHandler);
				document.querySelector("#chess-board").appendChild(square);
			}
		}
		knight.addEventListener("dragstart", clear); 
		endPoint.addEventListener("dragstart", clear); 
		knight.addEventListener("drag", dragHandler); 
		endPoint.addEventListener("drag", dragHandler); 
		calculatePathButton.addEventListener("click", calculatePathHandler)
		
	}

	function dragOverHandler (e) {
		e.preventDefault()
	}

	function calculatePathHandler(e) {
		e.preventDefault();
		if (currentPosition && target) {
			let path = getShortestPath([[currentPosition]]);
			drawPath(path);
		}
	}

	function drawPath(path) {
		let str = `That can be accomplished in ${path.length} move${path.length > 1 ? 's' : ''}. ${currentPosition.join(':')} to `;
		let prior = currentPosition;
		for (let i = 0; i < path.length; i ++) {
			str += path[i].join(':');
			if (i < path.length - 1) str += ", to ";
			grey(path[i][0], path[i][1])
			let current = path[i];
			getSquares(current, prior);
			prior = current;
		}
		document.querySelector("#text").innerText = str+ ".";
	}

	function getSquares(arr1, arr2) {
		let startRow = arr2[0], endRow = arr1[0], startCol = arr2[1], endCol = arr1[1];
		let travelAlong = (Math.abs(startRow - endRow) === 2) ? 'col' : 'row' ;
		if (travelAlong === 'row') {
			for (let i = Math.max(endCol, startCol) ; i > Math.min(endCol, startCol); i--) {
				grey(startRow, i)
			}
		} else if (travelAlong === 'col'){
			 for (let i = Math.max(startRow, endRow) ; i > Math.min(startRow, endRow); i--) {
				grey(i,startCol)
			}
		}
	}

	function grey(row, col) {
		for (let i = 0; i < squares.length; i++) {
			let row1 = squares[i].getAttribute("data-row");
			let col1 = squares[i].getAttribute("data-col");
			if (+row1 === +row && +col1 === +col) {
					squares[i].classList.add('highlight')
			}
		}
	}

	function clear() {
		document.querySelector("#text").innerText = "";
		for (let i = 0; i < squares.length; i++) {
			squares[i].classList.remove('highlight');
		}
	}

	function dragHandler (e) {
		e.preventDefault();
		clear();
		let { pageX, pageY } = e;

		for (let i = 0; i < squares.length; i++) {
			let { x, y, width, height } = squares[i].getBoundingClientRect();

			width = x + width;
			height = y + height;
			
			if (
				pageX > x && pageX < width && pageY > y 
				&& pageY < height && squares[i].children.length < 2 
				&& (squares[i].children[1] === e.target || !squares[i].children[1])
			) {
				e.target.parentNode.removeChild(e.target);
				squares[i].appendChild(e.target)

				if (e.target.id === 'knight') currentPosition = [+squares[i].getAttribute('data-row'), +squares[i].getAttribute('data-col')]
				if (e.target.id === 'target') target = [+squares[i].getAttribute('data-row'), +squares[i].getAttribute('data-col')]
			}


		}
	}

})()


