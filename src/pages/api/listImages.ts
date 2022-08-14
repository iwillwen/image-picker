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

const handler: NextApiHandler = async (req, res) => {
  const { access_token, parent_path, order, desc, only_jpg } = req.query;
  try {
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

    const onlyJPG = isString(only_jpg) ? only_jpg === "1" : false;

    res.status(200).json(
      (
        data?.["info"]?.map(
          (row: any) =>
            ({
              filename: row["server_filename"],
              fsId: row["fs_id"],
              path: row["path"],
              thumb: row["thumbs"]?.["url3"].replace(
                "c850_u580",
                "c1000_u1000"
              ),
              thumbs: row["thumbs"],
            } as PcsImage)
        ) ?? []
      ).filter((row: PcsImage) => {
        if (onlyJPG) {
          return extname(row.filename).toLowerCase() === ".jpg";
        }

        return true;
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
