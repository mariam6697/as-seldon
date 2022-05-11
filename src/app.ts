import { ENV } from './infrastructure/config/env.config';
import Server from './infrastructure/server/server';

export const app = Server.createServer();
export const server = Server.init(parseInt(ENV.port), app);

server.start(() => {
  console.log('🚀 Server running at port ' + server.port);
});
