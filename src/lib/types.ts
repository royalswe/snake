export interface GameState {
	color: string;
	pos: Cell;
	vel: Cell;
	snake: Cell[];
	food: Cell;
	gridSize: number;
}

export interface Cell {
	x: number;
	y: number;
}
