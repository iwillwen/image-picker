import React from "react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { Container, Spacer, Grid, Button } from "@nextui-org/react";
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
            css={{
              "@xsMax": {
                justifyContent: "center",
              },
              "@sm": {
                justifyContent: "flex-start",
              },
            }}
          >
            <Grid xs={12} sm={2} css={{ justifyContent: "center" }}>
              <Button
                auto
                bordered
                shadow
                color="gradient"
                size="lg"
                icon={<Image2 set="bold" size="large" />}
                href="/"
                target="_blank"
                as="a"
              >
                选图小帮手（百度云盘版）
              </Button>
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
