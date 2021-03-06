import React from "react";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import IGif from "@giphy/js-types/dist/gif";
import { IUserMessage } from "@src/models/IUserMessage";
import * as StorageTypes from "@firebase/storage-types";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { Conversation } from "@src/data/firestoreClient/domain/Conversation";
import { RootState, useAppDispatch } from "@store/configureStore";
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import {
  conversationSlice,
  userMessageIdsSelector,
  loadNewConversationData,
  loadAuthConversationsData,
  userConversationIdsSelector,
  selectedConversationSelector,
  conversationsLoadingSelector,
  userConversationsArrayConvertedSelector,
  userConversationsMapConvertedSelector,
} from "@store/features/conversation/conversationSlice";

export const MessengerContext = React.createContext<{
  conversationsMap: Record<string, Conversation>;
  conversationsArray: Conversation[];
  conversationsLoading: boolean;
  selectedConvId: string;
  openProfileMenu: boolean;
  showProfileMenu: () => void;
  hideProfileMenu: () => void;
  selectConversation: (conversationId: string) => void;
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
  handleSendGifMsg: (conversationId: string, gif: IGif) => Promise<any>;
  handleSendTextMsg: (conversationId: string, text: string) => Promise<any>;
  updateConversationActivity: (conversationDocId: string) => Promise<void>;
  getSelectedConversationId: () => string;
  getConversationById: (conversationId: string) => Conversation;
  selectedConversation: Conversation;
}>({
  conversationsMap: {},
  conversationsArray: [],
  conversationsLoading: false,
  selectedConvId: null,
  showProfileMenu: null,
  hideProfileMenu: null,
  openProfileMenu: null,
  selectConversation: null,
  handleSendAudioMessage: null,
  handleSendVideoMessage: null,
  handleSendScreenshotMessage: null,
  handleSendGifMsg: null,
  handleSendTextMsg: null,
  updateConversationActivity: null,
  getSelectedConversationId: null,
  getConversationById: null,
  selectedConversation: null,
});

const MessengerProvider: React.FC = (props) => {
  const router = useRouter();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useAppDispatch();
  const { user: auth, authenticated } = useAuth();
  const conversationsLoading = useSelector(conversationsLoadingSelector);
  const conversationsMap = useSelector(userConversationsMapConvertedSelector);
  const conversationsArray = useSelector(
    userConversationsArrayConvertedSelector
  );
  const userMessageIds = useSelector(userMessageIdsSelector);
  const userConversationIds = useSelector(userConversationIdsSelector);
  const selectedConversation = useSelector(selectedConversationSelector);

  // Profile related starts
  const [openProfileMenu, setOpenProfileMenu] = React.useState(false);
  // Profile related ends;

  // Conversations related starts
  const selectedConvId = useSelector<RootState, string>(
    (state) => state.conversation.selectedConvId
  );
  // Conversations related ends

  useFirestoreConnect([
    {
      collection: COLLECTIONS.users,
    },
  ]);

  React.useEffect(() => {
    dispatch(
      conversationSlice.actions.selectConversation(
        localStorage.getItem("conversation_uid") ||
          (router.query.conversation_uid as string) ||
          ""
      )
    );
  }, []);

  React.useEffect(() => {
    if (authenticated && !conversationsArray.length) {
      dispatch(loadAuthConversationsData());
    }
  }, [authenticated, conversationsArray]);

  // TODO: listen for conversation and add to store if does not exist in the store already
  React.useEffect(() => {
    if (!conversationsLoading) {
      return firestore
        .collectionGroup(COLLECTIONS.conversations)
        .where("deleted_at", "==", null)
        .where(COLLECTIONS.participants, "array-contains", auth.uid)
        .orderBy("created_at", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            switch (change.type) {
              case "added":
                const conversationId = change.doc.id;
                dispatch(loadNewConversationData(conversationId));
                break;

              case "modified":
                break;

              case "removed":
                break;

              default:
                break;
            }
          });
        });
    }
  }, [conversationsLoading]);

  React.useEffect(() => {
    if (!conversationsLoading) {
      return firestore
        .collectionGroup(COLLECTIONS.messages)
        .where("deleted_at", "==", null)
        .orderBy("created_at", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            switch (change.type) {
              case "added":
                const conversationId = change.doc.ref.parent.parent.id;
                const messageId = change.doc.id;
                if (
                  !userMessageIds.includes(messageId) &&
                  userConversationIds.includes(conversationId)
                ) {
                  dispatch(
                    conversationSlice.actions.storeNewMessage({
                      conversationId,
                      messageId,
                      message: change.doc.data() as IUserMessage,
                    })
                  );
                }

                break;

              case "modified":
                break;

              case "removed":
                break;

              default:
                break;
            }
          });
        });
    }
  }, [conversationsLoading]);

  const showProfileMenu = () => {
    setOpenProfileMenu(true);
  };

  const hideProfileMenu = () => {
    setOpenProfileMenu(false);
  };

  const selectConversation = (conversationId: string) => {
    dispatch(conversationSlice.actions.selectConversation(conversationId));
    localStorage.setItem("conversation_uid", conversationId);
  };

  const getConversationById = (conversationId: string) => {
    return conversationsMap[conversationId];
  };

  const getSelectedConversationId = () => {
    if (!!selectedConvId) {
      return selectedConvId;
    } else {
      return conversationsArray[0].id;
    }
  };

  const updateConversationActivity = async (conversationDocId: string) =>
    firestore
      .collection(COLLECTIONS.conversations)
      .doc(conversationDocId)
      .update({ last_activity: moment().toISOString() });

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
      metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
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

  const handleSendGifMsg = (conversationDocId: string, gif: IGif) =>
    firestore
      .collection(COLLECTIONS.conversations)
      .doc(conversationDocId)
      .collection(COLLECTIONS.messages)
      .add({
        type: "gif",
        message: gif,
        deleted_at: null,
        sender_id: auth.uid,
        created_at: new Date().toISOString(),
      });

  const handleSendTextMsg = (conversationDocId: string, text: string) =>
    firestore
      .collection(COLLECTIONS.conversations)
      .doc(conversationDocId)
      .collection(COLLECTIONS.messages)
      .add({
        type: "text",
        message: text,
        deleted_at: null,
        sender_id: auth.uid,
        created_at: new Date().toISOString(),
      });

  return (
    <MessengerContext.Provider
      value={{
        conversationsMap,
        conversationsArray,
        conversationsLoading,
        selectedConvId,
        openProfileMenu,
        showProfileMenu,
        hideProfileMenu,
        selectConversation,
        handleSendAudioMessage,
        handleSendVideoMessage,
        handleSendScreenshotMessage,
        handleSendGifMsg,
        handleSendTextMsg,
        updateConversationActivity,
        getSelectedConversationId,
        getConversationById,
        selectedConversation,
      }}
    >
      {!conversationsLoading && props.children}
    </MessengerContext.Provider>
  );
};

export default MessengerProvider;
