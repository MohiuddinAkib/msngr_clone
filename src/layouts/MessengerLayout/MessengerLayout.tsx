import React from "react";
import Head from "next/head";
import useApp from "@hooks/useApp";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout, { Root, getFullscreen } from "@mui-treasury/layout";

const Fullscreen = getFullscreen(styled);

const MessengerLayout: React.FC = (props) => {
  const app = useApp();

  const scheme = Layout();
  scheme.configureHeader((builder) => {
    builder.registerConfig("xs", {
      position: "relative",
      clipped: false,
    });

    builder.registerConfig("md", {
      initialHeight: 64,
      position: "relative",
    });
  });

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create("right_sidebar", { anchor: "right" })
      .registerTemporaryConfig("xs", {
        width: "100vw",
      });
  });

  scheme.configureEdgeSidebar((builder) => {
    builder
      .create("right_sidebar", { anchor: "right" })
      .registerPersistentConfig("md", {
        width: 300,
        collapsible: true,
        autoExpanded: true,
        headerMagnetEnabled: true,
        persistentBehavior: "fit",
      })
      .registerPersistentConfig("lg", {
        width: 360,
        collapsible: true,
        autoExpanded: true,
        headerMagnetEnabled: true,
        persistentBehavior: "fit",
      })
      .registerPersistentConfig("xl", {
        width: 420,
        collapsible: true,
        autoExpanded: true,
        headerMagnetEnabled: true,
        persistentBehavior: "fit",
      });

    builder
      .create("left_sidebar", {
        anchor: "left",
      })
      .registerTemporaryConfig("xs", {
        width: "100vw",
      })
      .registerPermanentConfig("md", {
        width: 300,
        collapsible: false,
        autoExpanded: true,
      })
      .registerPermanentConfig("lg", {
        width: "25vw",
        collapsible: false,
        autoExpanded: true,
      })
      .registerPermanentConfig("xl", {
        width: 420,
        collapsible: false,
        autoExpanded: true,
      });
  });

  return (
    <Fullscreen>
      <Head>
        <title>Messenger</title>
      </Head>

      <Root scheme={scheme} theme={app.theme}>
        <CssBaseline />
        {props.children}
      </Root>
    </Fullscreen>
  );
};

export default MessengerLayout;
