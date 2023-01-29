import uWebSockets from 'uWebSockets.js';
import { getErrorMessage, reportError } from './helpers/errorHandling';
import { createSetCookie, decrypt, encrypt, getCookie } from './helpers/cookieHandler';
import { EVENT } from './constants/sharedConstants';
import Game from './game';
import Lobby from './lobby';

const port = 5300;

const uws = uWebSockets.SSLApp({
  key_file_name:
    process.env.NODE_ENV === 'development'
      ? __dirname + '/misc/key.pem'
      : '/etc/letsencrypt/live/mongot.com/privkey.pem',
  cert_file_name:
    process.env.NODE_ENV === 'development'
      ? __dirname + '/misc/certificate.pem'
      : '/etc/letsencrypt/live/mongot.com/cert.pem',
});

const open = (ws: any) => {
  console.log(ws.user);

  if (ws.url === '/api/lobby') {
    Lobby.open(ws);
  } else if (ws.url === '/api/room') {
    Game.open(ws);
  }
};

const close = (ws: any, _code: any, _msg: any): void => {
  if (ws.url === '/api/lobby') {
    console.log('client left lobby');
  } else if (ws.url === '/api/room') {
    Game.close(ws);
  }
};

const sessionMiddleware = (next: any) => (res: any, req: any) => {
  const cookieExist = getCookie(req, 'session');
  if (cookieExist) {
    const decryptedCookie = decrypt(cookieExist);
    const user = JSON.parse(decryptedCookie);
    req.user = user.username;
  }
  next(res, req);
};

uws
  .ws('/*', {
    idleTimeout: 32,
    maxBackpressure: 1024,
    maxPayloadLength: 512,

    upgrade: (res, req, context) => {

      console.log(
        'An Http connection wants to become WebSocket, URL: ' + req.getUrl()
      );

      let username = 'guest-' + Math.random().toString(36).substring(2, 6);
      const cookieExist = getCookie(req, 'session');
      if (cookieExist) {
        const decryptedCookie = decrypt(cookieExist);
        const user = JSON.parse(decryptedCookie);
        username = user.username;
      }
      /* This immediately calls open handler, you must not use res after this call  */
      res.upgrade(
        {
          url: req.getUrl(),
          user: username
        },
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context
      );
    },

    open,
    message: (ws, arrayBuffer, isBinary) => {
      try {
        if (ws.url === '/api/room') {
          return Game.listen(ws, arrayBuffer, isBinary);
        } else if (ws.url === '/api/lobby') {
          return Lobby.listen(ws, arrayBuffer, isBinary);
        }
      } catch (err) {
        reportError({ message: getErrorMessage(err) });
        return ws.send(
          JSON.stringify({ type: EVENT.error, msg: getErrorMessage(err) }),
          isBinary,
          true
        );
      }
    },
    close,
  })
  .get('/*', res => res.writeStatus('404').end('404 not found'))
  .get('/api/user', sessionMiddleware((res: any, req: any) => {
    res.end(`account ${JSON.stringify(req.user) || 'guest'}`);
  }))
  // temporary login for testing middleware
  .get('/api/auth/:name', (res, req) => {
    const cookieValue = JSON.stringify({
      username: req.getParameter(0) || 'guest'
    });

    const newCookie = createSetCookie({
      name: 'session',
      domain: req.getHeader('hostname'),
      value: encrypt(cookieValue)
    });

    res.writeHeader(
      'Set-Cookie', newCookie
    );

    res
      .writeStatus('200 OK')
      .writeHeader('IsExample', 'Yes')
      .end('Have fun ' + req.getParameter(0));
  });

uws.listen(port, (token) => {
  token
    ? console.log(`Listening to uws ${port}`)
    : console.log(`Failed to listen uws port ${port}`);
});

export default uws;

/**
 * @param {string} [cookieString='']
 * @return {[string,string][]} String Tuple
 */
function getEntriesFromCookie(cookieString = '') {
  return cookieString.split(';').map((pair) => {
    const indexOfEquals = pair.indexOf('=');
    let name;
    let value;
    if (indexOfEquals === -1) {
      name = '';
      value = pair.trim();
    } else {
      name = pair.substr(0, indexOfEquals).trim();
      value = pair.substr(indexOfEquals + 1).trim();
    }
    const firstQuote = value.indexOf('"');
    const lastQuote = value.lastIndexOf('"');
    if (firstQuote !== -1 && lastQuote !== -1) {
      value = value.substring(firstQuote + 1, lastQuote);
    }
    return [name, value];
  });
}
