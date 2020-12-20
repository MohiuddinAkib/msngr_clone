import React from "react";
import useApp from "@hooks/useApp";
import propTypes from "prop-types";
import useAuth from "@hooks/useAuth";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Slide from "@material-ui/core/Slide";
import Avatar from "@material-ui/core/Avatar";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Switch from "@material-ui/core/Switch";
import useMessenger from "@hooks/useMessenger";
import { isLoaded } from "react-redux-firebase";
import Toolbar from "@material-ui/core/Toolbar";
import Skeleton from "@material-ui/lab/Skeleton";
import ListItem from "@material-ui/core/ListItem";
import CreateIcon from "@material-ui/icons/Create";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import useTheme from "@material-ui/core/styles/useTheme";
import ListItemText from "@material-ui/core/ListItemText";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

interface Props {
  trigger: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      fontWeight: "bold",
    },
    actionsContainer: {
      textAlign: "right",
    },
    profileMenuAvatar: {
      marginLeft: "auto",
      marginRight: "auto",
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginBottom: theme.spacing(2),
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConversationListDrawerHeaderComponent: React.FC<Props> = (props) => {
  const app = useApp();
  const auth = useAuth();
  const theme = useTheme();
  const classes = useStyles();
  const messenger = useMessenger();
  const atMdAndLg = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const handleLogout = () => {
    auth.handleLogout();
  };

  return (
    <>
      <AppBar
        color={"inherit"}
        position={"absolute"}
        elevation={props.trigger ? 1 : 0}
      >
        <Toolbar>
          <Grid container alignItems={"center"} justify={"space-between"}>
            <Grid item xs={6} container spacing={2} alignItems={"center"}>
              <Grid item>
                <Avatar
                  sizes={"large"}
                  alt={"john doe"}
                  onClick={messenger.showProfileMenu}
                  src={"https://picsum.photos/200/300?grayscale&random=2"}
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
            <Grid item xs={6} className={classes.actionsContainer}>
              <IconButton>
                <SettingsIcon />
              </IconButton>

              <IconButton>
                <CreateIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Hidden lgUp>
        <Dialog
          fullScreen
          TransitionComponent={Transition}
          open={messenger.openProfileMenu}
          onClose={messenger.hideProfileMenu}
        >
          <AppBar elevation={0} color={"transparent"}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close"
                onClick={messenger.hideProfileMenu}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6">Me</Typography>
            </Toolbar>
          </AppBar>
          <Toolbar />

          <Avatar
            alt={"john doe"}
            className={classes.profileMenuAvatar}
            src={"https://picsum.photos/200/300?grayscale&random=2"}
          />

          {auth.profileLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Typography variant={"h4"} align={"center"}>
              {auth.profile.first_name} {auth.profile.last_name}
            </Typography>
          )}

          <List>
            <ListItem button onClick={app.toggleDarkMode}>
              <ListItemIcon>
                <NightsStayIcon />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <ListItemSecondaryAction>
                <Switch
                  color="default"
                  checked={app.darkMode}
                  onChange={app.toggleDarkMode}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>

          <List
            subheader={<ListSubheader disableSticky>Profile</ListSubheader>}
          >
            <ListItem button>
              <ListItemIcon color={"primary"}>
                <FiberManualRecordIcon />
              </ListItemIcon>
              <ListItemText primary="Active Status" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </ListItem>

            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Dialog>
      </Hidden>
    </>
  );
};

ConversationListDrawerHeaderComponent.propTypes = {
  trigger: propTypes.bool.isRequired,
};

export default ConversationListDrawerHeaderComponent;
