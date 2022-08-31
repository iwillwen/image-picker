import type { AppProps } from "next/app";
import Head from "next/head";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>快速选图小帮手 By @阿问</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no, minimal-ui"
        />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
