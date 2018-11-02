
import { Injectable, OnInit, Input } from '@angular/core';
import { BoardShape, BoardDimension } from './../board/board.state';

/**
 * This service can generate the winning set with
 * the given board width and height.
 * It uses the smaller side is the set size.
 * Ex. In 3x5, the set size is 3.
 * It can generate row, column, and diagonals.
 * Ex. In 3x3 board, one of the win set for row is [0, 1, 2].
 * */
@Injectable()
export class WinningSetGenerator {
	endBlock: number = 0;
	boardShape: string = BoardShape.SHAPE_SQUARE
	width: number = BoardDimension.DEFAULT_WIDTH;
	height: number = BoardDimension.DEFAULT_HEIGHT;
	generateWinningColumnList(width: number, height: number) {
		this.initializeBoardConfiguration(width, height);
		let winningColumnList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			for (let c = 0; c < width; c++) {
				let winningColumn = []
				for (let r = 0; r < height; r++) {
					let v = (r * width) + c;
					winningColumn.push(v)
				}
				winningColumnList.push(winningColumn);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let shiftNeed: number = (height - width) + 1;
			for (let shift = 0; shift < shiftNeed; shift++) {
				this.endBlock = Number(shift) + Number(width) - 1;

				for (let c = 0; c < width; c++) {
					let winningColumn = []
					for (let r = shift; r <= this.endBlock; r++) {
						let v = (r * width) + c;
						winningColumn.push(v);
					}
					winningColumnList.push(winningColumn);
				}
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let c = 0; c < width; c++) {
				let winningColumn = []
				for (let r = 0; r < height; r++) {
					let v = r * width + c;
					winningColumn.push(v)
				}
				winningColumnList.push(winningColumn);
			}
		}
		return winningColumnList
	}
	generateWinningRowList(width: number, height: number) {
		this.initializeBoardConfiguration(width, height);
		let winningRowList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			let shiftNeed: number = (width - height) + 1;
			for (let shift = 0; shift < shiftNeed; shift++) {
				this.endBlock = Number(shift) + Number(height) - 1;
				for (let r = 0; r < height; r++) {
					let winningRow = []
					for (let c = shift; c <= this.endBlock; c++) {
						let v = c + (r * width);
						winningRow.push(v)
					}
					winningRowList.push(winningRow);
				}
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			for (let r = 0; r < height; r++) {
				let winningRow = []
				for (let c = 0; c < width; c++) {
					let v = (r * width) + c;
					winningRow.push(v);
				}
				winningRowList.push(winningRow);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let r = 0; r < height; r++) {
				let winningRow = []
				for (let c = 0; c < width; c++) {
					let v = (r * width) + c;
					winningRow.push(v);
				}
				winningRowList.push(winningRow);
			}
		}
		return winningRowList;
	}
	generateDiagonalDownList(width: number, height: number) {
		this.initializeBoardConfiguration(width, height);
		let winningDiagonalDownlList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			let h = (height > 1) ? height - 1 : 0
			for (let c = 0; c < width - h; c++) {
				let winningDiagonalDown = []
				for (let r = 0; r < height; r++) {
					let v = r * (Number(width) + 1) + c;
					winningDiagonalDown.push(v);
				}
				winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let h = (height > 1) ? width - 1 : 0
			for (let r = 0; r < height - h; r++) {
				let winningDiagonalDown = []
				for (let c = 0; c < width; c++) {
					let v = (r * Number(width)) + c * (Number(width) + 1)
					winningDiagonalDown.push(v);
				}
				winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let r = 0; r < 1; r++) {
				let winningDiagonalDown = []
				for (let c = 0; c < width; c++) {
					let v = (r * Number(width)) + c * (Number(width) + 1)
					winningDiagonalDown.push(v);
				}
				winningDiagonalDownlList.push(winningDiagonalDown);
			}
		}
		return winningDiagonalDownlList;
	}
	generateDiagonalUpList(width: number, height: number) {
		let winningDiagonalUpList = []
		if (this.boardShape == BoardShape.SHAPE_LANDSCAPE) {
			for (let c = height - 1; c < width; c++) {
				let winningDiagonalUp = []
				for (let r = 0; r < height; r++) {
					let v = r * (width - 1) + c
					winningDiagonalUp.push(v);
				}
				winningDiagonalUpList.push(winningDiagonalUp);
			}
		}

		if (this.boardShape == BoardShape.SHAPE_PORTRAIT) {
			let h = (height > 1) ? width - 1 : 0
			for (let r = 0; r < height - h; r++) {
				let winningDiagonalUp = []
				for (let c = 0; c < width; c++) {
					let v = (r * width) + (width - 1) + c * (width - 1)
					winningDiagonalUp.push(v)
				}
				winningDiagonalUpList.push(winningDiagonalUp)
			}
		}

		if (this.boardShape == BoardShape.SHAPE_SQUARE) {
			for (let c = width - 1; c < width; c++) {
				let winningDiagonalUp = []
				for (let r = 0; r < height; r++) {
					let v = r * (width - 1) + c
					winningDiagonalUp.push(v);
				}
				winningDiagonalUpList.push(winningDiagonalUp);
			}
		}
		return winningDiagonalUpList
	}
	initializeBoardConfiguration(width: number, height: number) {
		this.width = width
		this.height = height
		if (width == height) {
			this.boardShape = BoardShape.SHAPE_SQUARE
		} else if (width < height) {
			this.boardShape = BoardShape.SHAPE_PORTRAIT
		} else {
			this.boardShape = BoardShape.SHAPE_LANDSCAPE
		}
	}
}