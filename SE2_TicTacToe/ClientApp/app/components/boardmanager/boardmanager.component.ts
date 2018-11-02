import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BoardComponent } from './../board/board.component';
import { BoardConfigurator } from './boardconfigurator';
import { Referee } from './../referee/referee.component';
import { BoardDimension } from './../board/board.state';
import { GameMode } from './../gamemanager/gamemode.state';
import { AlphaBetaPruning } from './../ai/alphabeta';
import { WinningSetGenerator } from './../referee/winning-set-generator.service';
import { Player } from './../player/player.model';

@Component({
	selector: 'board-manager',
	templateUrl: './boardmanager.component.html',
	styleUrls: ['./boardmanager.component.css'],
	providers: [BoardConfigurator, Referee, AlphaBetaPruning, WinningSetGenerator]
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

	winningRows:						any[][] = []
	winningColumns:					any[][] = []
	winningDiagonalDowns:			any[][] = []
	winningDiagonalUps:				any[][] = []
	allWinningConditions:			any[][] = []

	gameMode: string = GameMode.HUMAN_VS_AI;
	timer: number = 20;

	boardConfigurator: BoardConfigurator
	referee: Referee
	alphabeta: AlphaBetaPruning

	constructor(boardConfigurator: BoardConfigurator,
		referee: Referee,
		alphabeta: AlphaBetaPruning) {
		this.boardConfigurator = boardConfigurator
		this.referee = referee
		this.alphabeta = alphabeta
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
		this.board.initializeBoard()
	}

	onChangeBoardHeight(height: number) {
		this.updateTotalCells()
		this.updateBoardDimension()
		this.board.heightArray =
			this.boardConfigurator.changeBoardHeight(height)
		this.board.initializeBoard()
	}

	updateBoardDimension() {
		this.board.width = this.width;
		this.board.height = this.height;
		this.winner = Player.EMPTY;
		this.referee.updateBoardDimension(this.width, this.height);
		this.referee.createAllWinningRow();
		this.getWinningConditions();
	}

	getWinningConditions() {
		this.winningColumns = this.referee.winningColumnList
		this.winningRows = this.referee.winningRowList
		this.winningDiagonalDowns = this.referee.winningDiagonalDownlList
		this.winningDiagonalUps = this.referee.winningDiagonalUpList
		this.combineWinningConditions()
	}

	combineWinningConditions() {
		this.allWinningConditions = []
		this.allWinningConditions =
			this.winningRows
				.concat(this.winningColumns)
				.concat(this.winningDiagonalDowns)
				.concat(this.winningDiagonalUps)
	}


	/**
	 * This function runs everytime the user select a position.
	 * Determine the gamde mode (HVA or AVA), and perform the
	 * correct action.
	 *
	 * @param position
	 */
	onNotifySelectedCellPosition(position: number) {
		//console.log(`parent recieve position: ${position}`);
		//console.log(`need ${this.referee.smallSide} in a row to win`);


		if (this.gameMode == GameMode.HUMAN_VS_AI) {
			//console.log("HVA");
			this.board.cells[position] = Player.X;
			for (let winSet of this.allWinningConditions) {
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == position) {
						winSet[i] = Player.X;
					}
				} 
			}
			let bestMove = this.alphabeta.runAlgorithm(this.board.cells, this.allWinningConditions);
			this.board.cells[bestMove] = Player.O
			console.log(`bestMove=${bestMove}`);
			for (let winSet of this.allWinningConditions) {
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == bestMove) {
						winSet[i] = Player.O;
					}
				}
			}
		}



		if (this.gameMode == GameMode.AI_VS_AI) {
			//console.log("AVA");
		}
	}

	checkWinner(winSet: any[], player: string) {
		let win = true
		for (let i = 0; i < winSet.length; i++) {
			if (winSet[i] !== player) win = false
		}
		return win ? player : ""
	}
}