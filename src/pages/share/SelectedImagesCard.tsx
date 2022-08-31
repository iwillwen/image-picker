import React, { ReactNode, useCallback, useState } from "react";
import { isEmpty, isString } from "lodash";
import {
  Grid,
  Card,
  Text,
  Textarea,
  Button,
  Row,
  Link,
  Modal,
  Loading,
  useModal,
  NormalColors,
} from "@nextui-org/react";
import { Paper, TickSquare } from "react-iconly";
import SelectedImagesList, { PcsImageWithIndex } from "./SelectedImagesList";
import { PcsImageWithSelection } from "./ImageListCard";
import { useShare } from "../../hooks/useShare";

export type SelectedImagesCardProps = {
  shareKey: string;

  isMobile: boolean;
  imagesList: PcsImageWithSelection[];
  selectedImagesList: PcsImageWithIndex[];
  submitBtnState: [NormalColors, ReactNode];
  setCursor: (cursor: number) => void;
  addSelect: (fsId: number) => void;
  resetSelect: () => void;
  handleSubmitSelection: () => void;
  setPopupPreviewVisible: (visible: boolean) => void;
};

function SelectedImagesCard({
  shareKey,
  isMobile,
  imagesList,
  selectedImagesList,
  submitBtnState,

  setCursor,
  addSelect,
  resetSelect,
  handleSubmitSelection,
  setPopupPreviewVisible,
}: SelectedImagesCardProps) {
  const { makeSelectionLoading } = useShare();
  const [dataToImport, setDataToImport] = useState("");
  const [copyBtnState, setCopyBtnState] = useState<[NormalColors, ReactNode]>([
    "primary",
    <Paper key="copy-btn" />,
  ]);

  const { setVisible: setImportModalVisible, bindings: bindingsImportModal } =
    useModal();

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
    setDataToImport("");
    alert(`成功导入 ${importedCount} 张图片`);
  }, [dataToImport, imagesList]);

  const handleCopySelection = useCallback(async () => {
    if (!isString(shareKey) || isEmpty(selectedImagesList)) return;

    const selection = selectedImagesList.map((row) => row.filename);
    const textData = selection.join(",");

    navigator.clipboard.writeText(textData);

    setCopyBtnState(["success", <TickSquare key="copy-btn" />]);

    setTimeout(() => {
      setCopyBtnState(["primary", <Paper key="copy-btn" />]);
    }, 2e3);
  }, [shareKey, selectedImagesList]);

  return (
    <>
      <Card>
        <Card.Header>
          <Grid.Container justify="space-between">
            <Grid>
              <Text h3 css={{ margin: "$0", lineHeight: "32px" }}>
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
        <Card.Body css={{ padding: "$5", paddingTop: "$0" }}>
          <Row style={{ maxHeight: "16vh", overflowY: "auto" }}>
            <SelectedImagesList
              selectedImagesList={selectedImagesList}
              isMobile={isMobile}
              setCursor={setCursor}
              setPopupPreviewVisible={setPopupPreviewVisible}
            />
          </Row>
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
          <Text css={{ m: "$0" }}>
            <Link
              isExternal
              block={false}
              href="https://pan.baidu.com/s/1wZVQFCQAtp1kP7GrX2UyEg?pwd=49ed"
              target="_blank"
            >
              点击此处
            </Link>
          </Text>
          <Text css={{ m: "$0" }}>下载 Lightroom 快速标记插件</Text>
        </Card.Footer>
      </Card>
      <Modal
        closeButton
        fullScreen={isMobile}
        {...bindingsImportModal}
        width={!isMobile ? "600px" : null}
      >
        <Modal.Header>
          <Text h3 css={{ margin: "$0", lineHeight: "32px" }}>
            导入已选图片数据
          </Text>
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
    </>
  );
}

export default SelectedImagesCard;
