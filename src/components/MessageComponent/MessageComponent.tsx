import React from "react";
import { Emoji } from "emoji-mart";
import IGif from "@giphy/js-types/dist/gif";
import { Message } from "@src/data/domain/Message";
import GifMessage from "./GifMessage/GifMessageComponent";
import TextMessage from "./TextMessage/TextMessageComponent";
import FileMessage from "./FileMessage/FileMessageComponent";

interface IProps {
  message: Message;
  isMyMessage?: boolean;
}

const MessageComponent: React.FC<IProps> = (props) => {
  if (props.message.isTextType) {
    const messageContent = props.message.replaceEmojisFromMessageContentWith(
      (emojiData, i) => (
        <Emoji
          native
          key={i}
          size={16}
          set={"facebook"}
          emoji={emojiData}
          skin={emojiData.skin || 1}
        />
      )
    );

    return (
      <TextMessage message={messageContent} isMyMessage={props.isMyMessage} />
    );
  }

  if (props.message.isGifType) {
    return (
      <GifMessage
        isMyMessage={props.isMyMessage}
        messageContent={props.message.messageContent as IGif}
      />
    );
  }

  if (props.message.isFileType) {
    return (
      <FileMessage
        fileAlt={props.message.name}
        key={props.message.created_at}
        isMyMessage={props.isMyMessage}
        fileUrl={props.message.downloadURL}
        fileType={props.message.contentType}
      />
    );
  }

  return null;
};

MessageComponent.defaultProps = {
  isMyMessage: false,
};

export default MessageComponent;
