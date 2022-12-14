import type { NextApiHandler } from "next";
import OSS from "ali-oss";
import { isString } from "lodash";

import {
  OSS_APP_APPKEY_ID,
  OSS_APP_APPKEY_SECRET,
  OSS_APP_REGION,
  OSS_BUCKET,
} from "../../constants";

const OssOption: OSS.Options = {
  region: OSS_APP_REGION,
  accessKeyId: OSS_APP_APPKEY_ID,
  accessKeySecret: OSS_APP_APPKEY_SECRET,
  bucket: OSS_BUCKET,
};

const handler: NextApiHandler = async (req, res) => {
  const { key } = req.query;

  if (!isString(key)) {
    res.status(400).json({
      error: "bad request",
    });
    return;
  }

  const name = key + "-selection";

  try {
    const client = new OSS(OssOption);
    const info = await client.head(name);
    if (!info) {
      res.status(200).json([]);
      return;
    }

    const ossReply = await client.get(name);
    if (!ossReply?.content) {
      res.status(404).json({
        error: "not found share " + key,
      });
      return;
    }

    const buffer = Buffer.from(ossReply.content);
    const data = JSON.parse(buffer.toString());

    res.status(200).json(data);
  } catch (err) {
    res.status(200).json([]);
  }
};

export default handler;
