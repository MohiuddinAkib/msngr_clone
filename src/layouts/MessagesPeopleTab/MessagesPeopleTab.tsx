import React from "react";
import propTypes from "prop-types";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import ChatIcon from "@material-ui/icons/Chat";
import useMessenger from "@hooks/useMessenger";
import PeopleIcon from "@material-ui/icons/People";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListDrawerHeaderComponent from "@components/messenger/convesation/ConversationListDrawerHeader";

const MessagesPeopleTab: React.FC<{ initialView?: number }> = (props) => {
  const theme = useTheme();
  const router = useRouter();
  const messenger = useMessenger();
  const pc = useMediaQuery(theme.breakpoints.up("md"));
  const [trigger, setTrigger] = React.useState(false);
  const [view, setView] = React.useState(props.initialView);

  const handleNativeScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setTrigger(event.currentTarget.scrollTop > 1 ? true : false);
  };

  const handleViewNavigation = (event: React.ChangeEvent, newValue: number) => {
    setView(newValue);
  };

  React.useEffect(() => {
    if (view === 0) {
      router.replace(
        {
          pathname: "/messages",
        },
        "messages"
      );
    }

    if (view === 1) {
      router.replace(
        {
          pathname: "/people",
        },
        "people"
      );
    }
  }, [view]);

  React.useEffect(() => {
    if (pc) {
      (async () => {
        const conversationId = await messenger.getSelectedConversationIdOrFetchFromDb();
        router.replace(
          "/messages/[conversation_uid]",
          `/messages/${conversationId}`
        );
      })();
    }
  }, [pc]);

  if (pc) {
    return <div>Loading....</div>;
  }

  return (
    !pc && (
      <Box
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        onScroll={handleNativeScroll}
      >
        <ListDrawerHeaderComponent trigger={trigger} />
        <Box height={"100%"}>{props.children}</Box>

        <Hidden lgUp>
          <Box zIndex={2}>
            <BottomNavigation value={view} onChange={handleViewNavigation}>
              <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
              <BottomNavigationAction label="People" icon={<PeopleIcon />} />
            </BottomNavigation>
          </Box>
        </Hidden>
      </Box>
    )
  );
};

MessagesPeopleTab.defaultProps = {
  initialView: 0,
};

MessagesPeopleTab.propTypes = {
  initialView: propTypes.number,
};

export default MessagesPeopleTab;
