import type { NextApiHandler } from "next";
import fetch from "node-fetch";

import { API_BASE } from "../../constants";
import { formatApiUrl } from "../../utils";

export type PcsImage = {
  filename: string;
  fsId: string;
  path: string;
  thumb: string;
  thumbs: Record<string, string>;
};

const handler: NextApiHandler<PcsImage[]> = async (req, res) => {
  const { access_token, parent_path, order, desc } = req.query;

  const resp = await fetch(
    formatApiUrl(API_BASE, "/rest/2.0/xpan/file", {
      method: "imagelist",
      recursion: 0,
      access_token,
      parent_path,
      order: order ?? "time",
      desc: desc ?? 1,
      web: 1,
    })
  );
  const data = (await resp.json()) as any;

  res.status(200).json(
    data?.["info"]?.map((row: any) => ({
      filename: row["server_filename"],
      fsId: row["fs_id"],
      path: row["path"],
      thumb: row["thumbs"]?.["url3"].replace("c850_u580", "c1000_u1000"),
      thumbs: row["thumbs"],
    })) ?? []
  );
};

export default handler;
