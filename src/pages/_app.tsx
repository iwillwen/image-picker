import type { AppProps } from "next/app";
import { Container, Spacer, Row, Text } from "@nextui-org/react";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container xl>
      <Spacer y={1} />
      <Row>
        <Text h2>选图小帮手（百度云盘版）</Text>
      </Row>
      <Spacer y={1} />
      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;
