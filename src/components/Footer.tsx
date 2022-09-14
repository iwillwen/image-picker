import React from "react";
import {
  Row,
  Col,
  Grid,
  Text,
  Avatar,
  Popover,
  Image,
  Link,
} from "@nextui-org/react";

function Footer() {
  return (
    <Row justify="center">
      <Col span={10} css={{ textAlign: "center", padding: "$15" }}>
        <Grid.Container
          direction="row"
          gap={0.5}
          alignItems="center"
          justify="center"
        >
          <Grid>
            <Text>CREATED BY</Text>
          </Grid>
          <Grid>
            <Popover placement="top">
              <Popover.Trigger>
                <Avatar
                  bordered
                  pointer="true"
                  color="gradient"
                  text="Wen"
                  size="md"
                  src="https://photo-picker-thumbnail.oss-cn-shanghai.aliyuncs.com/wen-avatar.png"
                />
              </Popover.Trigger>
              <Popover.Content>
                <div style={{ padding: "1rem 1.5rem" }}>
                  <Text>
                    该项目已开源并保证
                    <Text b>永久免费且绝不长期存储用户信息</Text>。
                    <a
                      href="https://github.com/iwillwen/image-picker"
                      target="_blank"
                    >
                      <img
                        alt="GitHub stars"
                        src="https://img.shields.io/github/stars/iwillwen/image-picker?style=social"
                      />
                    </a>
                  </Text>
                  <Text>
                    如果希望与我取得联系，可以扫描下面的二维码添加微信哦~
                  </Text>
                  <Text>
                    由于使用服务也是会产生一些费用的，如果可以的话欢迎给我一点小小的赞助，不胜感激！
                  </Text>
                  <Image
                    src="https://photo-picker-thumbnail.oss-cn-shanghai.aliyuncs.com/wen-wechat.jpeg"
                    width="150px"
                  />
                </div>
              </Popover.Content>
            </Popover>
          </Grid>
          <Grid>
            <Text>阿问</Text>
          </Grid>
          <Grid>
            <Text css={{ color: "#DFE3E6" }}>-</Text>
          </Grid>
          <Grid>
            <Link href="https://beian.miit.gov.cn/" target="_blank">
              浙ICP备2022026794号
            </Link>
          </Grid>
        </Grid.Container>
      </Col>
    </Row>
  );
}

export default Footer;
