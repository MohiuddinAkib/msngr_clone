import React from "react";
import { useRouter } from "next/router";
import useMessenger from "@hooks/useMessenger";
import { MessageBlock } from "@src/data/domain/Message";
import MessageListComponent from "../../../components/MessageList/MessageListComponent";

const MessageListContainer = () => {
  const router = useRouter();
  const messenger = useMessenger();
  const [messageBlocks, setMessageBlcoks] = React.useState<MessageBlock[]>([]);

  React.useEffect(() => {
    return messenger.addConversationMessageListener(
      router.query.conversation_uid as string,
      (msgBlocks) => {
        setMessageBlcoks(msgBlocks);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [router.query.conversation_uid]);

  return <MessageListComponent messageBlocks={messageBlocks} />;
};

export default MessageListContainer;
