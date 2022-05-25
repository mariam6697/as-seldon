import axios from 'axios';
import { ENV } from '../config/env.config';

interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  git_url: string;
  ssh_url: string;
  description: string;
  url: string;
}

const authHeaders: any = {
  authorization: `Bearer ${ENV.gitHubAccessToken}`
};

export default class GitHubUtils {
  public static async createRepo(data: {
    name: string;
    description: string;
    autoInit: boolean;
    private: boolean;
  }): Promise<Repository> {
    const response = await axios.post(`${ENV.gitHubApiUrl}/orgs/${ENV.gitHubOrgName}/repos`, data, {
      headers: authHeaders
    });
    console.log('response', response);
    return {} as Repository;
  }
}
