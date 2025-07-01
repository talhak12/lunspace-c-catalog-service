import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import createHttpError from 'http-errors';

export const canAccess = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;

    const roleFromToken = _req.auth.role;
    console.log(roleFromToken);
    if (!roles.includes(roleFromToken)) {
      const error = createHttpError(403, 'you dont have enough permission');
      next(error);
      return error;
    }
    console.log(roleFromToken);
    /*if (roles == roleFromToken) {
      const error = createHttpError(403, 'you dont have enough permission');
      next(error);
    }*/
    next();
  };
};
