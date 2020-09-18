import React from "react";
import List from "@material-ui/core/List";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import InputAdornment from "@material-ui/core/InputAdornment";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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

const PeopleListComponent: React.FC = () => {
    const classes = useStyles()

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
            <ListItem>
                <ListItemText
                    primary={"People one"}
                />
            </ListItem>
        </List>
    );
};

export default PeopleListComponent;