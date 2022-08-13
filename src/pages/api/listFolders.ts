import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

import { API_BASE } from "../../constants";
import { formatApiUrl, within } from "../../utils";

const handler: NextApiHandler = async (req, res) => {
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

  return data?.["list"]?.map((row: any) => row["path"] as string) ?? [];
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await within(() => handler(req, res), res, 7000);
};
