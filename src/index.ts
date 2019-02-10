import { Config } from './types/config.types';
import { init, mongoConnect, errorPropsBuilder, errorDetails } from './utils';
import { json } from 'body-parser';
import express from 'express';
import cors from 'cors';
import { authMiddleWare } from './auth';
import { sign } from 'jsonwebtoken';
import monitor from 'express-status-monitor';
import { Merror, MerrorMiddleware } from 'express-merror';

(async () => {
  // Load Config from file
  let cfg: Config;
  try {
    cfg = init();
  } catch (e) {
    console.error(e);
  }

  // Connect to DB
  try {
    await mongoConnect(cfg);
  } catch (e) {
    console.error(e);
  }

  // Start App
  const app = express();
  const port = cfg.server.port;

  // App configs
  app.disable('x-powered-by');
  app.use(json());
  app.use(cors());
  app.use(monitor());
  app.use(authMiddleWare(cfg.server.jwtKey).unless({ path: ['/login', '/err'] }));

  app.get('/login', (req, res) => {
    const token = sign(
      {
        sub: '5c52b973ad77c26cbfbea6a1',
        username: 'admin1',
        role: 'ADMIN',
      },
      cfg.server.jwtKey,
      {
        expiresIn: '300 days', // TODO: cfg.server.jwtDuration
      },
    );
    res.json({ token });
  });

  app.get('/auth', (req, res) => {
    res.json({ message: (req as any).user });
  });
  app.get('/err', (res, req, next) => {
    throw new Merror(500, 'Something Happened', errorPropsBuilder(null, errorDetails()));
  });

  app.use(MerrorMiddleware());
  app.listen(port, () => console.log(` 🚀  Server listening on http://localhost:${port}`));
})();
