import type { NextApiHandler } from "next";
import fetch from "node-fetch";

import { API_BASE } from "../../constants";
import { formatApiUrl } from "../../utils";

const handler: NextApiHandler<string[]> = async (req, res) => {
  const { access_token, dir, order, desc } = req.query;

  const url = formatApiUrl(API_BASE, "/rest/2.0/xpan/file", {
    method: "list",
    access_token,
    dir,
    folder: 1,
    order: order ?? "time",
    desc: desc ?? 1,
  });

  const resp = await fetch(url);
  const data = (await resp.json()) as any;

  res
    .status(200)
    .json(data?.["list"]?.map((row: any) => row["path"] as string) ?? []);
};

export default handler;
