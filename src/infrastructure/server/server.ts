import express, { Application } from 'express';
import { connect, Mongoose } from 'mongoose';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import AdminRoutes from '../../admin/routes/index.routes';
import CoreRoutes from '../../core/routes/index.routes';
import AuthRoutes from '../../auth/routes/index.routes';
import { ENV } from '../config/env.config';
import { AuthenticationMiddleware } from '../middleware/authentication.middleware';
import ServerConfiguration from '../middleware/server-configuration.middleware';

import * as swaggerJson from '../../swagger.json';

export default class Server {
  public app: Application;
  public port: number;
  public mongoConnection: Mongoose;

  constructor(port: number, app: Application) {
    this.port = port;
    this.app = app;
  }

  static init(port: number, app: Application) {
    return new Server(port, app);
  }

  public static createServer(): Application {
    const app = express();
    Server.config(app);
    return app;
  }

  async connectMongoDb(): Promise<Mongoose> {
    try {
      const connection = await connect(ENV.mongoUrl, {
        dbName: 'as-seldon',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      console.log('🍃 MongoDB connected');
      return connection;
    } catch (error: any) {
      console.log(`⚠️ MongoDB connection error: ${error}`);
      throw error;
    }
  }

  public static config(app: Application): void {
    app.use(AuthenticationMiddleware.accessControl);
    app.use(ServerConfiguration.addHeaders);
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // Module routing
    const apiVersion: string = ENV.apiVersion;
    app.get('/', ServerConfiguration.baseEndpoint);
    app.get('/api', ServerConfiguration.baseEndpoint);
    app.get(`/api/${apiVersion}`, ServerConfiguration.baseEndpoint);

    app.use(`/api/${apiVersion}/core`, CoreRoutes);
    app.use(`/api/${apiVersion}/admin`, AdminRoutes);
    app.use(`/api/${apiVersion}/auth`, AuthRoutes);

    // Swagger setup
    app.use(`/api/${apiVersion}/static`, express.static('src/static'));
    app.use(
      `/api/${apiVersion}/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerJson, {
        customCssUrl: '../static/swagger.css',
        customSiteTitle: 'AS Seldon Docs'
      })
    );

    app.use(ServerConfiguration.handleErrorMiddleware);
    app.use(ServerConfiguration.notFound);
  }

  async start(callback: Function) {
    process.on('SIGINT', () => {
      this.closeServer();
    });
    Server.config(this.app);
    this.mongoConnection = await this.connectMongoDb();
    return this.app.listen(this.port, callback());
  }

  async closeServer(): Promise<void> {
    console.log('🔪 Closing server connections...');
    this.mongoConnection.connection.close();
  }
}
