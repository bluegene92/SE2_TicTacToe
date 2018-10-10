import { Injectable, OnInit, Input } from '@angular/core';
import { Position } from './../board/position.interface';
import { BoardShape, BoardDimension } from './../board/boardstate';

@Injectable()
export class Referee {

	smallSide:	number = 0;
	largeSide:	number = 0;
	endBlock:	number = 0;

	winningRowList:				number[][] = []
	winningColumnList:			number[][] = []
	winningDiagonalDownlList:	number[][] = []
	winningDiagonalUpList:		number[][] = []

	width:		number = BoardDimension.DEFAULT_WIDTH;
	height:		number = BoardDimension.DEFAULT_HEIGHT;

	boardShape = BoardShape.SHAPE_SQUARE;
	cells = Array(this.width * this.height).fill(null);
	cellsCoordinates = Array(this.width * this.height).fill(null);

	constructor() { }
	ngOnInit() {
		this.generateWinningConditionList();
	}

	generateWinningConditionList() {
		this.generateWinningColumnList();
		this.generateWinningRowList();
		this.generateDiagonalDownList();
		this.generateDiagonalUpList();
	}

	updateBoardDimension(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.classifySide(width, height);
		this.generateWinningConditionList();
	}

	generateWinningColumnList() {
		this.winningColumnList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			for (let c = 0; c < this.width; c++) {
				let winningColumn = []
				for (let r = 0; r < this.height; r++) {
					let v = (r * this.width) + c;
					winningColumn.push(v)
				}
				this.winningColumnList.push(winningColumn);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let shiftNeed: number = (this.largeSide - this.smallSide) + 1;
			for (let shift = 0; shift < shiftNeed; shift++) {
				this.endBlock = Number(shift) + Number(this.smallSide) - 1;

				for (let c = 0; c < this.width; c++) {
					let winningColumn = []
					for (let r = shift; r <= this.endBlock; r++) {
						let v = (r * this.width) + c;
						winningColumn.push(v);
					}
					this.winningColumnList.push(winningColumn);
				}
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let c = 0; c < this.width; c++) {
				let winningColumn = []
				for (let r = 0; r < this.height; r++) {
					let v = r * this.width + c;
					winningColumn.push(v)
				}
				this.winningColumnList.push(winningColumn);
			}
		}

	}

	generateWinningRowList() {
		this.winningRowList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			let shiftNeed: number = (this.largeSide - this.smallSide) + 1;
			for (let shift = 0; shift < shiftNeed; shift++) {
				this.endBlock = Number(shift) + Number(this.smallSide) - 1;
				for (let r = 0; r < this.height; r++) {
					let winningRow = []
					for (let c = shift; c <= this.endBlock; c++) {
						let v = c + (r * this.largeSide);
						winningRow.push(v)
					}
					this.winningRowList.push(winningRow);
				}
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			for (let r = 0; r < this.height; r++) {
				let winningRow = []
				for (let c = 0; c < this.width; c++) {
					let v = (r * this.width) + c;
					winningRow.push(v);
				}
				this.winningRowList.push(winningRow);
			}
		} 

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let r = 0; r < this.height; r++) {
				let winningRow = []
				for (let c = 0; c < this.width; c++) {
					let v = (r * this.width) + c;
					winningRow.push(v);
				}
				this.winningRowList.push(winningRow);
			}
		}

	}

	generateDiagonalDownList() {
		this.winningDiagonalDownlList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			let h = (this.height > 1) ? this.smallSide - 1 : 0
			for (let c = 0; c < this.width - h; c++) {
				let winningDiagonalDown = []
				for (let r = 0; r < this.height; r++) {
					let v = r * (Number(this.width) + 1) + c;
					winningDiagonalDown.push(v);
				}
				this.winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let h = (this.height > 1) ? this.smallSide - 1 : 0
			for (let r = 0; r < this.height - h; r++) {
				let winningDiagonalDown = []
				for (let c = 0; c < this.width; c++) {
					let v = (r * Number(this.width)) + c * (Number(this.width) + 1 )
					winningDiagonalDown.push(v);
				}
				this.winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let r = 0; r < 1; r++) {
				let winningDiagonalDown = []
				for (let c = 0; c < this.width; c++) {
					let v = (r * Number(this.width)) + c * (Number(this.width) + 1)
					winningDiagonalDown.push(v);
				}
				this.winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}

	}


	generateDiagonalUpList() {
		this.winningDiagonalUpList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			for (let c = this.smallSide - 1; c < this.width; c++) {
				let winningDiagonalUp = []
				for (let r = 0; r < this.height; r++) {
					let v = r * (this.width - 1) + c
					winningDiagonalUp.push(v);
				}
				this.winningDiagonalUpList.push(winningDiagonalUp);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let h = (this.height > 1) ? this.smallSide - 1 : 0
			for (let r = 0; r < this.height - h; r++) {
				let winningDiagonalUp = []
				for (let c = 0; c < this.width; c++) {
					let v = (r * this.width) + (this.width - 1) + c * (this.width - 1)
					winningDiagonalUp.push(v)
				}
				this.winningDiagonalUpList.push(winningDiagonalUp)
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let c = this.smallSide - 1; c < this.width; c++) {
				let winningDiagonalUp = []
				for (let r = 0; r < this.height; r++) {
					let v = r * (this.width - 1) + c
					winningDiagonalUp.push(v);
				}
				this.winningDiagonalUpList.push(winningDiagonalUp);
			}
		}
	}

	classifySide(width: number, height: number) {
		if (width == height) {
			this.boardShape = BoardShape.SHAPE_SQUARE
			this.smallSide = width;
			this.largeSide = width;
		} else if (width < height) {
			this.boardShape = BoardShape.SHAPE_PORTRAIT
			this.smallSide = width;
			this.largeSide = height;
		} else {
			this.boardShape = BoardShape.SHAPE_LANDSCAPE
			this.smallSide = height;
			this.largeSide = width;
		}
	}
}