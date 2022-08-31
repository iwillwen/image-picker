import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Grid, useModal, usePagination, NormalColors } from "@nextui-org/react";
import { isEmpty, isString, sortBy } from "lodash";
import { useSet, useResponsive } from "ahooks";
import { Send, TickSquare } from "react-iconly";

import { useShare, Selection } from "../../hooks/useShare";
import type { PcsImage } from "../../hooks/useBaiduPCS";
import Footer from "../../components/Footer";

import ImageListCard from "./ImageListCard";
import PreviewCard from "./PreviewCard";
import { PcsImageWithIndex } from "./SelectedImagesList";
import PopupPreview from "./PopupPreviewModal";
import SelectedImagesCard from "./SelectedImagesCard";

export async function getServerSideProps() {
  return { props: {} };
}

const PAGE_SIZE = 10 * (2 * 3);

export default function Share() {
  const router = useRouter();
  const { key } = router.query;
  const responsive = useResponsive();
  const isMobile = useMemo(
    () => responsive?.xs && !responsive?.md,
    [responsive]
  );
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
  const [submitBtnState, setSubmitBtnState] = useState<
    [NormalColors, ReactNode]
  >(["primary", <Send key="submit-btn" />]);

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

  const selectedImagesList = useMemo<PcsImageWithIndex[]>(() => {
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

  useEffect(() => {
    if (!isString(key)) return;

    loadShare(key);
    getSelection(key).then((selection) => {
      resetSelect();
      for (const { fsId } of selection) addSelect(fsId);
    });
  }, [key]);

  if (!isString(key)) return null;

  return (
    <>
      <Grid.Container gap={1}>
        <Grid
          xs={12}
          sm={0}
          css={{
            position: "sticky",
            alignSelf: "start",
            top: "10px",
            zIndex: 99,
          }}
        >
          <SelectedImagesCard
            shareKey={key}
            isMobile={isMobile}
            imagesList={imagesList}
            selectedImagesList={selectedImagesList}
            submitBtnState={submitBtnState}
            setCursor={setCursor}
            addSelect={addSelect}
            resetSelect={resetSelect}
            handleSubmitSelection={handleSubmitSelection}
            setPopupPreviewVisible={setPopupPreviewVisible}
          />
        </Grid>
        <Grid sm={6} xs={12} style={{ width: "100%" }}>
          <ImageListCard
            shareLoading={shareLoading}
            showImagesList={showImagesList}
            activePage={activePage}
            totalPage={totalPage}
            PAGE_SIZE={PAGE_SIZE}
            isMobile={isMobile}
            setPage={setPage}
            toggleSelect={toggleSelect}
            setCursor={setCursor}
            setPopupPreviewVisible={setPopupPreviewVisible}
          />
        </Grid>
        <Grid
          xs={0}
          sm={6}
          css={{
            position: "sticky",
            top: "$5",
            alignSelf: "start",
          }}
        >
          <>
            <Grid.Container direction="column" gap={0}>
              <Grid css={{ p: "$0", alignSelf: "center", width: "100%" }}>
                <PreviewCard
                  imagesList={imagesList}
                  showingImage={showingImage}
                  cursor={cursor}
                  PAGE_SIZE={PAGE_SIZE}
                  goPrevPage={goPrevPage}
                  goNextPage={goNextPage}
                  addSelect={addSelect}
                  removeSelect={removeSelect}
                  setCursor={setCursor}
                  setPopupPreviewVisible={setPopupPreviewVisible}
                />
              </Grid>
              <Grid
                css={{
                  p: "$0",
                  marginTop: "$5",
                }}
              >
                <SelectedImagesCard
                  shareKey={key}
                  isMobile={isMobile}
                  imagesList={imagesList}
                  selectedImagesList={selectedImagesList}
                  submitBtnState={submitBtnState}
                  setCursor={setCursor}
                  addSelect={addSelect}
                  resetSelect={resetSelect}
                  handleSubmitSelection={handleSubmitSelection}
                  setPopupPreviewVisible={setPopupPreviewVisible}
                />
              </Grid>
            </Grid.Container>
            <PopupPreview
              imagesList={imagesList}
              selectedImagesList={selectedImagesList}
              showingImage={showingImage}
              isMobile={isMobile}
              cursor={cursor}
              PAGE_SIZE={PAGE_SIZE}
              submitBtnState={submitBtnState}
              makeSelectionLoading={makeSelectionLoading}
              bindingsPopupPreview={bindingsPopupPreview}
              goPrevPage={goPrevPage}
              goNextPage={goNextPage}
              setCursor={setCursor}
              addSelect={addSelect}
              removeSelect={removeSelect}
              setPopupPreviewVisible={setPopupPreviewVisible}
              handleSubmitSelection={handleSubmitSelection}
            />
          </>
        </Grid>
      </Grid.Container>
      <Footer />
    </>
  );
}
