import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  Table,
  Grid,
  Text,
  Row,
  Col,
  Input,
  Button,
  Link,
  Spacer,
  Switch,
  SwitchEvent,
  Card,
  Popover,
  Loading,
  NormalColors,
} from "@nextui-org/react";
import {
  Folder,
  ChevronLeftCircle,
  Image as ImageIcon,
  Send,
  Paper,
  TickSquare,
} from "react-iconly";
import { useRouter } from "next/router";
import { useLatest } from "ahooks";

import { useBaiduPCS } from "../hooks/useBaiduPCS";
import { useShare } from "../hooks/useShare";

export type PathRoute = {
  label: string;
  path: string;
};

export type FolderItem = {
  isFolder: true;
  name: string;
  path: string;
  isPrev?: boolean;
};

export type ImageItem = {
  isImage: true;
  name: string;
  path: string;
  thumb: string;
  fsId: number;
};

export type RowItem = Partial<FolderItem> & Partial<ImageItem>;

const isFolderItem = (row?: RowItem): row is FolderItem => row?.isFolder;
const isImageItem = (row?: RowItem): row is ImageItem => row?.isImage;

const ROOT_LABEL = "根目录";
const ROW_PER_PAGE = 20;

export async function getServerSideProps() {
  return { props: {} };
}

