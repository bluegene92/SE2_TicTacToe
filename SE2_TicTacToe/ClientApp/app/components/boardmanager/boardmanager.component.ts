﻿import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardComponent } from './../board/board.component';
import { BoardConfigurator } from './boardconfigurator';
import { Referee } from './../referee/referee.component';
import { BoardDimension, RESULT } from './../board/board.state';
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
export class BoardManagerComponent implements OnInit {
	@ViewChild(BoardComponent) board: any;

	width:		number = BoardDimension.DEFAULT_WIDTH;
	height: number = BoardDimension.DEFAULT_HEIGHT;
	timer: number = 20;
	totalCells: number = this.width * this.height;

	player1:	string = Player.X;
	player2:	string = Player.O;
	winner:		string = Player.EMPTY;
	playerTurn: string = Player.X;
	firstPlayer: boolean = true;	

	winningRows:					any[][] = []
	winningColumns:					any[][] = []
	winningDiagonalDowns:			any[][] = []
	winningDiagonalUps:				any[][] = []
	allWinningConditions:			any[][] = []

	gameMode: string = GameMode.HUMAN_VS_AI;
	limitDepth: boolean = false

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
		this.updateTotalCells();
		this.winner = Player.EMPTY;
		this.board.enableBoard = false;
	}

	startGame() {
		this.board.enableBoard = true;
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
	 * It retrieve data from the event emitter
	 *
	 * @param position
	 */
	onNotifySelectedCellPosition(position: number) {
		if (this.gameMode == GameMode.HUMAN_VS_AI) {
			this.selectCellAndUpdateWinningConditions(position, Player.X)
			
			let bestMovePosition = this.alphabeta
				.runAlgorithm(this.board, this.allWinningConditions);



			// delay 3 secs
			//setInterval(() => { this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O) }, 3000)


			this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
		}

		if (this.gameMode == GameMode.AI_VS_AI) {


		}

	}

	selectCellAndUpdateWinningConditions(position: number, player: string) {
		this.board.selectCell(position, player);
		this.updateWinningConditions(position, player);
		if (this.checkWinner(player)) {
			this.winner = player;
		}
		if (this.board.isEmpty() &&
			!this.checkWinner(Player.X) &&
			!this.checkWinner(Player.O)) {
			this.winner = RESULT.DRAW
		}
	}

	updateWinningConditions(position: number, player: string) {
		for (let winSet of this.allWinningConditions) {
			for (let i = 0; i < winSet.length; i++) {
				if (winSet[i] == position) {
					winSet[i] = player;
				}
			}
		}
	}

	checkWinner(player: string) {
		let win = false
		for (let winSet of this.allWinningConditions) {
			let count = 0;
			if (!win)
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == player) count++
					if (count == winSet.length) win = true
			} else {
				break;
			}
		}
		return win ? true : false
	}

	toggleLimitDepth() {
		this.limitDepth = (this.limitDepth) ? false: true
	}

	toggleFirstPlayer() {
		this.firstPlayer = (this.firstPlayer) ? false : true
		this.playerTurn = (this.firstPlayer) ? Player.X : Player.O
	}
}