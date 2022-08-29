import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  Grid,
  Card,
  Loading,
  Image,
  Text,
  Button,
  Switch,
  Modal,
  useModal,
  NormalColors,
} from "@nextui-org/react";
import { isEmpty, isString } from "lodash";
import { useSet, useResponsive, useReactive } from "ahooks";
import {
  ChevronLeftCircle,
  ChevronRightCircle,
  Paper,
  Send,
  TickSquare,
} from "react-iconly";

import { useShare, Selection } from "../hooks/useShare";
import type { PcsImage } from "../hooks/useBaiduPCS";
import Panzoom from "../components/panzoom";

export async function getServerSideProps() {
  return { props: {} };
}

export default function Share() {
  const router = useRouter();
  const { key } = router.query;
  const responsive = useResponsive();
  const { setVisible: setPopupPreviewVisible, bindings: bindingsPopupPreview } =
    useModal();
  const {
    loadShare,
    sharedImages,
    shareLoading,
    makeSelection,
    makeSelectionLoading,
    getSelection,
  } = useShare();
  const [
    selectedImages,
    { add: addSelect, remove: removeSelect, reset: resetSelect },
  ] = useSet<number>();
  const [cursor, setCursor] = useState(0);
  const [submitBtnState, setSubmitBtnState] = useState<
    [NormalColors, ReactNode]
  >(["primary", <Send key="submit-btn" />]);
  const [copyBtnState, setCopyBtnState] = useState<[NormalColors, ReactNode]>([
    "primary",
    <Paper key="copy-btn" />,
  ]);

  const imagesList = useMemo(() => {
    return sharedImages.map<PcsImage & { isSelected?: boolean }>((image) => ({
      ...image,
      isSelected: selectedImages.has(image.fsId),
    }));
  }, [sharedImages, selectedImages]);

  const showingImage = useMemo(() => imagesList[cursor], [imagesList, cursor]);

  const selectedImagesList = useMemo(() => {
    return imagesList
      .filter((row) => row.isSelected)
      .map((row) => ({
        ...row,
        index: imagesList.indexOf(row),
      }));
  }, [imagesList]);

  const toggleSelect = useCallback(
    (fsId: number) => {
      if (selectedImages.has(fsId)) {
        removeSelect(fsId);
      } else {
        addSelect(fsId);
      }
    },
    [selectedImages]
  );

  const handleSubmitSelection = useCallback(async () => {
    if (!isString(key) || isEmpty(selectedImagesList)) return;

    const selection = selectedImagesList.map<Selection>((row) => ({
      filename: row.filename,
      fsId: row.fsId,
    }));

    await makeSelection(key, selection);

    setSubmitBtnState(["success", <TickSquare key="submit-btn" />]);

    setTimeout(() => {
      setSubmitBtnState(["primary", <Send key="submit-btn" />]);
    }, 2e3);
  }, [key, selectedImagesList]);

  const handleCopySelection = useCallback(async () => {
    if (!isString(key) || isEmpty(selectedImagesList)) return;

    const selection = selectedImagesList.map((row) => row.filename);
    const textData = selection.join(",");

    navigator.clipboard.writeText(textData);

    setCopyBtnState(["success", <TickSquare key="copy-btn" />]);

    setTimeout(() => {
      setCopyBtnState(["primary", <Paper key="copy-btn" />]);
    }, 2e3);
  }, [key, selectedImagesList]);

  useEffect(() => {
    if (!isString(key)) return;

    loadShare(key);
    getSelection(key).then((selection) => {
      resetSelect();
      for (const { fsId } of selection) addSelect(fsId);
    });
  }, [key]);

  const imagesListCard = (
    <Grid md={6} sm={12}>
      <Card>
        <Card.Body css={{ minHeight: "80vh" }}>
          {shareLoading ? <Loading size="xl" css={{ height: "100%" }} /> : null}

          <Grid.Container gap={1}>
            {imagesList.map((image, index) => (
              <Grid xs={6} md={4} key={image.fsId}>
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
                    setCursor(index);
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
      </Card>
    </Grid>
  );

  const previewCard = (
    <Grid css={{ p: '$0' }}>
      <Card>
        {showingImage ? (
          <>
            <Card.Header>
              <Text h4>{showingImage.filename}（预览缩略图，点击放大）</Text>
            </Card.Header>
            <Card.Image
              showSkeleton
              src={showingImage.thumb}
              width="100%"
              objectFit="contain"
              css={{ maxH: "50vh" }}
              onClick={() => setPopupPreviewVisible(true)}
            />
            <Card.Footer>
              <Grid.Container justify="space-between" alignItems="center">
                <Grid>
                  <Button
                    auto
                    size="sm"
                    icon={<ChevronLeftCircle />}
                    disabled={cursor === 0}
                    onPress={() => setCursor(cursor - 1)}
                  >
                    上一张
                  </Button>
                </Grid>
                <Grid sm={4}>
                  <Grid.Container
                    gap={0.5}
                    justify="center"
                    alignItems="center"
                  >
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
                    size="sm"
                    icon={<ChevronRightCircle />}
                    disabled={cursor >= imagesList.length - 1}
                    onPress={() => setCursor(cursor + 1)}
                  >
                    下一张
                  </Button>
                </Grid>
              </Grid.Container>
            </Card.Footer>
          </>
        ) : null}
      </Card>
    </Grid>
  );

  const isMobile = responsive?.xs && !responsive?.md;

  const popupPreview = showingImage ? (
    <Modal
      fullScreen={isMobile}
      width="80vw"
      css={{
        maxH: isMobile ? "fit-content" : null,
      }}
      closeButton
      {...bindingsPopupPreview}
    >
      <Modal.Header>
        <Text>{showingImage.filename}</Text>
      </Modal.Header>
      <Modal.Body
        css={{
          p: responsive?.xs ? "$0" : "$1",
        }}
      >
        <Panzoom options={{ doubleClick: "toggleZoom", click: false }}>
          <div
            style={{
              width: "100%",
              height: isMobile ? "80vh" : null,
            }}
          >
            <Image
              objectFit="contain"
              src={showingImage.thumb}
              alt={showingImage.filename}
              width="100%"
              height="100%"
            />
          </div>
        </Panzoom>
      </Modal.Body>
      <Modal.Footer>
        <Grid.Container justify="space-between" alignItems="center">
          <Grid>
            <Button
              auto
              size="sm"
              icon={<ChevronLeftCircle />}
              disabled={cursor === 0}
              onPress={() => setCursor(cursor - 1)}
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
              size="sm"
              icon={<ChevronRightCircle />}
              disabled={cursor >= imagesList.length - 1}
              onPress={() => setCursor(cursor + 1)}
            >
              下一张
            </Button>
          </Grid>
        </Grid.Container>
      </Modal.Footer>
    </Modal>
  ) : null;

  const selectedImagesListCard =
    selectedImages.size > 0 ? (
      <Grid>
        <Card>
          <Card.Header>
            <Grid.Container justify="space-between">
              <Grid>
                <Text h3>
                  已选图片列表（已选 {selectedImagesList.length} 张）
                </Text>
              </Grid>
              <Grid>
                <Grid.Container gap={0.5}>
                  <Grid>
                    <Button
                      bordered
                      auto
                      size="sm"
                      onPress={resetSelect}
                      color="error"
                    >
                      清空
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      auto
                      bordered
                      color={copyBtnState[0]}
                      icon={copyBtnState[1]}
                      size="sm"
                      onPress={handleCopySelection}
                    >
                      复制选择数据
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      auto
                      color={submitBtnState[0]}
                      icon={submitBtnState[1]}
                      size="sm"
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
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Card.Header>
          <Card.Body>
            <Grid.Container>
              {selectedImagesList.map((image) => (
                <Grid xs={1} key={image.fsId}>
                  <Image
                    src={image.thumbs["url1"]}
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
          </Card.Body>
        </Card>
      </Grid>
    ) : null;

  return (
    <Grid.Container gap={1}>
      {isMobile ? selectedImagesListCard : null}
      {imagesListCard}
      <Grid
        xs={0}
        md={6}
        css={{
          position: "sticky",
          top: 20,
          alignSelf: "start",
        }}
      >
        <Grid.Container gap={1} direction="column">
          {previewCard}
          {!isMobile ? selectedImagesListCard : null}
        </Grid.Container>
        {popupPreview}
      </Grid>
    </Grid.Container>
  );
}
