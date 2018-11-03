import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CountdownModule } from 'ngx-countdown';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { CellComponent } from './components/cell/cell.component';
import { BoardComponent } from './components/board/board.component';
import { BoardManagerComponent } from './components/boardmanager/boardmanager.component';

import { BoardConfigurator } from './components/boardmanager/boardconfigurator';

@NgModule({
	declarations: [
		AppComponent,
		NavMenuComponent,
		HomeComponent,
		CellComponent,
		BoardComponent,
		BoardManagerComponent
	],
	imports: [
		CommonModule,
		HttpModule,
		FormsModule,
		CountdownModule,
		RouterModule.forRoot([
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
			{ path: 'home', component: HomeComponent },
			{ path: '**', redirectTo: 'home' }
		])
	],
	providers: [
		BoardConfigurator
	]
})
export class AppModuleShared {
}
