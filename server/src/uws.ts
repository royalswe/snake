import uWebSockets from "uWebSockets.js";
import { getErrorMessage, reportError } from './helpers/errorHandling';
import { EVENT } from './constants/sharedConstants'
import { game, close } from "./games";
import { lobby } from "./lobby";

const uws = uWebSockets.App();
const port = process.env.PORT || 5300;

const open = (ws: any) => {
  console.log("A WebSocket connected with URL: " + ws.url);
  ws.send(
    JSON.stringify({ type: "init", message: "Welcome to the snake game!" })
  );
};

uws.ws("/*", {
  idleTimeout: 32,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  upgrade: (res, req, context) => {
    console.log(
      "An Http connection wants to become WebSocket, URL: " + req.getUrl() + "!"
    );

    /* This immediately calls open handler, you must not use res after this call  */
    // if url is /room, then upgrade to WebSocket
    res.upgrade(
      {
        url: req.getUrl(),
      },
      /* Spell these correctly */
      req.getHeader("sec-websocket-key"),
      req.getHeader("sec-websocket-protocol"),
      req.getHeader("sec-websocket-extensions"),
      context
    );
  },

  open,
  message: (ws, arrayBuffer, isBinary) => {
    try {
      if (ws.url === "/room") {
        return game(ws, arrayBuffer, isBinary);
      }
      else if (ws.url === "/lobby") {
        return lobby(ws, arrayBuffer, isBinary);
      }
    } catch (err: unknown) {
      reportError({ message: getErrorMessage(err) });
      return ws.send(JSON.stringify({ type: EVENT.error, msg: getErrorMessage(err) }), isBinary, true);
    }
  },
  close,
  }).get('/*', (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});

uws.listen(+port, (token) => {
  token
    ? console.log(`Listening to uws ${port}`)
    : console.log(`Failed to listen uws port ${port}`);
});

export default uws;
