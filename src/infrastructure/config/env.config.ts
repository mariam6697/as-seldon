import * as dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  port: process.env.PORT || '6060',
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  gitHubApiUrl: process.env.GITHUB_API_URL,
  gitHubOrgName: process.env.GITHUB_ORG_NAME,
  gitHubAccessToken: process.env.GITHUB_ACCESS_TOKEN
};
