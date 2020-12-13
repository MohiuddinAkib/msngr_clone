import React from "react";
import { useRouter } from "next/router";
import List from "@material-ui/core/List";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Conversation } from "@src/data/domain/Conversation";
import InputAdornment from "@material-ui/core/InputAdornment";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ConversationItemComponent from "@components/messenger/convesation/ConversationItem";

const useStyles = makeStyles((theme) =>
  createStyles({
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

interface IProps {
  conversations: Conversation[];
}

const ConversationListComponent: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const router = useRouter();

  const onConversationClickHandler = () => {};

  const items = props.conversations.map((conversation) => (
    <ConversationItemComponent
      key={conversation.id}
      conversation={conversation}
      onConversationClicked={onConversationClickHandler}
      selected={conversation.id === router.query.conversation_uid}
    />
  ));

  return (
    <List
      subheader={
        <ListSubheader disableSticky disableGutters>
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
    >
      {items}
    </List>
  );
};

export default ConversationListComponent;
