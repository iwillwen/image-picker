import type { NextApiHandler } from "next";
import OSS from "ali-oss";
import { isArray, isEmpty } from "lodash";

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
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Method Not Allowed",
    });
    return;
  }

  try {
    const client = new OSS(OssOption);
    const { selection, key } = req.body;

    if (!key || !isArray(selection) || isEmpty(selection)) {
      res.status(400).json({
        error: "bad request",
      });
      return;
    }

    const share = await client.get(key);
    if (!share?.content) {
      res.status(404).json({
        error: "not found share " + key,
      });
      return;
    }

    const objectKey = `${key}-selection`;

    const ossReply = await client.put(
      objectKey,
      Buffer.from(JSON.stringify(selection))
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
