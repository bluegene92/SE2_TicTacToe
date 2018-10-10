import { Injectable, OnInit } from '@angular/core'

@Injectable()
export class BoardConfigurator {

	constructor() { }

	ngOnInit() {}

	changeBoardWidth(width: number): number[] {
		let widthArray = [];
		for (let i = 0; i < width; i++) { widthArray[i] = i; }
		return widthArray;
	}

	changeBoardHeight(height: number): number[] {
		let heightArray = [];
		for (let i = 0; i < height; i++) { heightArray[i] = i; }
		return heightArray
	}
}