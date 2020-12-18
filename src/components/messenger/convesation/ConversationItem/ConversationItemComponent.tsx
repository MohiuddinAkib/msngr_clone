import React from "react";
import Link from "next/link";
import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import useUserPresence from "@hooks/useUserPresence";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ListItemText from "@material-ui/core/ListItemText";
import { Conversation } from "@src/data/domain/Conversation";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  SwipeableListItem,
  ISwipeableListItemProps,
} from "@sandstreamdev/react-swipeable-list";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

const useStyles = makeStyles((theme) =>
  createStyles({
    skeleton: {},
    avatar: {
      height: 50,
      width: 50,
    },
    listItemContainer: {
      width: "100%",
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
  const classes = useStyles();
  const [blockSwipe, setBlockSwipe] = React.useState(false);
  const chatPartner = useUserPresence(props.conversation.chatPartner.id);

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
          ContainerComponent={"div"}
          ContainerProps={{
            className: classes.listItemContainer,
          }}
        >
          <ListItemAvatar>
            <Box mr={2}>
              <Badge
                variant="dot"
                overlap="circle"
                color={
                  chatPartner?.state === "online"
                    ? "primary"
                    : chatPartner?.state === "away"
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
                : props.conversation.chatPartner.nickname
            }
            secondary={
              <>
                <Typography
                  variant="body2"
                  component="span"
                  color="textPrimary"
                >
                  {props.conversation.lastMessage.isTextType
                    ? props.conversation.lastMessage.messageContent
                    : `You sent a ${
                        props.conversation.lastMessage.isGifType
                          ? "Gif"
                          : "File"
                      }`}
                </Typography>
                {` - ${props.conversation.lastMessage.created_at_fcalendar}`}
              </>
            }
          />

          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="options">
              <MoreHorizIcon />
            </IconButton>
          </ListItemSecondaryAction>
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
