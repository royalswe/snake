import type { Cell, GameState } from './models/gameState';
import type { UrlParams } from './models/urlParams';
import type Client from './client';
import { PLAYER_STATUS, COUNT_DOWN, GAME_STATUS } from "./constants/sharedConstants";
import { isEveryPlayerReady } from "./helpers/utils";

export default class Session {
  room!: string;
  width!: number;
  height!: number;
  playingClients!: Client[];
  clients: Set<Client>;
  status: string;
  timer: any;

  constructor(params: UrlParams) {
    Object.assign(this, params);
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
        if (!isEveryPlayerReady(this.clients)) {
          return reject;
        }

        this.status = GAME_STATUS.running;
        resolve(this.status);
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
    for (const client of this.playingClients) {
      const state = client.gameState;
      if (!state) {
        console.error('player do not have any state');
        continue;
      }
      if (client.status !== PLAYER_STATUS.ready) {
        continue; // player lost
      }

      // take the first element of direction queue if it exist
      if (client.gameState.directionQueue.length) {
        state.vel = client.gameState.directionQueue.shift() || state.vel;
      }

      state.pos.y += state.vel.y;
      state.pos.x += state.vel.x;

      for (const c of this.playingClients) {
        if (this.isCollide({ y: state.pos.y, x: state.pos.x }, c.gameState)) {
          client.status = PLAYER_STATUS.joined;
          const winner = this.playingClients.filter((v) => v.status === PLAYER_STATUS.ready);
          if (winner.length <= 1) {
            // reset every player status
            this.playingClients.forEach(client => {
              if (client.status === PLAYER_STATUS.ready) {
                client.status = PLAYER_STATUS.joined;
              }
            });

            return winner.length ? 'The winner is ' + winner[0].color : 'Game Over';
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
  }
}