import React from "react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { Container, Spacer, Text, Grid } from "@nextui-org/react";
import { useResponsive } from "ahooks";
import { CssBaseline } from "@nextui-org/react";
import { Image2 } from "react-iconly";

function MyDocument() {
  const responsive = useResponsive();
  const padding = responsive?.xs ? "$0" : "$10";

  return (
    <Html lang="en">
      <Head>
        <link
          ref="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/carousel.css"
        />
        {CssBaseline.flush()}
      </Head>
      <body>
        <Container css={{ paddingBottom: padding }}>
          <Spacer y={1} />
          <Grid.Container
            direction="row"
            gap={1}
            css={{ alignContent: "center" }}
          >
            <Grid justify="center">
              <Image2 set="bold" size="large" />
            </Grid>
            <Grid>
              <Text h3 css={{ lineHeight: "32px", margin: "$0" }}>
                选图小帮手（百度云盘版）
              </Text>
            </Grid>
          </Grid.Container>
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
