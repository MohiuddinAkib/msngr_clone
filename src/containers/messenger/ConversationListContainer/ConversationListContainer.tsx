import React from "react";
import useMessenger from "@hooks/useMessenger";
import ConversationListComponent from "@components/messenger/convesation/ConversationList/ConversationListComponent";

const ConversationListContainer: React.FC = (props) => {
  const messenger = useMessenger();
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
      conversations={conversations}
      onConversationClicked={conversationClickHandler}
      selectedConversationId={messenger.selectedConvId}
    />
  );
};

export default ConversationListContainer;
