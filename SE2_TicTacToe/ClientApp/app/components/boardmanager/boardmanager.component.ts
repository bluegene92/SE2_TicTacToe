import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BoardComponent } from './../board/board.component';
import { BoardConfigurator } from './boardconfigurator';
import { Referee } from './../referee/referee.class';
import { BoardDimension, Player } from './../board/boardstate';

@Component({
	selector: 'board-manager',
	templateUrl: './boardmanager.component.html',
	styleUrls: ['./boardmanager.component.css'],
	providers: [BoardConfigurator, Referee]
})
export class BoardManagerComponent {
	@ViewChild(BoardComponent) board: any;

	width:		number = BoardDimension.DEFAULT_WIDTH;
	height:		number = BoardDimension.DEFAULT_HEIGHT;
	totalCells: number = this.width * this.height;

	player1:	string = Player.X;
	player2:	string = Player.O;
	winner:		string = Player.EMPTY;
	playerTurn: string = Player.X;		// to be change later

	winningRowList:						number[][] = []
	winningColumnList:					number[][] = []
	winningDiagonalDownList:			number[][] = []
	winningDiagonalUpList:				number[][] = []
	allWinningConditionList:			number[][] = []
	allOpponentWinningConditionList:	number[][] = []

	boardConfigurator: BoardConfigurator
	referee: Referee

	constructor(boardConfigurator: BoardConfigurator,
		referee: Referee) {
		this.boardConfigurator = boardConfigurator
		this.referee = referee
	}

	ngOnInit() {
		this.initializeBoard()
		this.updateTotalCells()
		this.updateBoardDimension()
	}

	initializeBoard() {
		for (let i = 0; i < this.width; i++) {  this.board.widthArray[i] = i; }
		for (let i = 0; i < this.height; i++) { this.board.heightArray[i] = i;}
	}

	newGame() {
		this.board.resetBoard();
		this.updateBoardDimension();
		this.winner = Player.EMPTY;
	}

	updateTotalCells() {
		this.totalCells = this.width * this.height;
	}

	onChangeBoardWidth(width: number) {
		this.updateTotalCells()
		this.updateBoardDimension()
		this.board.widthArray =
			this.boardConfigurator.changeBoardWidth(width)
		this.board.setBoardCellValue()
	}

	onChangeBoardHeight(height: number) {
		this.updateTotalCells()
		this.updateBoardDimension()
		this.board.heightArray =
			this.boardConfigurator.changeBoardHeight(height)
		this.board.setBoardCellValue()
	}

	updateBoardDimension() {
		this.board.width = this.width;
		this.board.height = this.height;
		this.winner = Player.EMPTY;
		this.referee.updateBoardDimension(this.width, this.height);
		this.referee.generateWinningConditionList();
		this.getWinningConditionList();
	}

	getWinningConditionList() {
		this.winningColumnList = this.referee.winningColumnList
		this.winningRowList = this.referee.winningRowList
		this.winningDiagonalDownList = this.referee.winningDiagonalDownlList
		this.winningDiagonalUpList = this.referee.winningDiagonalUpList
		this.combineWinningConditionList()
	}

	combineWinningConditionList() {
		this.allWinningConditionList = []
		this.allWinningConditionList =
			this.winningRowList
				.concat(this.winningColumnList)
				.concat(this.winningDiagonalDownList)
				.concat(this.winningDiagonalUpList)
	}

	onNotifySelectedCellPosition(position: number) {
		//console.log(`parent recieve position: ${position}`);
		//console.log(`need ${this.referee.smallSide} in a row to win`);
		for (let winSet of this.allWinningConditionList) {
			for (let i = 0; i < this.referee.smallSide; i++) {
				if (winSet[i] == position) {
					const index: number = winSet.indexOf(position);
					if (index !== -1) { winSet.splice(index, 1); }
					if (this.winSetIsEmpty(winSet)) {
						this.setWinner();
					}
				}
			}
		}
	}

	winSetIsEmpty(winSet: number[]): boolean {
		return (winSet == undefined || winSet.length == 0) ? true : false;
	}

	setWinner() {
		this.winner = this.playerTurn;
	}
}