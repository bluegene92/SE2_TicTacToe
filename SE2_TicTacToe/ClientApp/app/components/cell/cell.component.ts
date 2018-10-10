import { Component, Input } from '@angular/core';

@Component({
	selector: 'cell',
	templateUrl: './cell.component.html',
	styleUrls: ['./cell.component.css']

})
export class CellComponent {
	@Input() state: string = '';
	@Input() coordinate: string = '';
}