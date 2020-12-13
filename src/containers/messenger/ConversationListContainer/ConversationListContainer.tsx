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

  return <ConversationListComponent conversations={conversations} />;
};

export default ConversationListContainer;
