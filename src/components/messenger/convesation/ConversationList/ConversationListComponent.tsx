import React from "react";
import List from "@material-ui/core/List";
import { Message } from "@src/data/domain/Message";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import { Scrollbars } from "react-custom-scrollbars";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Conversation } from "@src/data/domain/Conversation";
import InputAdornment from "@material-ui/core/InputAdornment";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ConversationItemComponent from "@components/messenger/convesation/ConversationItem";
import {
  SwipeableList,
  ISwipeableListProps,
  ISwipeableListItemProps,
} from "@sandstreamdev/react-swipeable-list";

const useStyles = makeStyles((theme) =>
  createStyles({
    conversationList: {
      height: "100%",
    },
    textFieldRoot: {
      padding: theme.spacing(0, 1),
    },
    inputRoot: {
      borderRadius: theme.spacing(3),
    },
    textFieldNativeInput: {
      padding: theme.spacing(),
    },
  })
);

interface IProps extends ISwipeableListProps, ISwipeableListItemProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onConversationClicked: (conversationId: string) => void;
}

const ConversationListComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();

  const items = React.useMemo(
    () =>
      props.conversations.map((conversation, i) => {
        return (
          <ConversationItemComponent
            key={conversation.id}
            conversation={conversation}
            threshold={props.threshold}
            swipeLeft={props.swipeLeft}
            swipeRight={props.swipeRight}
            onSwipeEnd={props.onSwipeEnd}
            blockSwipe={props.blockSwipe}
            onSwipeStart={props.onSwipeStart}
            onSwipeProgress={props.onSwipeProgress}
            swipeStartThreshold={props.swipeStartThreshold}
            scrollStartThreshold={props.scrollStartThreshold}
            onConversationClicked={props.onConversationClicked}
            selected={conversation.id === props.selectedConversationId}
          />
        );
      }),
    [props.conversations, props.selectedConversationId]
  );

  return (
    <List
      component={"div"}
      subheader={
        <ListSubheader disableSticky disableGutters component={"div"}>
          <TextField
            fullWidth
            margin={"dense"}
            variant={"outlined"}
            classes={{ root: classes.textFieldRoot }}
            InputProps={{
              classes: {
                root: classes.inputRoot,
                input: classes.textFieldNativeInput,
              },
              startAdornment: (
                <InputAdornment position={"start"}>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            placeholder={"Search in Index"}
          />
        </ListSubheader>
      }
      className={classes.conversationList}
    >
      <Scrollbars
        universal
        style={{
          height: "100%",
        }}
      >
        <SwipeableList
          threshold={props.threshold}
          scrollStartThreshold={props.swipeStartThreshold}
          swipeStartThreshold={props.scrollStartThreshold}
        >
          {items}
        </SwipeableList>
      </Scrollbars>
    </List>
  );
};

export default ConversationListComponent;
