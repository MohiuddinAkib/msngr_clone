import React from "react";
import List from "@material-ui/core/List";
import Popover from "@material-ui/core/Popover";
import { MessageBlock } from "@src/data/domain/Message";
import MessageListItemComponent from "../MessageListItem/MessageListItemComponent";
import { bindPopover, usePopupState } from "material-ui-popup-state/hooks";

interface IProps {
  messageBlocks: MessageBlock[];
}

const MessageListComponent: React.FC<IProps> = (props) => {
  const reactionPopup = usePopupState({
    variant: "popover",
    popupId: "msg-reaction-popover",
  });

  return (
    <>
      <List>
        {props.messageBlocks.map((eachMessageBlock, i) => (
          <MessageListItemComponent
            key={i}
            messages={eachMessageBlock.messages}
          />
        ))}
      </List>
      <Popover
        {...bindPopover(reactionPopup)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        This is popover content
      </Popover>
    </>
  );
};

export default MessageListComponent;
