import { isString } from "lodash";
import type { NextApiHandler } from "next";
import fetch from "node-fetch";
import { extname } from "path";

import { API_BASE } from "../../constants";
import { formatApiUrl } from "../../utils";

export type PcsImage = {
  filename: string;
  fsId: string;
  path: string;
  thumb: string;
  thumbs: Record<string, string>;
};

type ListImagesOptions = {
  access_token: string | string[];
  parent_path: string | string[];
  order?: string | string[];
  desc?: string | string[];
  only_jpg?: string | string[];
  limit?: number;
  page?: number;
};

function isDoneAllLoaded(listCount: number, limit: number) {
  return listCount < limit - 1;
}

export async function listImages(opts: ListImagesOptions): Promise<PcsImage[]> {
  const { access_token, parent_path, order, desc, only_jpg } = opts;
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 1000;

  const resp = await fetch(
    formatApiUrl(API_BASE, "/rest/2.0/xpan/file", {
      method: "imagelist",
      recursion: 0,
      access_token,
      parent_path,
      order: order ?? "name",
      desc: desc ?? 0,
      web: 1,
      page,
      num: limit,
    })
  );
  const data = (await resp.json()) as any;

  const onlyJPG = isString(only_jpg) ? only_jpg === "1" : false;

  const originalList: unknown[] = data?.["info"] ?? [];

  const isDone = isDoneAllLoaded(originalList.length, limit);

  const imageList = (
    originalList.map(
      (row: any) =>
        ({
          filename: row["server_filename"],
          fsId: row["fs_id"],
          path: row["path"],
          thumb: row["thumbs"]?.["url3"].replace("c850_u580", "c1000_u1000"),
          thumbs: row["thumbs"],
        } as PcsImage)
    ) ?? []
  ).filter((row: PcsImage) => {
    if (onlyJPG) {
      return extname(row.filename).toLowerCase() === ".jpg";
    }

    return true;
  });

  return [
    ...imageList,
    ...(!isDone ? await listImages({ ...opts, page: page + 1 }) : []),
  ];
}

const handler: NextApiHandler = async (req, res) => {
  const { access_token, parent_path, order, desc, only_jpg } = req.query;
  try {
    const imageList = await listImages({
      access_token,
      parent_path,
      order,
      desc,
      only_jpg,
      limit: 1000,
    });

    res.status(200).json(imageList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
