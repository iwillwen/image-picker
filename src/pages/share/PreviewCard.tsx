import React from "react";
import { Card, Grid, Text, Button, Switch } from "@nextui-org/react";
import { PcsImageWithSelection } from "./ImageListCard";
import { ChevronLeftCircle, ChevronRightCircle } from "react-iconly";

export type PreviewCardProps = {
  imagesList: PcsImageWithSelection[];
  showingImage: PcsImageWithSelection;
  cursor: number;
  PAGE_SIZE: number;
  goPrevPage: () => void;
  goNextPage: () => void;
  addSelect: (fsId: number) => void;
  removeSelect: (fsId: number) => void;
  setCursor: (cursor: number) => void;
  setPopupPreviewVisible: (visible: boolean) => void;
};

function PreviewCard({
  showingImage,
  cursor,
  imagesList,
  PAGE_SIZE,
  setCursor,
  goPrevPage,
  goNextPage,
  addSelect,
  removeSelect,
  setPopupPreviewVisible,
}: PreviewCardProps) {
  if (!showingImage) return null;

  return (
    <Card>
      <Card.Header>
        <Text h4 css={{ margin: "$0" }}>
          {showingImage.filename}（预览缩略图，点击放大）
        </Text>
      </Card.Header>
      <Card.Image
        showSkeleton
        src={showingImage.thumb}
        width="100%"
        css={{ maxH: "45vh" }}
        objectFit="contain"
        onClick={() => setPopupPreviewVisible(true)}
      />
      <Card.Footer>
        <Grid.Container justify="space-between" alignItems="center">
          <Grid>
            <Button
              auto
              bordered
              size="sm"
              icon={<ChevronLeftCircle />}
              disabled={cursor === 0}
              onPress={() => {
                if (cursor % PAGE_SIZE === 0) goPrevPage();
                setCursor(cursor - 1);
              }}
            >
              上一张
            </Button>
          </Grid>
          <Grid sm={4}>
            <Grid.Container gap={0.5} justify="center" alignItems="center">
              <Grid>
                <Switch
                  size="sm"
                  checked={showingImage.isSelected}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      addSelect(showingImage.fsId);
                    } else {
                      removeSelect(showingImage.fsId);
                    }
                  }}
                />
              </Grid>
              <Grid>
                <Text>选择这张图片</Text>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid>
            <Button
              auto
              bordered
              size="sm"
              icon={<ChevronRightCircle />}
              disabled={cursor >= imagesList.length - 1}
              onPress={() => {
                if ((cursor + 1) % PAGE_SIZE === 0) goNextPage();
                setCursor(cursor + 1);
              }}
            >
              下一张
            </Button>
          </Grid>
        </Grid.Container>
      </Card.Footer>
    </Card>
  );
}

export default PreviewCard;
