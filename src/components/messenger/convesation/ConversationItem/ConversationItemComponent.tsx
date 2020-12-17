import React from "react";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import ListItem from "@material-ui/core/ListItem";
import { Message } from "@src/data/domain/Message";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { IUserPresence } from "@src/models/IUserPresence";
import ListItemText from "@material-ui/core/ListItemText";
import useOtherParticipant from "@hooks/useOtherParticipant";
import { Conversation } from "@src/data/domain/Conversation";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  SwipeableListItem,
  ISwipeableListItemProps,
} from "@sandstreamdev/react-swipeable-list";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { useSelector } from "react-redux";
import { RootState } from "@store/configureStore";

const useStyles = makeStyles((theme) =>
  createStyles({
    skeleton: {},
    avatar: {
      height: 50,
      width: 50,
    },
  })
);

interface IProps extends ISwipeableListItemProps {
  loading?: boolean;
  selected?: boolean;
  conversation: Conversation;
  onConversationClicked: (conversationId: string) => void;
}

const ConversationItemComponent: React.FC<IProps> = (props) => {
  const auth = useAuth();
  const classes = useStyles();

  const [blockSwipe, setBlockSwipe] = React.useState(false);
  const [lastMsg, setLastMsg] = React.useState<Message>(null);

  const { otherParticipant, otherParticipantLoaded } = useOtherParticipant(
    props.conversation
  );
  const [
    otherParticipantPresence,
    setOtherParticipantPresence,
  ] = React.useState<IUserPresence>(null);

  React.useEffect(() => {
    if (otherParticipantLoaded && auth.presenceLoaded) {
      const presence = auth.presence[otherParticipant.id];
      setOtherParticipantPresence(presence);
    }
  }, [otherParticipant, otherParticipantLoaded, auth.presence]);

  React.useEffect(() => {
    console.log("presence in conv item", otherParticipantPresence);
  }, [otherParticipantPresence]);

  React.useEffect(() => {
    props.conversation.addLastMessageListener(
      (msg) => {
        setLastMsg(msg);
      },
      () => {}
    );

    return () => {
      props.conversation.removeLastMessageListener();
    };
  }, []);

  const handleClick = () => {
    props.onConversationClicked(props.conversation.id);
  };

  return (
    <SwipeableListItem
      threshold={props.threshold}
      swipeLeft={props.swipeLeft}
      swipeRight={props.swipeRight}
      onSwipeEnd={props.onSwipeEnd}
      blockSwipe={props.blockSwipe}
      onSwipeStart={props.onSwipeStart}
      onSwipeProgress={props.onSwipeProgress}
      swipeStartThreshold={props.swipeStartThreshold}
      scrollStartThreshold={props.scrollStartThreshold}
    >
      <Link
        passHref
        href={"/messages/[conversation_uid]"}
        as={`/messages/${props.conversation.id}`}
      >
        <ListItem
          button
          divider
          component={"a"}
          onClick={handleClick}
          selected={props.selected}
        >
          {!props.conversation.lastMessageLoaded || !otherParticipantLoaded ? (
            <Box width={"100%"} display={"flex"}>
              <Box mr={1}>
                <Skeleton variant="circle">
                  <Avatar className={classes.avatar} />
                </Skeleton>
              </Box>

              <Box flex={1}>
                <Skeleton width={"85%"}>
                  <Typography>.</Typography>
                </Skeleton>

                <Skeleton width={"50%"}>
                  <Typography>.</Typography>
                </Skeleton>
              </Box>
            </Box>
          ) : (
            <>
              <ListItemAvatar>
                <Box mr={2}>
                  <Badge
                    variant="dot"
                    overlap="circle"
                    color={
                      otherParticipantPresence?.state === "online"
                        ? "primary"
                        : otherParticipantPresence?.state === "away"
                        ? "secondary"
                        : "error"
                    }
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <Avatar
                      alt={"john doe"}
                      className={classes.avatar}
                      src={"https://picsum.photos/200/300?random=1"}
                    />
                  </Badge>
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  props.conversation.isGroupType
                    ? props.conversation.title
                    : otherParticipant.nickname
                }
                secondary={
                  props.conversation.lastMessageLoaded && (
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        color="textPrimary"
                      >
                        {lastMsg.isTextType
                          ? lastMsg.messageContent
                          : `You sent a ${lastMsg.isGifType ? "Gif" : "File"}`}
                      </Typography>
                      {` - ${lastMsg.created_at_fcalendar}`}
                    </>
                  )
                }
              />

              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="options">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </>
          )}
        </ListItem>
      </Link>
    </SwipeableListItem>
  );
};

ConversationItemComponent.defaultProps = {
  selected: false,
  loading: false,
};

export default ConversationItemComponent;
