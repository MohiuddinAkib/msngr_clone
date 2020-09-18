import React from "react";
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {RootState} from "@store/configureStore";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import {useErrorHandler} from "react-error-boundary";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ListItemComponent from "@components/messenger/convesation/ListItem";
import {FirebaseReducer, useFirestore, useFirestoreConnect} from "react-redux-firebase";
import {Participant} from "@store/rootReducer";

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
    const firestore = useFirestore()
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)

    useFirestoreConnect([
        {
            collection: "participants",
            where: ["users_id", "==", firestore.doc(`users/${auth.uid}`)]
        }
    ])

    return (
        <List subheader={
            <ListSubheader disableSticky disableGutters>
                <TextField
                    fullWidth
                    margin={"dense"}
                    variant={"outlined"}
                    classes={{root: classes.textFieldRoot}}
                    InputProps={{
                        classes: {root: classes.inputRoot, input: classes.textFieldNativeInput},
                        startAdornment: (
                            <InputAdornment position={"start"}>
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
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
            <ListItemComponent/>
        </List>
    );
};

export default ConversationListComponent;