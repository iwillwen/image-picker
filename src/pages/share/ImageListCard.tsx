import React from "react";
import { Card, Grid, Row, Pagination, Image, Loading } from "@nextui-org/react";
import { PcsImage } from "../../hooks/useBaiduPCS";

export type PcsImageWithSelection = PcsImage & { isSelected?: boolean };

export type ImageListCardProps = {
  shareLoading: boolean;
  showImagesList: PcsImageWithSelection[];
  activePage: number;
  totalPage: number;
  PAGE_SIZE: number;
  isMobile: boolean;
  setPage: (page: number) => void;
  toggleSelect: (fsId: number) => void;
  setCursor: (cursor: number) => void;
  setPopupPreviewVisible: (visible: boolean) => void;
};

function ImageListCard({
  shareLoading,
  showImagesList,
  activePage,
  totalPage,
  PAGE_SIZE,
  isMobile,

  setPage,
  toggleSelect,
  setCursor,
  setPopupPreviewVisible,
}: ImageListCardProps) {
  return (
    <Card>
      <Card.Body>
        {shareLoading || showImagesList.length <= 0 ? (
          <Loading size="xl" css={{ height: "100%" }} />
        ) : null}

        <Grid.Container gap={1}>
          {(showImagesList ?? []).map((image, index) => (
            <Grid xs={6} sm={4} key={image.fsId}>
              <Image
                data-fs-id={image.fsId}
                showSkeleton
                src={image.thumb}
                objectFit="cover"
                alt={image.filename}
                css={{
                  aspectRatio: "1 / 1",
                  outline: image.isSelected ? "7px solid #0072f5" : null,
                  outlineOffset: "-7px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCursor((activePage - 1) * PAGE_SIZE + index);
                  if (isMobile) {
                    setPopupPreviewVisible(true);
                  }
                }}
                onDoubleClick={() => toggleSelect(image.fsId)}
              />
            </Grid>
          ))}
        </Grid.Container>
      </Card.Body>
      <Card.Footer>
        <Row css={{ width: "100%", paddingBottom: "$5" }} justify="center">
          <Pagination
            rounded
            page={activePage}
            total={totalPage}
            onChange={setPage}
          />
        </Row>
      </Card.Footer>
    </Card>
  );
}

export default ImageListCard;