export default function FolderList() {
  const router = useRouter();
  const {
    folders: folderPaths,
    listFolders,
    listFoldersLoading,
    images,
    listImages,
    listImagesLoading,
  } = useBaiduPCS({
    ensureLogin: true,
  });
  const { createShare, createdShare, createShareLoading, generateShareUrl } =
    useShare();
  const currentPath = useMemo(
    () => "/" + (router.query.path || ""),
    [router.query.path]
  );
  const currentPathRef = useLatest(currentPath);
  const [shouldListImages, setShouldListImages] = useState(false);
  const routes = useMemo<PathRoute[]>(() => {
    return (ROOT_LABEL + currentPath)
      .split("/")
      .filter(Boolean)
      .map((label, index, paths) => ({
        label,
        path: ["", ...paths.slice(1, index + 1)].join("/") || "/",
      }));
  }, [currentPath]);
  const prevRoute = useMemo(
    () => (routes.length > 1 ? routes[routes.length - 2] : null),
    [routes]
  );
  const isLoading = useMemo(
    () => listFoldersLoading || listImagesLoading,
    [listFoldersLoading, listImagesLoading]
  );
  const [copyBtnState, setCopyBtnState] = useState<[NormalColors, ReactNode]>([
    "primary",
    <Paper key="copy-btn" />,
  ]);

  // Table items
  const folderRowItems = useMemo(
    () =>
      (folderPaths ?? []).map<FolderItem>((path) => ({
        isFolder: true,
        name: path.split("/").pop(),
        path,
      })),
    [folderPaths]
  );
  const imageRowItems = useMemo(() => {
    if (!shouldListImages) return [];

    return (images ?? []).map<ImageItem>((row) => ({
      isImage: true,
      name: row.filename,
      path: row.path,
      thumb: row.thumb,
      fsId: row.fsId,
    }));
  }, [images, shouldListImages]);
  const rowItems = useMemo(
    () => (folderRowItems as RowItem[]).concat(imageRowItems as RowItem[]),
    [folderRowItems, imageRowItems]
  );
  const totalPages = useMemo(
    () => Math.ceil((rowItems.length || 1) / ROW_PER_PAGE),
    [rowItems]
  );

  // Previewing
  const [selectedImage, setSelectImage] = useState<ImageItem>();

  const getInPath = (path: string) => {
    router.push("/folder?path=" + path.substring(1));
  };

  // Rendering Table
  const columns = [{ name: "文件夹", uid: "name" }];

  const renderCell = (row: RowItem, columnKey: keyof RowItem) => {
    switch (columnKey) {
      case "name":
        return (
          <Grid.Container>
            <Grid>{row.isFolder ? <Folder /> : <ImageIcon />}</Grid>
            <Grid xs={10}>
              <Text margin="5px" css={{ lineHeight: 1 }}>
                {row.name}
              </Text>
            </Grid>
          </Grid.Container>
        );
    }

    return null;
  };

  // Event handlers
  const handleSelectionChange = useCallback(
    (keys: Set<string>) => {
      if (keys.size !== 1) return;

      const targetPath = Array.from(keys.values())[0];
      const targetRowItem = rowItems.find((row) => row.path === targetPath);

      if (isFolderItem(targetRowItem) || (targetPath && !targetRowItem)) {
        getInPath(targetPath);
        return;
      }

      if (isImageItem(targetRowItem)) {
        setSelectImage(targetRowItem);
        return;
      }
    },
    [rowItems]
  );

  const handleGoBackToParentFolder = useCallback(() => {
    if (!prevRoute) return;
    getInPath(prevRoute.path);
  }, [prevRoute]);

  const handleToggleListImages = (evt: SwitchEvent) =>
    setShouldListImages(evt.target.checked);

  const handleShare = useCallback(async () => {
    if (!shouldListImages || !images || images.length <= 0) return;

    await createShare(currentPath, images);
  }, [currentPath, images, shouldListImages]);

  const handleCopyShareURL = (url: string) => {
    navigator.clipboard.writeText(url);
    window.open(url, "_blank");
    setCopyBtnState(["success", <TickSquare key="copy-btn" />]);

    setTimeout(() => {
      setCopyBtnState(["primary", <Paper key="copy-btn" />]);
    }, 1e3);
  };

  useEffect(() => {
    listFolders(currentPath).then((folders) => {
      setShouldListImages(folders.length <= 0);
    });
  }, [currentPath]);

  useEffect(() => {
    if (!shouldListImages) {
      setSelectImage(null);
      return;
    }

    listImages(currentPathRef.current, {
      onlyJpg: true,
    });
  }, [shouldListImages]);

  const toolbar = (
    <>
      <Grid.Container gap={1} alignItems="center">
        <Grid>
          <Button
            auto
            bordered
            disabled={routes.length <= 1}
            icon={<ChevronLeftCircle set="light" primaryColor="currentColor" />}
            onPress={handleGoBackToParentFolder}
          >
            返回上一层
          </Button>
        </Grid>
        <Grid xs={8}>
          <Grid.Container gap={0.1} alignItems="center">
            {routes.map((route, index) => [
              <Grid key={index}>
                <Link
                  key={route.path}
                  block
                  onClick={() => getInPath(route.path)}
                  css={{ cursor: "pointer" }}
                >
                  {route.label}
                </Link>
              </Grid>,
              index === routes.length - 1 ? null : "/",
            ])}
          </Grid.Container>
        </Grid>
        <Grid>
          <Grid.Container gap={0.5} alignItems="center" alignContent="center">
            <Grid>
              <Popover placement="bottom-left">
                <Popover.Trigger>
                  <Button
                    auto
                    icon={<Send />}
                    disabled={!shouldListImages}
                    onPress={handleShare}
                  >
                    分享当前文件夹
                  </Button>
                </Popover.Trigger>
                <Popover.Content css={{ p: "$4" }}>
                  {createShareLoading ? <Loading /> : null}
                  {!createShareLoading && createdShare?.key ? (
                    <Grid.Container gap={0.5}>
                      <Grid css={{ w: "fit-content" }}>
                        <Input
                          autoFocus
                          value={generateShareUrl(createdShare.key)}
                          css={{ width: 300 }}
                        />
                      </Grid>
                      <Grid>
                        <Button
                          auto
                          color={copyBtnState[0]}
                          icon={copyBtnState[1]}
                          onPress={() =>
                            handleCopyShareURL(
                              generateShareUrl(createdShare.key)
                            )
                          }
                        >
                          复制链接
                        </Button>
                      </Grid>
                    </Grid.Container>
                  ) : null}
                  {createdShare?.error ? (
                    <Text color="error">{createdShare.error}</Text>
                  ) : null}
                </Popover.Content>
              </Popover>
            </Grid>
            <Grid>
              <Switch
                checked={shouldListImages}
                onChange={handleToggleListImages}
              />
            </Grid>
            <Grid>
              <Text>加载当前目录中的图片列表</Text>
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
      <Spacer y={0.5} />
    </>
  );

  const table = (
    <Col span={selectedImage ? 6 : 12}>
      <Table
        selectionMode="single"
        style={{
          width: "100%",
        }}
        onSelectionChange={handleSelectionChange}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === "actions"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body
          items={[
            {
              name: "..",
              path: prevRoute?.path ?? "/",
              isFolder: true,
              isPrev: true,
            } as RowItem,
          ].concat(rowItems)}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <Table.Row key={item.path} css={{ width: "100%" }}>
              {(columnKey: "name") => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          total={totalPages}
          shadow
          noMargin
          align="center"
          rowsPerPage={ROW_PER_PAGE}
        />
      </Table>
    </Col>
  );

  const preview = (
    <Col span={selectedImage ? 6 : 0}>
      {selectedImage && shouldListImages ? (
        <Col>
          <Card>
            <Card.Header>
              <Col>
                <Text h4>{selectedImage.name}（预览缩略图）</Text>
              </Col>
            </Card.Header>
            <Card.Image
              src={selectedImage.thumb}
              width="100%"
              objectFit="contain"
              height={600}
            />
          </Card>
        </Col>
      ) : null}
    </Col>
  );

  return (
    <>
      {toolbar}
      <Row gap={1}>
        {table}
        {preview}
      </Row>
    </>
  );
}
