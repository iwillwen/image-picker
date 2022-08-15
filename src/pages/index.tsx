import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useBaiduPCS } from "../hooks/useBaiduPCS";

export default function Home() {
  const router = useRouter();
  const { accessToken } = useBaiduPCS();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    } else {
      router.push("/folder");
    }
  }, [accessToken]);

  return <div></div>;
}
