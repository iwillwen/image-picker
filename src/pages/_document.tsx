import React from "react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { Container, Spacer, Row, Text } from "@nextui-org/react";
import { useResponsive } from "ahooks";
import { CssBaseline } from "@nextui-org/react";

function MyDocument() {
  const responsive = useResponsive();
  const padding = responsive?.sm ? "$0" : "$1";

  return (
    <Html lang="en">
      <Head>
        <title>快速选图小帮手 By @阿问</title>
        <link
          ref="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/carousel.css"
        />
        {CssBaseline.flush()}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no, minimal-ui"
        />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <body style={{ overflowX: "hidden" }}>
        <Container css={{ p: padding }}>
          <Spacer y={1} />
          <Row>
            <Text h2 css={{ marginLeft: "$10" }}>
              选图小帮手（百度云盘版）
            </Text>
          </Row>
          <Spacer y={1} />
          <Main />
        </Container>
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: React.Children.toArray([initialProps.styles]),
  };
};

export default MyDocument;
