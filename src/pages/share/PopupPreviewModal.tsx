import React, { ReactNode } from "react";
import {
  Modal,
  Row,
  Grid,
  Button,
  Switch,
  Text,
  Image,
  Loading,
  NormalColors,
} from "@nextui-org/react";
import { ChevronLeftCircle, ChevronRightCircle } from "react-iconly";
import Panzoom from "../../components/panzoom";
import { PcsImageWithSelection } from "./ImageListCard";
import SelectedImagesList, { PcsImageWithIndex } from "./SelectedImagesList";

export type PopupPreviewProps = {
  imagesList: PcsImageWithSelection[];
  selectedImagesList: PcsImageWithIndex[];
  showingImage: PcsImageWithSelection | null;
  isMobile: boolean;
  cursor: number;
  PAGE_SIZE: number;
  submitBtnState: [NormalColors, ReactNode];
  makeSelectionLoading: boolean;
  bindingsPopupPreview: {
    open: boolean;
    onClose: () => void;
  };
  goPrevPage: () => void;
  goNextPage: () => void;
  setCursor: (cursor: number) => void;
  addSelect: (fsId: number) => void;
  removeSelect: (fsId: number) => void;
  setPopupPreviewVisible: (visible: boolean) => void;
  handleSubmitSelection: () => void;
};

function PopupPreview({
  imagesList,
  selectedImagesList,
  showingImage,
  isMobile,
  bindingsPopupPreview,
  cursor,
  submitBtnState,
  makeSelectionLoading,
  PAGE_SIZE,
  goPrevPage,
  goNextPage,
  setCursor,
  addSelect,
  removeSelect,
  setPopupPreviewVisible,
  handleSubmitSelection,
}: PopupPreviewProps) {
  return (
    <Modal
      closeButton
      {...bindingsPopupPreview}
      width="80vw"
      fullScreen={isMobile}
    >
      <Modal.Header>
        <Text>{showingImage?.filename ?? ""}</Text>
      </Modal.Header>
      <Modal.Body
        css={{
          p: isMobile ? "$0" : "$1",
        }}
      >
        <Panzoom options={{ doubleClick: "toggleZoom", click: false }}>
          <div
            style={{
              width: !isMobile ? "80vw" : "100%",
              height: isMobile ? "70vh" : "100%",
              maxHeight: !isMobile ? "80vh" : null,
            }}
          >
            <Image
              objectFit="contain"
              src={showingImage?.thumb}
              alt={showingImage?.filename}
              width="100%"
              height="100%"
            />
          </div>
        </Panzoom>
      </Modal.Body>
      <Modal.Footer>
        <Row>
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
            <Grid xs={4}>
              <Grid.Container
                direction="row"
                gap={0.5}
                justify="center"
                alignItems="center"
              >
                <Grid>
                  <Switch
                    size="sm"
                    checked={showingImage?.isSelected ?? false}
                    onChange={(evt) => {
                      if (!showingImage?.fsId) return;

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
                disabled={cursor >= (imagesList ?? []).length - 1}
                onPress={() => {
                  if ((cursor + 1) % PAGE_SIZE === 0) goNextPage();
                  setCursor(cursor + 1);
                }}
              >
                下一张
              </Button>
            </Grid>
          </Grid.Container>
        </Row>
        {isMobile && (selectedImagesList ?? []).length > 0 ? (
          <>
            <Row
              css={{
                maxH: "87px",
                overflowY: "auto",
              }}
            >
              <SelectedImagesList
                selectedImagesList={selectedImagesList}
                isMobile={isMobile}
                setCursor={setCursor}
                setPopupPreviewVisible={setPopupPreviewVisible}
              />
            </Row>
            <Row>
              <Button
                size="sm"
                css={{ w: "100%" }}
                color={submitBtnState[0]}
                icon={submitBtnState[1]}
                onPress={handleSubmitSelection}
                {...(makeSelectionLoading
                  ? {
                      disabled: true,
                      bordered: true,
                      color: "secondary",
                    }
                  : {})}
              >
                {!makeSelectionLoading ? (
                  "保存选择"
                ) : (
                  <Loading color="currentColor" size="sm" />
                )}
              </Button>
            </Row>
          </>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}

export default PopupPreview;
