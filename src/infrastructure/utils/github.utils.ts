import { ENV } from '../config/env.config';
import { Octokit } from '@octokit/rest';
import {
  RemoteBlob,
  RemoteCommit,
  RemoteRef,
  RemoteRepo,
  RemoteTree
} from '../../core/models/remote.model';

const octo = new Octokit({
  auth: ENV.gitHubAccessToken
});

const organization: string = ENV.gitHubOrgName;

export default class GitHubUtils {
  public static async createRepo(data: {
    name: string;
    description: string;
    autoInit: boolean;
    private: boolean;
  }): Promise<RemoteRepo> {
    const response: any = await octo.repos.createInOrg({
      org: organization,
      name: data.name,
      description: data.description,
      auto_init: data.autoInit,
      private: data.private
    });
    const repo: RemoteRepo = response.data;
    return repo;
  }

  public static async getRepos(): Promise<RemoteRepo[]> {
    const response: any = await octo.repos.listForOrg({ org: organization });
    const repo: RemoteRepo[] = response.data;
    return repo;
  }

  public static async createBlob(data: { name: string; base64: string }): Promise<RemoteBlob> {
    const res: any = await octo.git.createBlob({
      owner: organization,
      repo: data.name,
      content: data.base64,
      encoding: 'base64'
    });
    return res.data;
  }

  public static async createTree(data: { name: string; tree: any }): Promise<RemoteTree> {
    const response: any = await octo.git.createTree({
      owner: organization,
      repo: data.name,
      tree: data.tree
    });
    return response.data;
  }

  public static async createCommit(data: {
    name: string;
    message: string;
    treeSha: string;
    parentSha: string;
  }): Promise<RemoteCommit> {
    const response: any = await octo.git.createCommit({
      owner: organization,
      repo: data.name,
      message: data.message,
      tree: data.treeSha,
      parents: [data.parentSha]
    });
    return response.data;
  }

  public static async getLastCommit(data: { name: string; branch: string }): Promise<RemoteCommit> {
    const response: any = await octo.repos.listCommits({
      owner: organization,
      repo: data.name,
      sha: data.branch,
      per_page: 1
    });
    const lastCommit: RemoteCommit = response.data[0];
    return lastCommit;
  }

  public static async updateReference(data: {
    name: string;
    sha: string;
    branch: string;
  }): Promise<RemoteRef> {
    const response: any = await octo.git.updateRef({
      owner: organization,
      repo: data.name,
      sha: data.sha,
      ref: `heads/${data.branch}`,
      force: true
    });
    return response.data;
  }

  public static async deleteRepo(data: { name: string }): Promise<void> {
    await octo.request(`DELETE /repos/${organization}/${data.name}`, {
      owner: organization,
      repo: data.name
    });
  }
}
