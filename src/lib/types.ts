export interface GameState {
	pos: Cell;
	vel: Cell;
	snake: Cell[];
	food: Cell;
	gridsize: number;
}

export interface Cell {
	x: number;
	y: number;
}
