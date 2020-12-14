import React from "react";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { IParticipant } from "@src/models/IParticipant";
import { IUserMessage } from "@src/models/IUserMessage";
import * as StorageTypes from "@firebase/storage-types";
import { IConversation } from "@src/models/IConversation";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { Participant } from "@src/data/domain/Participant";
import { Conversation } from "@src/data/domain/Conversation";
import { Message, MessageBlock } from "@src/data/domain/Message";
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";

export const MessengerContext = React.createContext<{
  conversations: any;
  selectedConvId: string;
  openProfileMenu: boolean;
  showProfileMenu: () => void;
  hideProfileMenu: () => void;
  selectConversation: (conversationId: string) => void;
  addConversationMessageListener: (
    conversationId: string,
    onConversationMessageSuccess: (messageBlcoks: MessageBlock[]) => void,
    onConversationMessageError: (error: Error) => void
  ) => () => void;
  addAuthConversationsListener: (
    onConversationSuccess: (conversations: Conversation[]) => void,
    onConversationError: (error: Error) => void
  ) => void;
  handleSendAudioMessage: (
    path: string,
    recordedBlob: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) => Promise<{
    uploadTaskSnapshot: StorageTypes.UploadTaskSnapshot;
  }>;
  handleSendVideoMessage: (
    path: string,
    recordedBlob: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) => Promise<{
    uploadTaskSnapshot: StorageTypes.UploadTaskSnapshot;
  }>;
  handleSendScreenshotMessage: (
    path: string,
    recordedBlob: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) => Promise<{
    uploadTaskSnapshot: StorageTypes.UploadTaskSnapshot;
  }>;
}>({
  conversations: null,
  selectedConvId: null,
  showProfileMenu: null,
  hideProfileMenu: null,
  openProfileMenu: null,
  selectConversation: null,
  addAuthConversationsListener: null,
  addConversationMessageListener: null,
  handleSendAudioMessage: null,
  handleSendVideoMessage: null,
  handleSendScreenshotMessage: null,
});

const MessengerProvider: React.FC = (props) => {
  const router = useRouter();
  const firebase = useFirebase();
  const { user: auth } = useAuth();
  const firestore = useFirestore();
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
      .orderBy("last_activity", "desc")
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

  const selectConversation = (conversationId: string) => {
    setSelectedConvId(conversationId);
  };

  const handleSendAudioMessage = (
    path: string,
    recordedBlob: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) =>
    firebase.uploadFile(path, recordedBlob, dbPath, {
      metadataFactory: (uploadRes, firebase, meta, downloadURL) => {
        const {
          metadata: {
            fullPath,
            timeCreated,
            updated,
            contentType,
            customMetadata,
            size,
            name,
          },
        } = uploadRes;
        return {
          name,
          size,
          fullPath,
          downloadURL,
          type: "file",
          contentType,
          customMetadata,
          deleted_at: null,
          updated_at: updated,
          sender_id: auth.uid,
          created_at: timeCreated,
        };
      },
      metadata,
      name,
    });

  const handleSendScreenshotMessage = (
    path: string,
    data: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) =>
    firebase.uploadFile(path, data, dbPath, {
      metadataFactory: (uploadRes, firebase1, metadata, downloadURL) => {
        const {
          metadata: {
            fullPath,
            timeCreated,
            updated,
            contentType,
            customMetadata,
            size,
            name,
          },
        } = uploadRes;
        return {
          name,
          size,
          fullPath,
          downloadURL,
          type: "file",
          contentType,
          customMetadata,
          deleted_at: null,
          updated_at: updated,
          sender_id: auth.uid,
          created_at: timeCreated,
        };
      },
      metadata,
      name,
    });

  const handleSendVideoMessage = (
    path: string,
    rcrdBlob: Blob,
    dbPath: string,
    metadata: StorageTypes.UploadMetadata,
    name: string
  ) =>
    firebase.uploadFile(path, rcrdBlob, dbPath, {
      metadataFactory: (uploadRes, firebase, meta, downloadURL) => {
        const {
          metadata: {
            fullPath,
            timeCreated,
            updated,
            contentType,
            customMetadata,
            size,
            name,
          },
        } = uploadRes;
        return {
          name,
          size,
          fullPath,
          downloadURL,
          type: "file",
          contentType,
          customMetadata,
          deleted_at: null,
          updated_at: updated,
          sender_id: auth.uid,
          created_at: timeCreated,
        };
      },
      metadata,
      name,
    });

  return (
    <MessengerContext.Provider
      value={{
        conversations,
        selectedConvId,
        openProfileMenu,
        showProfileMenu,
        hideProfileMenu,
        selectConversation,
        handleSendAudioMessage,
        handleSendVideoMessage,
        handleSendScreenshotMessage,
        addAuthConversationsListener,
        addConversationMessageListener,
      }}
    >
      {props.children}
    </MessengerContext.Provider>
  );
};

export default MessengerProvider;
