import unless from 'express-unless';
import { verify } from 'jsonwebtoken';
import { Merror } from 'express-merror';
import { errorPropsBuilder, errorDetails } from '../utils';

export function authMiddleWare(secret: string) {
  const jwtFn = function(req, res, next) {
    let token;
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return next(new Merror(401, 'Format is Authorization: Bearer [token]'));
        }
      } else {
        return next(new Merror(401, 'Format is Authorization: Bearer [token]'));
      }
    }

    let payload;

    if (!token && req.path !== '/login') {
      return next(new Merror(401, 'No authorization token was found'));
    } else {
      try {
        payload = verify(token, secret);
      } catch (e) {
        next(new Merror(500, 'could not verify token', errorPropsBuilder('jwt#verify', errorDetails())));
      }
      req.user = {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
        token: token,
      };
      next();
    }
  };

  jwtFn.unless = unless;

  return jwtFn;
}
