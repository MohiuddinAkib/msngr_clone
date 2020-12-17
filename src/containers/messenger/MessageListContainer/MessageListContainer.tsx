import React from "react";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";
import usePrevious from "@hooks/usePrevious";
import useMessenger from "@hooks/useMessenger";
import { MessageBlock } from "@src/data/domain/Message";
import { IUserPresence } from "@src/models/IUserPresence";
import useOtherParticipant from "@hooks/useOtherParticipant";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MessageListComponent from "@src/components/MessageList/MessageListComponent";

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      position: "fixed",
      right: theme.spacing(4),
      bottom: theme.spacing(12),
      zIndex: theme.zIndex.modal,
    },
  })
);

const MessageListContainer = () => {
  const auth = useAuth();
  const router = useRouter();
  const classes = useStyles();
  const messenger = useMessenger();
  const scroller = React.useRef<HTMLDivElement>();
  const [newMessagesCount, setNewMessagesCount] = React.useState(0);
  const [showScrollerBtn, setShowScrollerBtn] = React.useState(false);
  const [newMessageArrived, setNewMessageArrived] = React.useState(false);
  const [messageBlocks, setMessageBlocks] = React.useState<MessageBlock[]>([]);
  const prevMessageBlocks = usePrevious<MessageBlock[]>(messageBlocks);
  const prevMessageBlocksMessagesCount = React.useRef(
    prevMessageBlocks?.length || 0
  );
  const { otherParticipant, otherParticipantLoaded } = useOtherParticipant(
    router.query.conversation_uid as string
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
    return messenger.addConversationMessageListener(
      router.query.conversation_uid as string,
      (msgBlocks) => {
        setMessageBlocks(msgBlocks);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [router.query.conversation_uid]);

  React.useEffect(() => {
    if (newMessageArrived && !isElementInViewport(scroller.current)) {
      setShowScrollerBtn(true);
    } else {
      setShowScrollerBtn(false);
    }
  }, [newMessageArrived]);

  React.useEffect(() => {
    if (messageBlocks.length && prevMessageBlocks.length) {
      const lastMessageBlock = messageBlocks[messageBlocks.length - 1];
      const prevLastMessageBlock =
        prevMessageBlocks[prevMessageBlocks.length - 1];

      if (!lastMessageBlock.isMine && prevLastMessageBlock.isMine) {
        setNewMessageArrived(true);
        setNewMessagesCount(lastMessageBlock.messages.length);
      } else if (
        !lastMessageBlock.isMine &&
        !prevLastMessageBlock.isMine &&
        lastMessageBlock.messages.length !==
          prevLastMessageBlock.messages.length
      ) {
        setNewMessageArrived(true);
        setNewMessagesCount(
          Math.abs(
            lastMessageBlock.messages.length -
              prevMessageBlocksMessagesCount.current
          )
        );
      }
    }
  }, [messageBlocks]);

  function isElementInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /* or $(window).height() */ &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /* or $(window).width() */
    );
  }

  const scrollToBottom = () => {
    scroller.current.scrollIntoView({ behavior: "smooth" });
    const lastMessageBlock = messageBlocks[messageBlocks.length - 1];
    prevMessageBlocksMessagesCount.current = lastMessageBlock.messages.length;
    setNewMessageArrived(false);
  };

  return (
    <Box position={"relative"}>
      <MessageListComponent messageBlocks={messageBlocks} />
      <div ref={scroller}></div>
      {showScrollerBtn && (
        <Badge
          color={"primary"}
          className={classes.fab}
          badgeContent={newMessagesCount}
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            onClick={scrollToBottom}
          >
            <KeyboardArrowDownIcon />
          </Fab>
        </Badge>
      )}
    </Box>
  );
};

export default MessageListContainer;
