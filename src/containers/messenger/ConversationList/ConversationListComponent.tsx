import React from "react";
import List from "@material-ui/core/List";
import {Conversation} from "@store/rootReducer";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import {isEmpty, isLoaded} from "react-redux-firebase";
import {MessengerContext} from "@src/context/messenger";
import ListSubheader from "@material-ui/core/ListSubheader";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ConversationItemComponent from "@components/messenger/convesation/Item";

const useStyles = makeStyles(theme => createStyles({
    textFieldRoot: {
        padding: theme.spacing(0, 1)
    },
    inputRoot: {
        borderRadius: theme.spacing(3)
    },
    textFieldNativeInput: {
        padding: theme.spacing()
    }
}))

const ConversationListComponent: React.FC = () => {
    const classes = useStyles()
    const messengerContext = React.useContext(MessengerContext)

    const items = (isLoaded(messengerContext.conversations) && !isEmpty(messengerContext.conversations)) && Object
        .entries(messengerContext.conversations as { [key: string]: Conversation })
        .map(([key, conversation]) => (
            <ConversationItemComponent
                key={key}
                conversationId={key}
                conversation={conversation}
            />
        ))

    return (
        <List
            subheader={
                <ListSubheader
                    disableSticky
                    disableGutters>
                    <TextField
                        fullWidth
                        margin={"dense"}
                        variant={"outlined"}
                        classes={{root: classes.textFieldRoot}}
                        InputProps={{
                            classes: {root: classes.inputRoot, input: classes.textFieldNativeInput},
                            startAdornment: (
                                <InputAdornment
                                    position={"start"}
                                >
                                    <IconButton>
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            ),

                        }}
                        placeholder={"Search in Index"}
                    />

                </ListSubheader>
            }>
            {items}
        </List>
    );
};

export default ConversationListComponent;
