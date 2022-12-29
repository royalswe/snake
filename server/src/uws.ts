import uWebSockets from "uWebSockets.js";
import { getErrorMessage, reportError } from './helpers/errorHandling';
import { EVENT } from './constants/sharedConstants'
import { game, close } from "./games";
import { lobby } from "./lobby";

const port = 5300;

const uws = uWebSockets.SSLApp({
   key_file_name: process.env.NODE_ENV === "development" ? __dirname + "/misc/key.pem" : "/etc/letsencrypt/live/mongot.com/privkey.pem",
   cert_file_name: process.env.NODE_ENV === "development" ? __dirname + "/misc/certificate.pem" : "/etc/letsencrypt/live/mongot.com/cert.pem"
});

const open = (ws: any) => {
  //console.dir(ws, { depth: null }); 
  
  ws.send(
    JSON.stringify({ type: "init", message: "Welcome to the snake game!" })
  );
};

uws.ws("/api/*", {
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
      if (ws.url === "/api/room") {        
        return game(ws, arrayBuffer, isBinary);
      }
      else if (ws.url === "/api/lobby") {
        return lobby(ws, arrayBuffer, isBinary);
      }
    } catch (err: unknown) {
      reportError({ message: getErrorMessage(err) });
      return ws.send(JSON.stringify({ type: EVENT.error, msg: getErrorMessage(err) }), isBinary, true);
    }
  },
  close,
  }).get('/api/*', (res, req) => {
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
});

uws.listen(port, (token) => {
  token
    ? console.log(`Listening to uws ${port}`)
    : console.log(`Failed to listen uws port ${port}`);
});

export default uws;
