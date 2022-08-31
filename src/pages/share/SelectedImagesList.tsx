import React from "react";
import { Grid, Image, Text } from "@nextui-org/react";
import { PcsImageWithSelection } from "./ImageListCard";

export type PcsImageWithIndex = PcsImageWithSelection & {
  index: number;
};

export type SelectedImagesListProps = {
  readonly selectedImagesList: PcsImageWithIndex[];
  isMobile: boolean;
  setCursor: (cursor: number) => void;
  setPopupPreviewVisible: (visible: boolean) => void;
};

function SelectedImagesList({
  selectedImagesList,
  isMobile,
  setCursor,
  setPopupPreviewVisible,
}: SelectedImagesListProps) {
  const children =
    (selectedImagesList ?? []).length <= 0 ? (
      <Text css={{ w: "100%", p: "$5", textAlign: "center" }}>
        尚未选择图片
      </Text>
    ) : (
      <Grid.Container>
        {(selectedImagesList ?? []).map((image) => (
          <Grid xs={1} key={image.fsId}>
            <Image
              src={image.thumb}
              objectFit="cover"
              alt={image.filename}
              css={{ cursor: "pointer", aspectRatio: "1 / 1" }}
              onClick={() => {
                setCursor(image.index);
                if (isMobile) {
                  setPopupPreviewVisible(true);
                }
              }}
            />
          </Grid>
        ))}
      </Grid.Container>
    );

  return <div>{children}</div>;
}

export default SelectedImagesList;
