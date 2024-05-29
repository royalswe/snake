import type { Cell, GameState } from './models/gameState';
import type { UrlParams } from './models/urlParams';
import type Client from './client';
import { PLAYER_STATUS, GAME_STATUS } from "./constants/status";
import { COUNT_DOWN } from './constants/constants';
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
  gameInterval(callback: Function, interval = 500) {
    let counter = 1;
    let timeoutId: NodeJS.Timeout;
    const startTime = performance.now();

    function main() {
      const nextTime = startTime + counter * interval;
      timeoutId = setTimeout(main, interval - (performance.now() - nextTime));

      counter++;
      callback();
    }
    // // Run the callback immediately
    // callback();

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
    let lostPlayers = new Set(); // players that lost this round

    for (const client of this.playingClients) {
      const state = client.gameState;
      if (!state) {
        console.error('player do not have any state');
        continue;
      }
      if (client.status !== PLAYER_STATUS.ready) {
        continue; // player allready lost
      }

      // take the first element of direction queue if it exist
      if (client.gameState.directionQueue.length) {
        state.vel = client.gameState.directionQueue.shift() || state.vel;
      }

      state.pos.y += state.vel.y;
      state.pos.x += state.vel.x;

      for (const c of this.playingClients) {
        if (this.isCollide(state.pos, c.gameState)) {
          lostPlayers.add(client.color);
          client.status = PLAYER_STATUS.joined;
        }
      }
      // snage grow
      state.snake.push({ ...state.pos });
    }

    // check collision again because it's possible to hit another snake head after growing
    if (lostPlayers.size) {
      for (const client of this.playingClients) {
        if (client.status !== PLAYER_STATUS.ready) {
          continue; // player allready lost
        }
        for (const opponent of this.playingClients) {
          if (opponent.id === client.id) continue; // allready checked if snake hits himself
          if (this.isCollide(client.gameState.pos, opponent.gameState)) {
            client.status = PLAYER_STATUS.joined;
            lostPlayers.add(client.color);
          }
        }
      }

      // check if Game is over
      const winner = this.playingClients.filter((c) => c.status === PLAYER_STATUS.ready);

      if (!winner || !winner.length) {
        this.resetPlayers();
        return this.playingClients.length > 1 ? `It's a draw between ${[...lostPlayers].join(' and ')}` : 'Game over';
      }
      else if (winner.length === 1) {
        this.resetPlayers();
        return 'The winner is ' + winner[0].color;
      }
    }
  }
  // H
  // I
  isCollide({ y, x }: Cell, stateB: GameState) {
    if (stateB.snake.some((o) => o.x === x && o.y === y)) {
      return true; // snake hits snake
    }

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
  // M
  // N
  // O
  // P
  // Q
  // R
  resetPlayers() {
    // reset every player status
    this.playingClients.forEach(client => {
      if (client.status === PLAYER_STATUS.ready) {
        client.status = PLAYER_STATUS.joined;
      }
    });
  }
  // S
}