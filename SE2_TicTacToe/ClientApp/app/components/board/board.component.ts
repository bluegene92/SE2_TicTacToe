import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardConfigurator } from './../boardmanager/boardconfigurator';
import { Referee } from './../referee/referee.class';
import { BoardShape, BoardDimension, Player } from './../board/boardstate';

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
		this.setBoardCellValue();
	}

	handleMove(position: number) {
		this.cells[position] = Player.X;				// to be change later
		//console.log(position)
		//console.log(this.cellsCoordinates[position]);	// contains (row, col) value

		/**
		 * notify the parent (BoardManager) of the position
		 * being selected.
		 */
		this.notifyCellSelectedPosition.emit(position);
	}

	setBoardCellValue() {
		this.cells = []
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				let v = this.getCellPosition(j, i);
				this.cellsCoordinates[v] = `r${i},c${j}`;
				this.cells[v] = v
			}
		}
	}

	resetBoard() {
		this.setBoardCellValue();
	}

	getCellPosition(xCoord: number, yCoord: number): number {
		return (yCoord * this.width) + xCoord;
	}

	getCoordinates(position: number): any {
		return this.cellsCoordinates[position];
	}
}