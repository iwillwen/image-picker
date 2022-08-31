import type { NextApiHandler } from "next";
import OSS from "ali-oss";
import { v4 as genUUID } from "uuid";

import {
  API_BASE,
  OSS_APP_APPKEY_ID,
  OSS_APP_APPKEY_SECRET,
  OSS_APP_REGION,
  OSS_BUCKET,
} from "../../constants";
import { formatApiUrl } from "../../utils";
import { prefetchImages } from "./createShareByListImages";

const OssOption: OSS.Options = {
  region: OSS_APP_REGION,
  accessKeyId: OSS_APP_APPKEY_ID,
  accessKeySecret: OSS_APP_APPKEY_SECRET,
  bucket: OSS_BUCKET,
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Method Not Allowed",
    });
    return;
  }

  try {
    const client = new OSS(OssOption);
    const { access_token } = req.query;
    const body = req.body;

    prefetchImages(Array.from(body) || []).then((sizes) =>
      console.log(`Size: ${sizes.reduce((a, b) => a + b)}`)
    );

    const url = formatApiUrl(API_BASE, "/rest/2.0/xpan/nas", {
      method: "uinfo",
      access_token,
    });

    const resp = await fetch(url);
    const reply = (await resp.json()) as { uk?: number };

    if (!reply.uk) {
      res.status(401).json(reply);
      return;
    }

    const objectKey = `${reply.uk}-${genUUID()}`;

    const ossReply = await client.put(
      objectKey,
      Buffer.from(JSON.stringify(body))
    );
    res.status(200).json({
      ...ossReply,
      key: objectKey,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
