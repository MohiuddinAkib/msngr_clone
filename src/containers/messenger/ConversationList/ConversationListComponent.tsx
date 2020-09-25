import React from "react";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {COLLECTIONS} from "@config/firebase";
import {isLoaded} from "react-redux-firebase";
import {Conversation} from "@store/rootReducer";
import {RootState} from "@store/configureStore";
import Skeleton from "@material-ui/lab/Skeleton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ListItemComponent from "@components/messenger/convesation/ListItem";

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
    const conversations = useSelector<RootState, { [key: string]: Conversation }>(state => state.firestore.data[COLLECTIONS.conversations])

    const items = isLoaded(conversations) && Object
        .entries(conversations)
        .map(([key, conversation]) => (
            <ListItemComponent
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