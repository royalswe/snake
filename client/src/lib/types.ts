export interface GameState {
	color: string;
	pos: Cell;
	vel: Cell;
	snake: Cell[];
	food: Cell;
	grid: Cell;
}

export interface Cell {
	x: number;
	y: number;
}
