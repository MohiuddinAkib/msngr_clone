import React from "react";
import propTypes from "prop-types"
import {useRouter} from "next/router";
import Cookies from "universal-cookie"
import {useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Slide from "@material-ui/core/Slide";
import {Profile} from "@store/rootReducer";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import {RootState} from "@store/configureStore";
import ListItem from "@material-ui/core/ListItem";
import Skeleton from '@material-ui/lab/Skeleton';
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import {useErrorHandler} from "react-error-boundary";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import {MessengerContext} from "@src/context/messenger";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import useTheme from "@material-ui/core/styles/useTheme";
import ListItemText from "@material-ui/core/ListItemText";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {TransitionProps} from "@material-ui/core/transitions/transition";
import {FirebaseReducer, isLoaded, useFirebase} from "react-redux-firebase";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

interface Props {
    trigger: boolean
}

const useStyles = makeStyles(theme => createStyles({
    title: {
        fontWeight: "bold"
    },
    actionsContainer: {
        textAlign: "right"
    },
    profileMenuAvatar: {
        marginLeft: "auto",
        marginRight: "auto",
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginBottom: theme.spacing(2),
    },

}))

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide
        direction="up"
        ref={ref}
        {...props}
    />;
});

const ListDrawerHeaderComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const classes = useStyles()
    const firebase = useFirebase()
    const handleError = useErrorHandler()
    const messengerContext = React.useContext(MessengerContext)
    const atMdAndLg = useMediaQuery(theme.breakpoints.between("md", "lg"))
    const [openProfileMenu, setOpenProfileMenu] = React.useState(false)
    const profile = useSelector<RootState, FirebaseReducer.Profile<Profile>>(state => state.firebase.profile)

    const showProfileMenu = () => {
        setOpenProfileMenu(true)
    }

    const hideProfileMenu = () => {
        setOpenProfileMenu(false)
    }

    const handleLogout = async () => {
        const cookies = new Cookies()
        try {
            await firebase.logout()
            cookies.remove("auth")
            router.replace("/login")
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <>
            <AppBar position={"absolute"} elevation={props.trigger ? 1 : 0} color={"inherit"}>
                <Toolbar>
                    <Grid container justify={"space-between"} alignItems={"center"}>
                        <Grid item container xs={6} spacing={2} alignItems={"center"}>
                            <Grid item>
                                <Avatar
                                    sizes={"large"}
                                    alt={"john doe"}
                                    src={"https://picsum.photos/200/300?grayscale&random=2"}
                                    onClick={showProfileMenu}
                                />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant={atMdAndLg ? "h6" : "h4"}
                                    className={classes.title}
                                >
                                    Chats
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            className={classes.actionsContainer}
                        >
                            <IconButton>
                                <SettingsIcon/>
                            </IconButton>

                            <IconButton>
                                <CreateIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar/>

            <Hidden
                lgUp
            >
                <Dialog
                    fullScreen
                    open={openProfileMenu}
                    onClose={hideProfileMenu}
                    TransitionComponent={Transition}
                >
                    <AppBar
                        elevation={0}
                        color={"transparent"}
                    >
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={hideProfileMenu}
                                aria-label="close"
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            <Typography
                                variant="h6"
                            >
                                Me
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar/>

                    <Avatar
                        alt={"john doe"}
                        className={classes.profileMenuAvatar}
                        src={"https://picsum.photos/200/300?grayscale&random=2"}
                    />

                    {!isLoaded(profile) ? <Skeleton variant="text"/> : <Typography
                        variant={"h4"}
                        align={"center"}
                    >
                        {profile.first_name} {profile.last_name}
                    </Typography>}

                    <List>
                        <ListItem
                            button
                            onClick={messengerContext.toggleDarkMode}
                        >
                            <ListItemIcon>
                                <NightsStayIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Dark Mode"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    color="default"
                                    checked={messengerContext.darkMode}
                                    onChange={messengerContext.toggleDarkMode}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>

                    <List
                        subheader={
                            <ListSubheader
                                disableSticky
                            >
                                Profile
                            </ListSubheader>
                        }
                    >
                        <ListItem
                            button
                        >
                            <ListItemIcon
                                color={"primary"}
                            >
                                <FiberManualRecordIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Active Status"
                            />
                        </ListItem>

                        <ListItem
                            button
                        >
                            <ListItemIcon>
                                <AccountCircleIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Edit"
                            />
                        </ListItem>

                        <ListItem
                            button
                            onClick={handleLogout}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                            />
                        </ListItem>
                    </List>
                </Dialog>
            </Hidden>
        </>
    );
};


ListDrawerHeaderComponent.propTypes = {
    trigger: propTypes.bool.isRequired
}

export default ListDrawerHeaderComponent;