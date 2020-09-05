import React from "react";
import propTypes from "prop-types"
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {createStyles, makeStyles} from "@material-ui/core/styles";

interface Props {
    trigger: boolean
}

const useStyles = makeStyles(theme => createStyles({
    title: {
        fontWeight: "bold"
    },
    actionsContainer: {
        textAlign: "right"
    }
}))

const ConversationListDrawerHeaderComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const classes = useStyles()
    const atMdAndLg = useMediaQuery(theme.breakpoints.between("md", "lg"))

    return (
        <>
            <AppBar position={"absolute"} elevation={props.trigger ? 1 : 0} color={"inherit"}>
                <Toolbar>
                    <Grid container justify={"space-between"} alignItems={"center"}>
                        <Grid item container md={6} spacing={2} alignItems={"center"}>
                            <Grid item>
                                <Avatar
                                    sizes={"large"}
                                    alt={"john doe"}
                                    src={"https://picsum.photos/200/300?grayscale&random=2"}/>
                            </Grid>
                            <Grid item>
                                <Typography variant={atMdAndLg ? "h6" : "h4"}
                                            className={classes.title}>Chats</Typography>
                            </Grid>
                        </Grid>
                        <Grid item md={6} className={classes.actionsContainer}>
                            <IconButton>
                                <SettingsIcon fontSize={!atMdAndLg ? "large" : "small"}/>
                            </IconButton>

                            <IconButton>
                                <CreateIcon fontSize={!atMdAndLg ? "large" : "small"}/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </>
    );
};

ConversationListDrawerHeaderComponent.propTypes = {
    trigger: propTypes.bool.isRequired
}

export default ConversationListDrawerHeaderComponent;