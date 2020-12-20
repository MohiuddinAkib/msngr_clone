import React from "react";
import useAuth from "@hooks/useAuth";
import styled from "styled-components";
import { useRouter } from "next/router";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import useMessenger from "@hooks/useMessenger";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import BlockIcon from "@material-ui/icons/Block";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import SearchIcon from "@material-ui/icons/Search";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import useUserPresence from "@hooks/useUserPresence";
import WarningIcon from "@material-ui/icons/Warning";
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import ReportOffIcon from "@material-ui/icons/ReportOff";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TripOriginIcon from "@material-ui/icons/TripOrigin";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {
  getSidebarContent,
  getDrawerSidebar,
  getSidebarTrigger,
  getHeader,
} from "@mui-treasury/layout";
import moment from "moment";

const Header = getHeader(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled);
const SidebarTrigger = getSidebarTrigger(styled);

const useStyles = makeStyles((theme) =>
  createStyles({
    infoDrawerPaper: {},
    profileAvatar: {
      height: 100,
      width: 100,
    },
    profileNameRoot: {
      fontWeight: "bold",
      textAlign: "center",
    },
    activeStatusRoot: {
      textAlign: "center",
    },
  })
);

const InfoListDrawerComponent: React.FC = (props) => {
  const auth = useAuth();
  const router = useRouter();
  const classes = useStyles();
  const messenger = useMessenger();
  const [showMoreActions, setShowMoreActions] = React.useState(false);
  const [showPrivacyAndPolicy, setShowPrivacyAndPolicy] = React.useState(false);
  const conversation = messenger.getConversationById(
    router.query.conversation_uid as string
  );
  const chatPartnerPresence = useUserPresence(
    conversation?.chatPartner.id || ""
  );

  const handleMoreActionsCollapse = () => {
    setShowMoreActions((prevState) => !prevState);
  };

  const handleShowPrivacyAndPolicy = () => {
    setShowPrivacyAndPolicy((prevState) => !prevState);
  };

  return (
    <DrawerSidebar
      sidebarId={"right_sidebar"}
      classes={{ paper: classes.infoDrawerPaper }}
    >
      <SidebarContent>
        <SidebarTrigger color={"primary"} sidebarId="left_sidebar">
          {({ open, anchor }) => {
            return <ArrowBackIcon />;
          }}
        </SidebarTrigger>

        <Toolbar />
        <CardContent>
          <Box textAlign={"center"}>
            <Badge
              variant="dot"
              overlap="circle"
              color={
                chatPartnerPresence?.state === "online"
                  ? "primary"
                  : chatPartnerPresence?.state === "away"
                  ? "secondary"
                  : "error"
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                className={classes.profileAvatar}
                src={"https://picsum.photos/200/300?random=3"}
              />
            </Badge>
          </Box>
          <CardHeader
            titleTypographyProps={{
              classes: {
                root: classes.profileNameRoot,
              },
            }}
            subheaderTypographyProps={{
              classes: {
                root: classes.activeStatusRoot,
              },
            }}
            title={
              conversation
                ? conversation.isGroupType
                  ? conversation.title
                  : conversation.chatPartner?.nickname || ""
                : ""
            }
            subheader={
              chatPartnerPresence?.state === "online"
                ? "Active now"
                : chatPartnerPresence?.last_changed
                ? `Active ${moment(chatPartnerPresence.last_changed).fromNow()}`
                : ""
            }
          />
        </CardContent>
        <List>
          <Divider component={"li"} />
          <ListItem button onClick={handleMoreActionsCollapse}>
            <ListItemText
              primary="MORE ACTIONS"
              primaryTypographyProps={{
                variant: "overline",
              }}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={handleMoreActionsCollapse}>
                {showMoreActions ? (
                  <ExpandMoreIcon />
                ) : (
                  <KeyboardArrowLeftIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

          <Collapse in={showMoreActions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText primary={"Search in conversation"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText primary={"Edit Nicknames"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText primary={"Change theme"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <TripOriginIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText primary={"Change emoji"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ThumbUpIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Collapse>

          <Divider component={"li"} />

          <ListItem button onClick={handleShowPrivacyAndPolicy}>
            <ListItemText
              primary="PRIVACY AND SUPPORT"
              primaryTypographyProps={{
                variant: "overline",
              }}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={handleShowPrivacyAndPolicy}>
                {showPrivacyAndPolicy ? (
                  <ExpandMoreIcon />
                ) : (
                  <KeyboardArrowLeftIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

          <Collapse in={showPrivacyAndPolicy} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <ListItemText primary={"Notifications"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NotificationsIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText primary={"Ignore messages"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ReportOffIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText primary={"Block messages"} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <BlockIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"Something's wrong"}
                  secondary={"Give feedback and report conversation"}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <WarningIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </SidebarContent>
    </DrawerSidebar>
  );
};

export default InfoListDrawerComponent;
