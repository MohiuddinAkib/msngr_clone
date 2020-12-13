import React from "react";
import useAuth from "@hooks/useAuth";
import { useAppDispatch } from "@store/configureStore";
import { IParticipant } from "@src/models/IParticipant";
import { IUserMessage } from "@src/models/IUserMessage";
import { IConversation } from "@src/models/IConversation";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { Participant } from "@src/data/domain/Participant";
import { Conversation } from "@src/data/domain/Conversation";
import { Message, MessageBlock } from "@src/data/domain/Message";
import { useFirestore, useFirestoreConnect } from "react-redux-firebase";
import { conversationSlice } from "@store/features/conversation/conversationSlice";

export const MessengerContext = React.createContext<{
  conversations: any;
  selectedConvId: any;
  showProfileMenu: any;
  hideProfileMenu: any;
  openProfileMenu: any;
  selectConversation: any;
  addConversationMessageListener: (
    conversationId: string,
    onConversationMessageSuccess: (messageBlcoks: MessageBlock[]) => void,
    onConversationMessageError: (error: Error) => void
  ) => () => void;
  addAuthConversationsListener: (
    onConversationSuccess: (conversations: Conversation[]) => void,
    onConversationError: (error: Error) => void
  ) => void;
}>({
  conversations: null,
  selectedConvId: null,
  showProfileMenu: null,
  hideProfileMenu: null,
  openProfileMenu: null,
  selectConversation: null,
  addAuthConversationsListener: null,
  addConversationMessageListener: null,
});

const MessengerProvider: React.FC = (props) => {
  const { user: auth } = useAuth();
  const firestore = useFirestore();
  const dispatch = useAppDispatch();

  // Profile related starts
  const [openProfileMenu, setOpenProfileMenu] = React.useState(false);
  // Profile related ends;

  // Conversations related starts
  const [selectedConvId, setSelectedConvId] = React.useState("");

  const [conversations, setConversations] = React.useState<{
    [key: string]: IConversation;
  }>({});
  // Conversations related ends

  useFirestoreConnect({
    collection: COLLECTIONS.users,
  });

  const showProfileMenu = () => {
    setOpenProfileMenu(true);
  };

  const hideProfileMenu = () => {
    setOpenProfileMenu(false);
  };

  const addAuthConversationsListener = (
    onConversationSuccess: (conversations: Conversation[]) => void,
    onConversationError: (error: Error) => void
  ) =>
    firestore
      .collection(COLLECTIONS.conversations)
      .withConverter({
        toFirestore: function (conversation: Conversation) {
          return conversation.raw;
        },
        fromFirestore: function (snapshot, options) {
          const conversation = snapshot.data(options) as IConversation;

          return new Conversation(snapshot.id, conversation);
        },
      })
      // .orderBy("last_activity", "desc")
      .where(COLLECTIONS.participants, "array-contains", auth.uid)
      .where("deleted_at", "==", null)
      .onSnapshot((querySnapshot) => {
        const conversations: Conversation[] = [];

        querySnapshot.forEach((doc) => {
          const conversation = doc.data();

          conversation.setParticipantsDataFetcher(
            (callback: (participants: Participant[]) => void) => {
              firestore
                .collection(
                  `${COLLECTIONS.conversations}/${conversation.id}/${COLLECTIONS.participants}`
                )
                .withConverter({
                  toFirestore: function (participant: Participant) {
                    return participant.raw;
                  },
                  fromFirestore: function (snapshot, options) {
                    const participant = snapshot.data(options) as IParticipant;

                    return new Participant(auth.uid, snapshot.id, participant);
                  },
                })
                .get()
                .then((querySnapshot) => {
                  const participants: Participant[] = [];

                  querySnapshot.forEach((doc) => {
                    participants.push(doc.data());
                  });

                  callback(participants);
                });
            }
          );

          conversation.setLastMessageObserver((onSuccess, onError) =>
            firestore
              .collection(
                `${COLLECTIONS.conversations}/${conversation.id}/${COLLECTIONS.messages}`
              )
              .withConverter({
                toFirestore: function (message: Message) {
                  return message.raw;
                },
                fromFirestore: function (snapshot, options) {
                  const message = snapshot.data(options) as IUserMessage;
                  return new Message(auth.uid, snapshot.id, message);
                },
              })
              .orderBy("created_at", "desc")
              .limit(1)
              .onSnapshot((querySnapshot) => {
                const messages = [];
                querySnapshot.forEach((message) => {
                  messages.push(message.data());
                });
                onSuccess(messages[0]);
              }, onError)
          );

          conversations.push(conversation);
        });

        onConversationSuccess(conversations);
      }, onConversationError);

  const addConversationMessageListener = (
    conversationId: string,
    onConversationMessageSuccess: (messageBlcoks: MessageBlock[]) => void,
    onConversationMessageError: (error: Error) => void
  ) => {
    return firestore
      .collection(`${COLLECTIONS.conversations}/${conversationId}/messages`)
      .where("deleted_at", "==", null)
      .withConverter({
        toFirestore: function (message: Message) {
          return message.raw;
        },
        fromFirestore: function (snapshot, options) {
          const message = snapshot.data(options) as IUserMessage;

          return new Message(auth.uid, snapshot.id, message);
        },
      })
      .orderBy("created_at", "asc")
      .onSnapshot((querySnapshot) => {
        const messageBlocks: MessageBlock[] = [];

        let matched = 0;
        let counter = 0;
        let last_index = 0;
        let last_sender = "";

        querySnapshot.forEach((doc) => {
          const message = doc.data();
          const key = message.id;

          const currentConversationMessage = message;

          if (currentConversationMessage.sender_id === last_sender) {
            const messageBlock = messageBlocks[last_index - matched];
            messageBlock.messages.push(message);
            matched++;
          } else {
            const messageBlock = new MessageBlock(key, [message]);
            messageBlocks.push(messageBlock);
          }

          last_index = counter;
          last_sender = currentConversationMessage.sender_id;
          counter++;
        });

        onConversationMessageSuccess(messageBlocks);
      }, onConversationMessageError);
  };

  const selectConversation = (convId: string) => {
    dispatch(conversationSlice.actions.selectConversation(convId));
  };

  return (
    <MessengerContext.Provider
      value={{
        conversations,
        selectedConvId,
        openProfileMenu,
        showProfileMenu,
        hideProfileMenu,
        selectConversation,
        addAuthConversationsListener,
        addConversationMessageListener,
      }}
    >
      {props.children}
    </MessengerContext.Provider>
  );
};

export default MessengerProvider;
