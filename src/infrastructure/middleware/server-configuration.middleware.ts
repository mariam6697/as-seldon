import { NextFunction, Request, Response } from 'express';
import { ENV } from '../config/env.config';
import CustomError from '../models/error.model';

export default class ServerConfigurations {
  public static handleErrorMiddleware(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof CustomError) {
      res.status(error.httpCode).json(error);
    } else {
      console.error('ERROR:', error);
      res.status(500).json({
        message: 'Fallo en el servidor',
        httpCode: 500,
        internalCode: 0,
        error: error.toString()
      });
    }
  }

  public static notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
      status: 'error',
      message: 'This route does not exist'
    });
  }

  public static baseEndpoint(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: 'ok',
      message: `Welcome to AS Seldon, the API for the AS Project`,
      version: ENV.apiVersion
    });
  }

  public static addHeaders(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  }
}
