import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useRequest, useSessionStorageState } from "ahooks";
import queryString from "query-string";
import { AUTH_URL, BAIDU_PCS_APPKEY } from "../constants";

const ACCESS_TOKEN_KEY = "baidu_pcs_token";

export type BaiduPcsOptions = {
  ensureLogin?: boolean;
  appKey?: string;
};

export type ListOptions = {
  order?: "name" | "time";
  desc?: boolean;
  onlyJpg?: boolean;
};

export type PcsImage = {
  filename: string;
  fsId: number;
  path: string;
  thumb: string;
  thumbs: Record<string, string>;
};

const DEFAULT_OPTIONS = {
  appKey: BAIDU_PCS_APPKEY,
};

export function useBaiduPCS(options: BaiduPcsOptions = {}) {
  options = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const router = useRouter();
  const [accessToken, setAccessToken] =
    useSessionStorageState<string>(ACCESS_TOKEN_KEY);
  const isLogined = useMemo(() => accessToken?.length > 0, [accessToken]);

  useEffect(() => {
    if (options.ensureLogin && !isLogined) {
      router.push("/login");
    }
  }, [options.ensureLogin, isLogined]);

  const getAuthUrl = (redirectUrl: string) => {
    return `${AUTH_URL}?response_type=token&client_id=${options.appKey}&redirect_uri=${redirectUrl}&scope=basic,netdisk`;
  };

  const {
    runAsync: listFolders,
    data: folders,
    refresh: refreshFolders,
    loading: listFoldersLoading,
  } = useRequest(
    async (dir: string, options: ListOptions = {}): Promise<string[]> => {
      const res = await fetch(
        "/api/listFolders?" +
          queryString.stringify({
            method: "list",
            access_token: accessToken,
            dir,
            folders: 1,
            order: options.order ?? "time",
            desc: options.desc ?? 1,
          })
      );
      return res.json();
    },
    {
      manual: true,
      refreshDeps: [accessToken],
    }
  );

  const {
    runAsync: listImages,
    data: images,
    refresh: refreshImages,
    loading: listImagesLoading,
  } = useRequest(
    async (dir: string, options: ListOptions = {}): Promise<PcsImage[]> => {
      const res = await fetch(
        "/api/listImages?" +
          queryString.stringify({
            method: "imagelist",
            access_token: accessToken,
            parent_path: dir,
            order: options.order ?? "time",
            desc: options.desc ?? 1,
            web: 1,
            only_jpg: 1,
          })
      );
      return await res.json();
    },
    {
      manual: true,
      refreshDeps: [accessToken],
    }
  );

  return {
    isLogined,
    accessToken,
    setAccessToken,

    getAuthUrl,

    folders,
    listFolders,
    refreshFolders,
    listFoldersLoading,

    listImages,
    images,
    refreshImages,
    listImagesLoading,
  };
}
