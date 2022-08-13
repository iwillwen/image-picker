import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Grid,
  Card,
  Loading,
  Image,
  Text,
  Button,
  Switch,
  Spacer,
  Modal,
  useModal,
  NormalColors,
} from "@nextui-org/react";
import { isEmpty, isString } from "lodash";
import { useSet } from "ahooks";

import { useShare, Selection } from "../../hooks/useShare";
import { PcsImage } from "../../hooks/useBaiduPCS";
import {
  ChevronLeftCircle,
  ChevronRightCircle,
  Paper,
  Send,
  TickSquare,
} from "react-iconly";

export default function Share() {
  const router = useRouter();
  const { key } = router.query;
  const { setVisible: setPopupPreviewVisible, bindings: bindingsPopupPreview } =
    useModal();

  const {
    loadShare,
    sharedImages,
    shareLoading,
    makeSelection,
    makeSelectionLoading,
    getSelection,
    selectionRecord,
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
    const textData = JSON.stringify(selection);

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
    <Col span={6}>
      <Card>
        <Card.Body css={{ minHeight: "80vh" }}>
          {shareLoading ? <Loading size="xl" css={{ height: "100%" }} /> : null}

          <Grid.Container gap={1}>
            {imagesList.map((image, index) => (
              <Grid xs={12} sm={6} lg={4} key={image.fsId}>
                <Image
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
                  onClick={() => setCursor(index)}
                  onDoubleClick={() => toggleSelect(image.fsId)}
                />
              </Grid>
            ))}
          </Grid.Container>
        </Card.Body>
      </Card>
    </Col>
  );

  const previewCard = (
    <Row>
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
    </Row>
  );

  const popupPreview = showingImage ? (
    <Modal
      width="90vw"
      css={{ maxH: "fit-content" }}
      closeButton
      {...bindingsPopupPreview}
    >
      <Modal.Header>{showingImage.filename}</Modal.Header>
      <Modal.Body>
        <Image
          objectFit="cover"
          src={showingImage.thumb}
          alt={showingImage.filename}
        />
      </Modal.Body>
    </Modal>
  ) : null;

  const selectedImagesListCard =
    selectedImages.size > 0 ? (
      <>
        <Spacer y={1} />
        <Row>
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
                      onClick={() => setCursor(image.index)}
                    />
                  </Grid>
                ))}
              </Grid.Container>
            </Card.Body>
          </Card>
        </Row>
      </>
    ) : null;

  return (
    <Row gap={1}>
      {imagesListCard}
      <Col
        span={6}
        css={{
          position: "sticky",
          top: 20,
        }}
      >
        {previewCard}
        {selectedImagesListCard}
        {popupPreview}
      </Col>
    </Row>
  );
}
