import File from './file.model';

export interface RemoteRepo {
  id: number;
  name: string;
  html_url: string;
}

export interface RemoteFile {
  path: string;
  fileData: File;
}

export interface RemoteBlob {
  sha: string;
  url: string;
}

export interface RemoteTree {
  path: string;
  mode: string;
  sha: string;
  url: string;
  tree: RemoteTree;
}

export interface RemoteUser {
  name: string;
  email: string;
  date: Date;
}

export interface RemoteCommit {
  sha: string;
  url: string;
  tree: RemoteTree;
  author: RemoteUser;
  committer: RemoteUser;
  message: string;
}

export interface RemoteRef {
  ref: string;
  url: string;
}
