import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Virtual, Mousewheel, Swiper as SwiperInstance } from "swiper";
import { ChevronLeftCircle, ChevronRightCircle } from "react-iconly";
import { PcsImageWithSelection } from "./ImageListCard";
import SelectedImagesList, { PcsImageWithIndex } from "./SelectedImagesList";

import "swiper/css";
import "swiper/css/virtual";
import "swiper/css/zoom";

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
  const swiperInstanceRef = useRef<SwiperInstance>();

  const currentIndex = useMemo(
    () =>
      (imagesList ?? []).findIndex((row) => row.fsId === showingImage?.fsId),
    [imagesList, showingImage]
  );

  const handleSlide = useCallback(
    (activeIndex: number) => {
      if (activeIndex < cursor && activeIndex && PAGE_SIZE === 0) {
        goPrevPage();
      }
      if (activeIndex > cursor && activeIndex && PAGE_SIZE === 0) {
        goNextPage();
      }
      setCursor(activeIndex);
    },
    [cursor]
  );

  const handleSwiperInit = (swiper: SwiperInstance) => {
    swiperInstanceRef.current = swiper;
    swiper.on("slideChange", () => handleSlide(swiper.activeIndex));
  };

  useEffect(() => {
    if (
      !imagesList ||
      imagesList.length <= 0 ||
      !showingImage ||
      !swiperInstanceRef.current ||
      swiperInstanceRef.current.destroyed
    )
      return;

    const index = imagesList.findIndex((row) => row.fsId === showingImage.fsId);
    swiperInstanceRef.current.slideTo(index);
  }, [showingImage, imagesList]);

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
          "@xsMax": { p: "$0" },
          "@sm": { p: "$1" },
        }}
      >
        <Swiper
          zoom={{
            maxRatio: 2,
          }}
          mousewheel={{
            forceToAxis: true,
          }}
          virtual
          initialSlide={currentIndex}
          modules={[Zoom, Virtual, Mousewheel]}
          onSwiper={handleSwiperInit}
        >
          {(imagesList ?? []).map((image, i) => (
            <SwiperSlide key={image.fsId} virtualIndex={i}>
              <Image
                className="swiper-zoom-container"
                objectFit="contain"
                src={image.thumb}
                alt={image.filename}
                css={{
                  "@xsMax": {
                    width: "100%",
                    height: "70vh",
                  },
                  "@sm": {
                    width: "80vw",
                    height: "80vh",
                  },
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
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
