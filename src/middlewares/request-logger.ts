import { Request, Response, NextFunction } from 'express';

// [Module 10] HTTP request logging middleware (method, URL, duration)
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  next();
};
