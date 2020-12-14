import React from "react";
import useMessenger from "@hooks/useMessenger";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConversationListComponent from "@components/messenger/convesation/ConversationList/ConversationListComponent";

const ConversationListContainer: React.FC = (props) => {
  const theme = useTheme();
  const messenger = useMessenger();
  const pc = useMediaQuery(theme.breakpoints.up("md"));
  const [conversations, setConversations] = React.useState([]);

  React.useEffect(() => {
    return messenger.addAuthConversationsListener(
      (convs) => {
        setConversations(convs);
      },
      (error) => {
        alert(
          "auth conversation listener error inside ConversationListContainer"
        );
        console.log(error);
      }
    );
  }, []);

  const conversationClickHandler = (conversationId) => {
    messenger.selectConversation(conversationId);
  };

  return (
    <ConversationListComponent
      blockSwipe={pc}
      conversations={conversations}
      onConversationClicked={conversationClickHandler}
      selectedConversationId={messenger.selectedConvId}
      swipeLeft={{
        content: <div>Revealed content during swipe</div>,
        action: () => console.info("swipe action triggered"),
      }}
      swipeRight={{
        content: <div>Revealed content during swipe</div>,
        action: () => console.info("swipe action triggered"),
      }}
      onSwipeProgress={(progress) =>
        console.info(`Swipe progress: ${progress}%`)
      }
    />
  );
};

export default ConversationListContainer;
