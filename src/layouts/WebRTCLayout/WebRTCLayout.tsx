import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Layout, { Root, getContent, getFullscreen } from "@mui-treasury/layout";

const Content = getContent(styled);
const Fullscreen = getFullscreen(styled);

const WebRTCLayout: React.FC = (props) => {
  const scheme = Layout();

  scheme.configureHeader((builder) => {});
  scheme.configureSubheader((builder) => {});
  scheme.configureInsetSidebar((builder) => {});
  scheme.configureInsetSidebar((builder) => {});

  return (
    <Fullscreen>
      <Root scheme={scheme}>
        <Content>
          <Container fixed>{props.children}</Container>
        </Content>
      </Root>
    </Fullscreen>
  );
};

export default WebRTCLayout;
