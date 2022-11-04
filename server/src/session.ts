import type { Cell, GameState } from './models/gameState';
import type { UrlParams } from './models/urlParams';
import type Client from './client';
import { PLAYER_STATUS, COUNT_DOWN, GAME_STATUS } from "./constants/sharedConstants";
import { isEveryStatusSame } from "./helpers/utils";

export default class Session {
  room!: string;
  width!: number;
  height!: number;
  clients: Set<Client>;
  status: string;
  timer: any;

  constructor(params: UrlParams) {
    Object.assign(this, params)
    this.clients = new Set();
    this.status = "waiting";
    this.timer = null;
  }
  // A
  // B
  // C
  countDown(duration = COUNT_DOWN) {
    clearTimeout(this.timer);
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        if (!isEveryStatusSame(this.clients, PLAYER_STATUS.ready)) {
          return reject;
        }

        this.status = GAME_STATUS.running;
        resolve({
          type: "game-status",
          msg: GAME_STATUS.running,
        });
      }, duration);
    });
  }
  gameIntervall(callback: Function, interval = 500) {
    let counter = 1;
    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();

    function main() {
      const nowTime = Date.now();
      const nextTime = startTime + counter * interval;
      timeoutId = setTimeout(main, interval - (nowTime - nextTime));

      counter += 1;
      callback();
    }

    timeoutId = setTimeout(main, interval);

    return () => {
      clearTimeout(timeoutId);
    };
  }
  // D
  // E
  // F
  // G
  snakeGrow() {
    //this.clients.forEach((client) => {
    //((const client = this.clients.keys().next().value;
    for (const client of this.clients) {
      const state = client.gameState;
      if (client.status !== PLAYER_STATUS.ready || !state) {
        return;
      }

      state.pos.y += state.vel.y;
      state.pos.x += state.vel.x;

      for (const c of this.clients) {
        if (this.isCollide({ y: state.pos.y, x: state.pos.x }, c.gameState)) {
          client.status = PLAYER_STATUS.joined;
          //console.log(this.clients);
          const winner = [...this.clients].filter((v) => v.status === PLAYER_STATUS.ready);
          if (winner.length <= 1) {
            console.log("winner is", winner);
            this.status = GAME_STATUS.waiting;

            return winner.length ? winner : client;
          }
        }
      }

      // snage grow
      state.snake.push({ ...state.pos });
    }
  }
  // H
  // I
  isCollide({ y, x }: Cell, stateB: GameState) {
    // console.log(id, idB, x, stateB.pos.x, y, stateB.pos.y);
    // if (id !== idB && x === stateB.pos.x && y === stateB.pos.y) {
    // 	console.log('hits head');
    // 	return true; // head hits head
    // }

    if (stateB.snake.some((o) => o.x === x && o.y === y)) {
      return true; // snake hits snake
    }
    //console.log('väggen', this.width, this.height);

    // snake hits wall
    return x >= this.width || y >= this.height || x < 0 || y < 0;
  }
  // J
  join(client: Client) {
    for (const c of this.clients) {
      if (c.id === client.id) {
        return false; // client exist already
      }
    }
    this.clients.add(client);
    client.session = this; // easy to acces session from client
  }
  // K
  // L
  leave(client: Client) {
    if (client.session !== this) {
      throw new Error("client do not exist in session");
    }
    this.clients.delete(client);
    console.log("client delete", client);
  }
}