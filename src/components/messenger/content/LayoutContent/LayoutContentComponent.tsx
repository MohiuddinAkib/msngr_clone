import React from "react";
import styled from "styled-components";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { getContent } from "@mui-treasury/layout";
import { Scrollbars } from "react-custom-scrollbars";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MessageActionContainerComponent from "@components/messenger/content/ActionContainer";

const Content = getContent(styled);

const useStyles = makeStyles((theme) =>
  createStyles({
    messageHolder: {
      overflowY: "scroll",
    },
  })
);

const LayoutContentComponent: React.FC = (props) => {
  const classes = useStyles();

  return (
    <Content>
      <Grid
        square
        container
        elevation={0}
        component={Card}
        direction={"column"}
      >
        <Grid item flex={1} component={Box}>
          <Scrollbars
            universal
            style={{
              height: "100%",
              overflowY: "hidden",
            }}
            autoHide
            autoHeight
            autoHeightMin={"100%"}
          >
            <CardContent>{props.children}</CardContent>
          </Scrollbars>
        </Grid>

        <Grid item component={CardActions}>
          <MessageActionContainerComponent />
        </Grid>
      </Grid>
    </Content>
  );
};

export default LayoutContentComponent;
