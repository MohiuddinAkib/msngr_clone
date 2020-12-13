import React from "react";
import Head from "next/head";
import useApp from "@hooks/useApp";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout, {
  Root,
  getHeader,
  getFullscreen,
  getSidebarTrigger,
} from "@mui-treasury/layout";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ActionBtnsComponent from "@components/messenger/header/main/ActionBtns";

const scheme = Layout();
const Header = getHeader(styled);
const Fullscreen = getFullscreen(styled);
const SidebarTrigger = getSidebarTrigger(styled);

scheme.configureHeader((builder) => {
  builder.registerConfig("xs", {
    position: "absolute",
    clipped: false,
  });
});

scheme.configureEdgeSidebar((builder) => {
  builder
    .create("right_sidebar", { anchor: "right" })
    .registerTemporaryConfig("xs", {
      width: "100%",
    });

  builder.hide("right_sidebar", ["md", "lg", "xl"]);
});

scheme.configureEdgeSidebar((builder) => {
  builder
    .create("left_sidebar", {
      anchor: "left",
    })
    .registerPermanentConfig("xs", {
      width: "100vw",
      collapsible: false,
      autoExpanded: true,
    });

  builder.hide("left_sidebar", ["md", "lg", "xl"]);
});

const MobileLayout: React.FC = (props) => {
  const app = useApp();

  return (
    <Fullscreen>
      <Head>
        <title>Messenger</title>
      </Head>

      <Root scheme={scheme} theme={app.theme}>
        <CssBaseline />
        <Header
          elevation={1}
          // className={classes.appBar}
        >
          <Toolbar>
            <Grid container alignItems={"center"} justify={"space-between"}>
              <Grid item>
                <Hidden lgUp>
                  <IconButton>
                    <ArrowBackIcon />
                  </IconButton>

                  <SidebarTrigger color={"primary"} sidebarId={"right_sidebar"}>
                    {({ open, anchor }) => {
                      return (
                        <Avatar
                          alt={"john doe"}
                          src={
                            "https://picsum.photos/200/300?grayscale&random=2"
                          }
                        />
                      );
                    }}
                  </SidebarTrigger>
                </Hidden>

                <Hidden smDown>
                  <Avatar
                    alt={"john doe"}
                    src={"https://picsum.photos/200/300?grayscale&random=2"}
                  />
                </Hidden>
              </Grid>

              <Grid item>
                <ActionBtnsComponent />
              </Grid>
            </Grid>
          </Toolbar>
        </Header>

        {props.children}
      </Root>
    </Fullscreen>
  );
};

export default MobileLayout;
