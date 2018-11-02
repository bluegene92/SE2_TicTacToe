import { Injectable, OnInit, Input } from '@angular/core';
import { BoardShape, BoardDimension } from './../board/board.state';
import { Player } from './../player/player.model';
import { BoardComponent } from './../board/board.component';

@Injectable()
export class AlphaBetaPruning {
	bestPosition: number = 0;
	winner = Player.EMPTY
	allWinningConditions: any[][] = []
	constructor() {}

	ngOnInit() {
	}

	runAlgorithm(board: BoardComponent, allWinningConditions: any[][]) {
		this.allWinningConditions = allWinningConditions
		this.findBestMove(board, Player.O, 0)
		return this.bestPosition;
	}

	findBestMove(board: BoardComponent, player: string, depth: number) {
		this.alphaBetaPruning(board, player, depth, Number.MIN_VALUE, Number.MAX_VALUE);
	}

	alphaBetaPruning(board: BoardComponent,
					player: string,
					depth: number,
					alpha: number,
					beta: number) {


		let availableCells = board.getAvailableCells();

		if (this.checkWinner(Player.X)) { return 10; }
		else if (this.checkWinner(Player.O)) { return -10; }
		else if (board.isEmpty()) {	return 0; }

		if (player == Player.X) {
			for (let i = 0; i < availableCells.length; i++) {
				let availablePosition = availableCells[i];

				//select a cell and update winning list
				board.selectCell(Number(availablePosition), Player.X)

				// holds the list of indexes for undo later
				let undoList: number[][] = []

				for (let i = 0; i < this.allWinningConditions.length; i++) {
					let winSet = this.allWinningConditions[i]
					for (let j = 0; j < winSet.length; j++) {
						if (winSet[j] == Number(availablePosition)) {
							winSet[j] = Player.X
							let coord = [i, j]
							undoList.push(coord)
						}
					}
				}

				let score: any = this.alphaBetaPruning(board, Player.O, depth+1, alpha, beta)

				//undo move
				//board[Number(availablePosition)] = availablePosition
				board.undoCell(Number(availablePosition), availablePosition)
				for (let i = 0; i < undoList.length; i++) {
					let u = undoList[i]
					let yC = u[0]
					let xC = u[1]
					this.allWinningConditions[yC][xC] = availablePosition
				}


				if (score > alpha) {
					alpha = score
					if (depth == 0)
						this.bestPosition = Number(availablePosition)
				}

				if (beta <= alpha) {
					return alpha;
				}

			} // end for
			return alpha
		} else {  // Player.O
			for (let i = 0; i < availableCells.length; i++) {
				let availablePosition = availableCells[i];
				//board[Number(availablePosition)] = Player.O;
				board.selectCell(Number(availablePosition), Player.O)

				// holds the list of indexes for undo later
				let undoList: number[][] = []

				for (let i = 0; i < this.allWinningConditions.length; i++) {
					let winSet = this.allWinningConditions[i]
					for (let j = 0; j < winSet.length; j++) {
						if (winSet[j] == Number(availablePosition)) {
							winSet[j] = Player.O
							let coord = [i, j]
							undoList.push(coord)
						}
					}
				}
				let score: any = this.alphaBetaPruning(board, Player.X, depth + 1, alpha, beta)

				//undo move
				//board[Number(availablePosition)] = availablePosition
				board.undoCell(Number(availablePosition), availablePosition)
				for (let i = 0; i < undoList.length; i++) {
					let u = undoList[i]
					let yC = u[0]
					let xC = u[1]
					this.allWinningConditions[yC][xC] = availablePosition
				}

				if (score < beta) {
					beta = score
					if (depth == 0)
						this.bestPosition = Number(availablePosition)
				} else if (beta <= alpha) {
					return beta;
				}
			} // end for
			return beta
		}
	}

	checkWinner(player: string): boolean {
		let win = false
		for (let winSet of this.allWinningConditions) {
			let playerCount = 0;
			/**
			 * If there's no win yet, continue to check the list.
			 */
			if (!win) {
				for (let i = 0; i < winSet.length; i++) {
					if (winSet[i] == player) playerCount++
					if (playerCount == winSet.length) win = true
				}
			} else {
				break;
			}
		}
		return win
	}
}