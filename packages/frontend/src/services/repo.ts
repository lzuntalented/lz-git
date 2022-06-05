import axios, { axiosNoMessage, REQUEST_URL } from '.';

const { REPO } = REQUEST_URL;

export async function getList(user: string) {
  const ret = await axios.get(REPO.LIST, { params: { user } }) as {
    user: string;
    name: string;
    describe: string;
    tagNum: number
    starNum: number
  }[];
  return ret;
}

export async function create(params: {
    user: string
    name: string
    readme: boolean
    describe: string
}) {
  const ret = await axios.post(REPO.CREATE, params);
  return ret;
}

export async function getBranch(user: string, repoName: string) {
  const ret = await axios.get(REPO.LIST_BRANCH, {
    params: { user, repoName },
  });
  return ret;
}

export async function getFilesWithPath(
  user: string,
  repoName: string,
  branch: string,
  path: string,
) {
  const ret = await axios.get(REPO.LIST_FILES, {
    params: {
      user, repoName, path, branch,
    },
  });
  return ret;
}

export async function getFileContent(
  user: string,
  repoName: string,
  branch: string,
  path: string,
) {
  const ret = await axios.get(REPO.READ_FILE, {
    params: {
      user, repoName, path, branch,
    },
  }) as string;
  return ret;
}

export async function seachRepo(
  keyword: string,
) {
  const ret = await axiosNoMessage.get(REPO.SEARCH, {
    params: {
      keyword,
    },
  }) as string[];
  return ret;
}

export async function removeRepo(
  name: string,
) {
  const ret = await axiosNoMessage.post(REPO.REMOVE, {
    name,
  }) as string[];
  return ret;
}

export async function getCommitContent(
  user: string,
  repoName: string,
  hash: string,
) {
  const ret = await axiosNoMessage.get(REPO.COMMIT, {
    params: { user, repoName, hash },
  }) as string[];
  return ret;
}

export async function star(
  user: string,
  repoName: string,
) {
  const ret = await axiosNoMessage.post(REPO.STAR, {
    repoName,
    user,
  }) as string[];
  return ret;
}

export async function unStar(
  user: string,
  repoName: string,
) {
  const ret = await axiosNoMessage.post(REPO.UNSTAR, {
    user,
    repoName,
  }) as {status: boolean; count: number};
  return ret;
}

export async function getStarStatus(
  user: string,
  repoName: string,
) {
  const ret = await axiosNoMessage.get(REPO.STAR_STATUS, {
    params: {
      user,
      repoName,
    },
  }) as {status: boolean; count: number};
  return ret;
}

export async function getStarList(
  user: string,
) {
  const ret = await axiosNoMessage.get(REPO.STAR_LIST, {
    params: {
      user,
    },
  }) as {
    list: {
      name: string;
      user: string;
      describe: string;
      tagNum: number
      starNum: number
    }[],
    total: number
  };
  return ret;
}
