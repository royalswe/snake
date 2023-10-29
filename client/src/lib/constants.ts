interface PlayerColor {
	id: string;
	status: string;
}

interface PlayerColors {
	[key: string]: PlayerColor | null;
}

// key for Svelte context
export const BOARD = {
	boardWidth: 50,
	boardHeight: 50
};

export const PLAYER_COLORS: PlayerColors = {
	red: null,
	blue: null,
	green: null,
	yellow: null
} as const;