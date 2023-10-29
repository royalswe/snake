import type { GameState } from './models/gameState';
import type Session from './session';
import { COLOR, VELOCITY } from "./constants/constants";
import { PLAYER_STATUS } from './constants/status';
import { startPosition } from './helpers/utils';

export default class Client {
  id: string;
  color!: string;
  session!: Session;
  status: string;
  gameState!: GameState;

  constructor(id: string) {
    this.id = id;
    this.status = PLAYER_STATUS.spectating;
  }

  setGamestate() {
    const width = this.session.width;
    const height = this.session.height;

    this.gameState = {
      color: this.color,
      pos: startPosition(width, height, this.color),
      vel: VELOCITY[Object.keys(VELOCITY)[COLOR[this.color]]],
      directionQueue: [],
      snake: [],
      grid: { x: width, y: height },
    };
  }

}