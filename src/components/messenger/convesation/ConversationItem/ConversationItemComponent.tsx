import React from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";
import ListItem from "@material-ui/core/ListItem";
import { Message } from "@src/data/domain/Message";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ListItemText from "@material-ui/core/ListItemText";
import { Participant } from "@src/data/domain/Participant";
import { Conversation } from "@src/data/domain/Conversation";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Link from "next/link";

const useStyles = makeStyles((theme) =>
  createStyles({
    skeleton: {},
    avatar: {
      height: 50,
      width: 50,
    },
  })
);

interface IProps {
  loading?: boolean;
  selected?: boolean;
  conversation: Conversation;
  onConversationClicked: (conversationId: string) => void;
}

const ConversationItemComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const [lastMsg, setLastMsg] = React.useState<Message>(null);
  const [otherParticipant, setOtherParticipant] = React.useState<Participant>(
    null
  );
  const [otherParticipantLoaded, setOtherParticipantLoaded] = React.useState(
    false
  );

  React.useEffect(() => {
    props.conversation.getParticipantsData((participants) => {
      const [otherPerson] = participants.filter(
        (participant) => !participant.isMe
      );

      setOtherParticipant(otherPerson);
      setOtherParticipantLoaded(true);
    });

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
                <Avatar
                  alt={"john doe"}
                  className={classes.avatar}
                  src={"https://picsum.photos/200/300?random=1"}
                />
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
  );
};

ConversationItemComponent.defaultProps = {
  selected: false,
  loading: false,
};

export default ConversationItemComponent;
