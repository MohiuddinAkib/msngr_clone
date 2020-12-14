import React from "react";
import styled from "styled-components";
import { getDrawerSidebar } from "@mui-treasury/layout";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ConversationListContainer from "@containers/messenger/ConversationListContainer";
import ListDrawerHeaderComponent from "@components/messenger/convesation/ConversationListDrawerHeader";

const DrawerSidebar = getDrawerSidebar(styled);

const useStyles = makeStyles((theme) =>
  createStyles({
    drawerPaperRoot: {
      overflowY: "hidden",
      [theme.breakpoints.up("lg")]: {
        maxWidth: 420,
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "100vw",
      },
    },
    title: {
      fontWeight: "bold",
    },
    actionsContainer: {
      textAlign: "right",
    },
  })
);

const ConversationListDrawerComponent: React.FC = (props) => {
  const classes = useStyles();
  const [trigger, setTrigger] = React.useState(false);

  const handleDrawerScroll = (
    event: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const scrollTop = (event.target as HTMLDivElement).scrollTop;

    setTrigger(scrollTop > 1 ? true : false);
  };

  return (
    <DrawerSidebar
      sidebarId={"left_sidebar"}
      onScroll={handleDrawerScroll}
      classes={{
        paper: classes.drawerPaperRoot,
      }}
    >
      <ListDrawerHeaderComponent trigger={trigger} />
      <ConversationListContainer />
    </DrawerSidebar>
  );
};

export default ConversationListDrawerComponent;
