import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Hidden from "@material-ui/core/Hidden";
import {getHeader} from "@mui-treasury/layout";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {getSidebarTrigger} from "@mui-treasury/layout";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ActionBtnsComponent from "@components/messenger/header/main/ActionBtns";

const Header = getHeader(styled);
const SidebarTrigger = getSidebarTrigger(styled)

const useStyles = makeStyles((theme) => createStyles({
    appBar: {
        marginRight: "0 !important",
        backgroundColor: theme.palette.common.white,
        zIndex: theme.zIndex.drawer + 1,
        [theme.breakpoints.only("xl")]: {
            width: "calc(100% - 420px) !important",
        },
        [theme.breakpoints.only("lg")]: {
            width: "calc(100% - 25vw) !important",
        },
        [theme.breakpoints.only("md")]: {
            width: "calc(100% - 300px) !important",
        }
    },
    infoListTriggerAvatar: {
        marginLeft: 0
    },
    conversationListTrigger: {
        marginRight: 0
    }
}))

const HeaderComponent: React.FC = (props) => {
    const classes = useStyles();

    return (
        <Header
            elevation={1}
            className={classes.appBar}
        >
            <Toolbar>
                <Grid
                    container
                    alignItems={"center"}
                    justify={"space-between"}
                >
                    <Grid item>
                        <Hidden
                            lgUp
                        >
                            {/*<IconButton*/}
                            {/*    onClick={messengerContext.handleMessageComponentsVisibility}*/}
                            {/*>*/}
                            {/*    <ArrowBackIcon/>*/}
                            {/*</IconButton>*/}
                            <SidebarTrigger
                                color={"primary"}
                                sidebarId="left_sidebar"
                                className={classes.conversationListTrigger}
                            >
                                {({open, anchor}) => {
                                    return <ArrowBackIcon/>
                                }}
                            </SidebarTrigger>
                            <SidebarTrigger
                                color={"primary"}
                                sidebarId={"right_sidebar"}
                                className={classes.infoListTriggerAvatar}
                            >
                                {({open, anchor}) => {
                                    return <Avatar
                                        alt={"john doe"}
                                        src={"https://picsum.photos/200/300?grayscale&random=2"}
                                    />
                                }}
                            </SidebarTrigger>
                        </Hidden>

                        <Hidden
                            smDown
                        >
                            <Avatar
                                alt={"john doe"}
                                src={"https://picsum.photos/200/300?grayscale&random=2"}
                            />
                        </Hidden>
                    </Grid>
                    <Grid item>
                        <ActionBtnsComponent/>
                    </Grid>
                </Grid>
            </Toolbar>
        </Header>
    );
};

export default HeaderComponent;