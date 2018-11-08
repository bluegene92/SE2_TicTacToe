import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BoardComponent } from './../board/board.component';
import { BoardConfigurator } from './boardconfigurator';
import { Referee } from './../referee/referee.component';
import { BoardDimension, Result, Threshold } from './../board/board.state';
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

	private timerSubscription: Subscription = new Subscription()
	private width:		number = BoardDimension.DEFAULT_WIDTH;
	private height: number = BoardDimension.DEFAULT_HEIGHT;
	private totalCells: number = this.width * this.height;


	private player1:	string = Player.X;
	private player2:	string = Player.O;
	private winner:		string = Player.EMPTY;
	private currentPlayerTurn: string = Player.X;
	private isUserFirstPlayer: boolean = true;	

	private winningRows:					any[][] = []
	private winningColumns:					any[][] = []
	private winningDiagonalDowns:			any[][] = []
	private winningDiagonalUps:				any[][] = []
	private allWinningConditions:			any[][] = []

	private gameMode: string = GameMode.HUMAN_VS_AI;
	private isLimitedDepth: boolean = false

	private thresholdTime: number = Threshold.DEFAULT_TIME;
	private timeCountDown: number = 0;
	private statusBar: string = "Select [Start] to play"

	private boardConfigurator: BoardConfigurator
	private referee: Referee
	private alphabeta: AlphaBetaPruning

	constructor(boardConfigurator: BoardConfigurator,
		referee: Referee,
		alphabeta: AlphaBetaPruning) {
		this.boardConfigurator = boardConfigurator
		this.referee = referee
		this.alphabeta = alphabeta
	}

	ngOnInit() {
		this.initializeBoard()
	}

	initializeBoard() {
		for (let i = 0; i < this.width; i++) {  this.board.widthArray[i] = i; }
		for (let i = 0; i < this.height; i++) { this.board.heightArray[i] = i; }
		this.updateTotalCells()
		this.updateBoardDimension()
	}

	updateTotalCells() {
		this.totalCells = this.width * this.height;
	}

	updateBoardDimension() {
		this.board.width = this.width;
		this.board.height = this.height;
		this.winner = Player.EMPTY;
		this.referee.updateBoardDimension(this.width, this.height);
		this.referee.createAllWinningRow();
		this.getWinningConditions();
	}

	newGame() {
		this.board.resetBoard();
		this.updateBoardDimension();
		this.updateTotalCells();
		this.winner = Player.EMPTY;
		this.board.enableBoard = false;
		this.resetCountdownTimer();
	}

	startGame() {
		this.enableBoard();
		if (!this.isUserFirstPlayer) {
			this.aiMakeMove();
		}
		this.startCountdownTimer();
	}

	enableBoard() {
		this.board.enableBoard = true;
	}

	disableBoard() {
		this.board.enableBoard = false;
	}

	aiMakeMove() {
		let bestMovePosition = this.alphabeta
			.runAlgorithm(this.board, Player.O, this.allWinningConditions);

		this.selectCellAndUpdateWinningConditions(bestMovePosition, Player.O)
		this.resetCountdownTimer()

		if (!this.isWinner(Player.O) && !this.isGameDraw()) {
			this.startCountdownTimer()
		}
	}

	userMakeMove(position: number) {
		this.selectCellAndUpdateWinningConditions(position, Player.X);
		this.resetCountdownTimer()
	}


	/**
	 * This function runs everytime the user select a position.
	 * It retrieve data from the event emitter in BoardComponent.
	 *
	 * @param position
	 */
	onNotifySelectedCellPosition(position: number) {
		if (this.gameMode == GameMode.HUMAN_VS_AI) {
			this.userMakeMove(position);
			this.aiMakeMove()
		}

		if (this.gameMode == GameMode.AI_VS_AI) {


		}

	}

	selectCellAndUpdateWinningConditions(position: number, player: string) {

		this.board.selectCell(position, player);
		this.updateWinningConditions(position, player);

		if (this.isWinner(player)) {
			this.winner = player;
			this.resetCountdownTimer();
			this.disableBoard();
			this.statusBar = `${this.winner} win!!!`;
		}

		if (this.isGameDraw()) {
			this.winner = Result.DRAW;
			this.resetCountdownTimer();
			this.disableBoard()
			this.statusBar = `Game end in a ${Result.DRAW}`;
		}

	}

	isGameDraw(): boolean {
		return (this.board.isEmpty() &&
			!this.isWinner(Player.X) &&
			!this.isWinner(Player.O))
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

	updateWinningConditions(position: number, player: string) {
		for (let winSet of this.allWinningConditions) {
			for (let i = 0; i < winSet.length; i++) {
				if (winSet[i] == position) {
					winSet[i] = player;
				}
			}
		}
	}

	isWinner(player: string): boolean {
		let win = false
		for (let winSet of this.allWinningConditions) {
			let count = 0;
			if (!win) {
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == player) count++
					if (count == winSet.length) win = true
				}
			}
			else {
				break;
			}
		}
		return win ? true : false
	}

	startCountdownTimer() {
		this.timeCountDown = this.thresholdTime;
		let timeTicker = Observable.timer(0, 1000)
		this.timerSubscription = timeTicker
			.subscribe((tickCount: number) => this.updateTick(tickCount))
	}

	updateTick(tickCount: number) {
		let ticks = tickCount;
		if (this.timeCountDown > 0) {
			this.timeCountDown = this.thresholdTime - ticks;
		}

		if (this.isOutOfTime(this.timeCountDown)) {
			this.winner = (this.currentPlayerTurn == Player.X) ? Player.O : Player.X;
			this.resetCountdownTimer();
		}
	}

	isOutOfTime(time: number): boolean {
		return time <= 0;
	}

	resetCountdownTimer() {
		this.timeCountDown = this.thresholdTime;
		this.timerSubscription.unsubscribe();
	}

	toggleLimitDepth() {
		this.isLimitedDepth = (this.isLimitedDepth) ? false : true;
	}

	toggleFirstPlayer() {
		this.isUserFirstPlayer = (this.isUserFirstPlayer) ? false : true;
		this.currentPlayerTurn = (this.isUserFirstPlayer) ? Player.X : Player.O;
	}

	switchCurrentPlayer() {
		this.currentPlayerTurn = (this.currentPlayerTurn == Player.X) ? Player.O : Player.X;
	}
}