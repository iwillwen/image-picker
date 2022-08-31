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
  Pagination,
  usePagination,
  NormalColors,
  Row,
  Textarea,
} from "@nextui-org/react";
import { isEmpty, isString, sortBy } from "lodash";
import { useSet, useResponsive } from "ahooks";
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

const PAGE_SIZE = 3 * (2 * 3);

export default function Share() {
  const router = useRouter();
  const { key } = router.query;
  const responsive = useResponsive();
  const isMobile = responsive?.xs && !responsive?.md;
  const { setVisible: setPopupPreviewVisible, bindings: bindingsPopupPreview } =
    useModal();
  const { setVisible: setImportModalVisible, bindings: bindingsImportModal } =
    useModal();
  const [dataToImport, setDataToImport] = useState("");
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
  const [submitBtnState, setSubmitBtnState] = useState<
    [NormalColors, ReactNode]
  >(["primary", <Send key="submit-btn" />]);
  const [copyBtnState, setCopyBtnState] = useState<[NormalColors, ReactNode]>([
    "primary",
    <Paper key="copy-btn" />,
  ]);

  const imagesList = useMemo(() => {
    return sortBy(
      sharedImages.map<PcsImage & { isSelected?: boolean }>((image) => ({
        ...image,
        isSelected: selectedImages.has(image.fsId),
      })),
      "filename"
    );
  }, [sharedImages, selectedImages]);

  const totalPage = useMemo(
    () => Math.ceil(imagesList.length / PAGE_SIZE),
    [imagesList]
  );
  const {
    active: activePage,
    setPage,
    previous: goPrevPage,
    next: goNextPage,
  } = usePagination({
    total: totalPage,
  });
  const [cursor, setCursor] = useState(0);
  const showImagesList = useMemo(() => {
    return imagesList.slice(
      (activePage - 1) * PAGE_SIZE,
      activePage * PAGE_SIZE
    );
  }, [imagesList, activePage]);

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

  const handlePressImportButton = () => {
    setImportModalVisible(true);
  };

  const handleImportSelectionData = useCallback(() => {
    if (!dataToImport) return;

    const list = dataToImport
      .split(/[,\n]/)
      .map((row) => row.split(".")?.[0] ?? null)
      .filter<string>(isString);

    let importedCount = 0;

    for (const row of list) {
      const image = imagesList.find((image) => image.filename.startsWith(row));
      if (!image) continue;
      addSelect(image.fsId);
      importedCount += 1;
    }

    setImportModalVisible(false);
    alert(`成功导入 ${importedCount} 张图片`);
  }, [dataToImport, imagesList]);

  useEffect(() => {
    if (!isString(key)) return;

    loadShare(key);
    getSelection(key).then((selection) => {
      resetSelect();
      for (const { fsId } of selection) addSelect(fsId);
    });
  }, [key]);

  const imagesListCard = (
    <Grid md={6} sm={12} style={{ width: "100%" }}>
      <Card>
        <Card.Body css={{ minHeight: "50vh" }}>
          {shareLoading ? <Loading size="xl" css={{ height: "100%" }} /> : null}

          <Grid.Container gap={1}>
            {showImagesList.map((image, index) => (
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
    </Grid>
  );

  const previewCard = (
    <Grid css={{ p: "$0", alignSelf: "center", width: "100%" }}>
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
          </>
        ) : null}
      </Card>
    </Grid>
  );

  const selectedImagesListEl =
    selectedImagesList.length > 0 ? (
      <Grid.Container>
        {selectedImagesList.map((image) => (
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
    ) : null;

  const popupPreview = showingImage ? (
    <Modal
      closeButton
      {...bindingsPopupPreview}
      width="80vw"
      fullScreen={isMobile}
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
              width: !isMobile ? "80vw" : "100%",
              height: isMobile ? "70vh" : "100%",
              maxHeight: !isMobile ? "80vh" : null,
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
        </Row>
        {isMobile && selectedImagesList.length > 0 ? (
          <>
            <Row
              css={{
                maxH: "87px",
                overflowY: "auto",
              }}
            >
              {selectedImagesListEl}
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
  ) : null;

  const selectedImagesListCard = (
    <Grid
      css={
        isMobile
          ? {
              position: "sticky",
              alignSelf: "start",
              top: "10px",
              zIndex: 99,
            }
          : {
              p: "$0",
              marginTop: "$5",
            }
      }
    >
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
                    color="secondary"
                    bordered
                    size="sm"
                    onPress={handlePressImportButton}
                  >
                    导入
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
          <Row css={{ maxH: !isMobile ? "25vh" : null, overflowY: "auto" }}>
            {selectedImagesList.length > 0 ? (
              selectedImagesListEl
            ) : (
              <Text css={{ w: "100%", p: "$5", textAlign: "center" }}>
                尚未选择图片
              </Text>
            )}
          </Row>
        </Card.Body>
      </Card>
    </Grid>
  );

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
        <Grid.Container direction="column" gap={0}>
          {previewCard}
          {!isMobile ? selectedImagesListCard : null}
        </Grid.Container>
        {popupPreview}
      </Grid>
      <Modal
        closeButton
        fullScreen={isMobile}
        {...bindingsImportModal}
        width={!isMobile ? "600px" : null}
      >
        <Modal.Header>
          <Text h3>导入已选图片数据</Text>
        </Modal.Header>
        <Modal.Body>
          <Textarea
            width="100%"
            rows={15}
            value={dataToImport}
            placeholder={`将需要导入的文件名填入此处，一行一个或以英文逗号隔开。
导入内容将会与当前选择合并。`}
            onChange={(evt) => setDataToImport(evt.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Grid.Container gap={0.5} justify="flex-end">
            <Grid>
              <Button
                auto
                bordered
                onPress={() => setImportModalVisible(false)}
              >
                取消
              </Button>
            </Grid>
            <Grid>
              <Button auto onPress={handleImportSelectionData}>
                导入
              </Button>
            </Grid>
          </Grid.Container>
        </Modal.Footer>
      </Modal>
    </Grid.Container>
  );
}
