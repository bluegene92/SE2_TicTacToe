import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardConfigurator } from './../boardmanager/boardconfigurator';
import { Referee } from './../referee/referee.component';
import { BoardShape, BoardDimension } from './../board/board.state';
import { Player } from './../player/player.model';

@Component({
	selector: 'board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css'],
	providers: [BoardConfigurator, Referee]
})
export class BoardComponent {

	widthArray:			number[] = [];
	heightArray:		number[] = [];
	@Input() width:		number = BoardDimension.DEFAULT_WIDTH;
	@Input() height:	number = BoardDimension.DEFAULT_HEIGHT;
	@Output() notifyCellSelectedPosition: EventEmitter<number> =
						new EventEmitter<number>(); 


	boardShape = BoardShape.SHAPE_SQUARE;
	cells = Array(this.width * this.height).fill(null);
	cellsCoordinates = Array(this.width * this.height).fill(null);

	constructor() { }

	ngOnInit() {
		this.initializeBoard();
	}

	handleMove(position: number) {
		this.selectCell(position, Player.X);
		/**
		 * notify the parent (BoardManager) of the position
		 * being selected.
		 */
		this.notifyCellSelectedPosition.emit(position);
		this.getAvailableCells();
	}

	selectCell(position: number, player: string) {
		this.cells[position] = player	
	}

	getBoard() : string[] {
		return this.cells;
	}

	initializeBoard() {
		this.cells = []
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				let v = this.getCellPosition(j, i);
				this.cellsCoordinates[v] = `r${i},c${j}`;
				this.cells[v] = v.toString()
			}
		}
	}

	resetBoard() {
		this.initializeBoard();
	}

	getCellPosition(xCoord: number, yCoord: number): number {
		return (yCoord * this.width) + xCoord;
	}

	getCoordinates(position: number): any {
		return this.cellsCoordinates[position];
	}

	getAvailableCells() {
		let availableCells: string[] = [];
		for (let i = 0; i < this.cells.length; i++) {
			// if the cell is a number, then it is available
			if (!isNaN(Number(this.cells[i]))) {
				availableCells.push(this.cells[i]);
			}
		}
		return availableCells;
	}
}