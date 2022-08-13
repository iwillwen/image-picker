import { useCallback, useMemo } from "react";
import queryString from "query-string";

import { useBaiduPCS, PcsImage } from "./useBaiduPCS";
import { useRequest, useSessionStorageState } from "ahooks";

export type Selection = Pick<PcsImage, "filename" | "fsId">;

export function useShare() {
  const { accessToken } = useBaiduPCS();
  const [shareCache, setShareCache] =
    useSessionStorageState<Record<string, string>>("share_cache");

  const create = useCallback(
    async (path: string, imageList: PcsImage[]) => {
      if (!accessToken) return;

      if (shareCache?.[path])
        return {
          key: shareCache[path],
        };

      const res = await fetch(
        "/api/createShare?" +
          queryString.stringify({
            access_token: accessToken,
            path,
          }),
        {
          method: "POST",
          body: JSON.stringify(imageList),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!data?.key) {
        return {
          error: "创建分享失败",
        };
      }

      return {
        key: data.key,
      };
    },
    [accessToken, shareCache]
  );

  const load = async (key: string) => {
    const res = await fetch("/api/loadShare?key=" + key);
    const data = await res.json();

    return data.content;
  };

  const createSelectionRecord = async (key: string, selection: Selection[]) => {
    const res = await fetch("/api/makeSelection", {
      method: "POST",
      body: JSON.stringify({
        key,
        selection,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await res.json();
    if (!data?.key) {
      return {
        error: "创建选择结果失败",
      };
    }

    return {
      key: data.key,
    };
  };

  const loadSelectionRecord = async (key: string) => {
    const res = await fetch("/api/getSelection?key=" + key);
    const data = (await res.json()) as Selection[];

    return data;
  };

  const handleCreateShareSuccess = useCallback(
    (path: string, key: string) => {
      setShareCache({
        ...(shareCache || {}),
        [path]: key,
      });
    },
    [shareCache]
  );

  const {
    runAsync: createShare,
    data: createdShare,
    loading: createShareLoading,
  } = useRequest(create, {
    manual: true,
    cacheKey: "createShare",
    onSuccess: ({ key }, [path]) => {
      if (!key || !path) return;

      handleCreateShareSuccess(path, key);
    },
  });

  const {
    runAsync: loadShare,
    data: loadShareData,
    loading: shareLoading,
  } = useRequest(load, {
    manual: true,
  });
  const sharedImages = useMemo<PcsImage[]>(
    () => JSON.parse(loadShareData ?? "[]"),
    [loadShareData]
  );

  const { runAsync: makeSelection, loading: makeSelectionLoading } = useRequest(
    createSelectionRecord,
    {
      manual: true,
    }
  );

  const {
    runAsync: getSelection,
    data: selectionRecord,
    loading: getSelectionLoading,
  } = useRequest(loadSelectionRecord, {
    manual: true,
  });

  const generateShareUrl = (key: string) => {
    return window.location.origin + "/share/" + key;
  };

  return {
    createShare,
    createdShare,
    createShareLoading,

    loadShare,
    sharedImages,
    shareLoading,
    generateShareUrl,

    makeSelection,
    makeSelectionLoading,

    getSelection,
    selectionRecord,
    getSelectionLoading,
  };
}
