import { Component, Injectable, OnInit, Input } from '@angular/core';
import { BoardShape, BoardDimension } from './../board/board.state';
import { WinningSetGenerator } from './winning-set-generator.service';

@Injectable()
export class Referee {
	smallSide:	number = 0;
	largeSide:	number = 0;

	winningRowList:				any[][] = []
	winningColumnList:			any[][] = []
	winningDiagonalDownlList:	any[][] = []
	winningDiagonalUpList:		any[][] = []

	width:		number = BoardDimension.DEFAULT_WIDTH;
	height:		number = BoardDimension.DEFAULT_HEIGHT;
	boardShape: string = BoardShape.SHAPE_SQUARE

	cells = Array(this.width * this.height).fill(null);
	cellsCoordinates = Array(this.width * this.height).fill(null);

	winningSetGenerator: WinningSetGenerator

	constructor(winningSetGenerator: WinningSetGenerator) {
		this.winningSetGenerator = winningSetGenerator
	}

	ngOnInit() {
		this.createAllWinningRow();
	}

	createAllWinningRow() {
		this.getWinningColumns();
		this.getWinningRows();
		this.getDiagonalDowns();
		this.getDiagonalUps();
	}
	updateBoardDimension(width: number, height: number) {
		this.createAllWinningRow();
		this.initializeBoardConfiguration(width, height)
	}
	getWinningColumns() {
		this.winningColumnList = this.winningSetGenerator
			.generateWinningColumnList(this.width, this.height)
	}
	getWinningRows() {
		this.winningRowList = this.winningSetGenerator
			.generateWinningRowList(this.width, this.height)
	}
	getDiagonalDowns() {
		this.winningDiagonalDownlList = this.winningSetGenerator
			.generateDiagonalDownList(this.width, this.height)
	
	}
	getDiagonalUps() {
		this.winningDiagonalUpList = this.winningSetGenerator
			.generateDiagonalUpList(this.width, this.height)
	}
	initializeBoardConfiguration(width: number, height: number) {
		this.width = width;
		this.height = height;
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