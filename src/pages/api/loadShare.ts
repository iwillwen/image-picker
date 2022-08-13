import type { NextApiHandler } from "next";
import OSS from "ali-oss";

import {
  API_BASE,
  OSS_APP_APPKEY_ID,
  OSS_APP_APPKEY_SECRET,
  OSS_APP_REGION,
  OSS_BUCKET,
} from "../../constants";
import { isString } from "lodash";

const OssOption: OSS.Options = {
  region: OSS_APP_REGION,
  accessKeyId: OSS_APP_APPKEY_ID,
  accessKeySecret: OSS_APP_APPKEY_SECRET,
  bucket: OSS_BUCKET,
};

const handler: NextApiHandler = async (req, res) => {
  const client = new OSS(OssOption);
  const { key } = req.query;

  if (!isString(key)) return res.status(404).json({ message: "Not Found" });

  try {
    const ossReply = await client.get(key);

    res.status(200).json({
      content: JSON.parse(ossReply.content),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
