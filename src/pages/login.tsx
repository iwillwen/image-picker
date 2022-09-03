import React, { useEffect } from "react";
import { Modal, Button, Text, Row, useModal } from "@nextui-org/react";
import { Login } from "react-iconly";
import { isString, isEmpty } from "lodash";
import { useRouter } from "next/router";
import queryString from "query-string";

import { useBaiduPCS } from "../hooks/useBaiduPCS";

export default function LoginBaiduPCS() {
  const router = useRouter();
  const { getAuthUrl, setAccessToken } = useBaiduPCS();
  const { setVisible, bindings } = useModal(true);

  const parseCallbackUrl = (url: string) => {
    const urlObj = new URL(url);
    const parsedQuery = queryString.parse(urlObj.hash);
    const accessToken = parsedQuery["access_token"];
    if (isString(accessToken) && !isEmpty(accessToken)) {
      setAccessToken(accessToken);
      setVisible(false);
      router.push("/folder");
    }
  };

  // Event handlers
  const handleClickLogin = () => {
    const authUrl = getAuthUrl(window.location.href);
    window.location.href = authUrl;
  };

  // Parsing access_token from login callback
  useEffect(() => {
    parseCallbackUrl(location.href);
  }, []);

  return (
    <Modal preventClose aria-labelledby="login-baidu-pcs" {...bindings}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          请先登陆百度网盘
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Button color="primary" icon={<Login />} onPress={handleClickLogin}>
          点击授权
        </Button>
      </Modal.Body>
    </Modal>
  );
}
