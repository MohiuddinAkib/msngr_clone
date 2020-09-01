import React from 'react';
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import InfoIcon from "@material-ui/icons/Info"
import Avatar from '@material-ui/core/Avatar';
import Toolbar from "@material-ui/core/Toolbar";
import PhoneIcon from "@material-ui/icons/Phone"
import IconButton from '@material-ui/core/IconButton';
import VideoCallIcon from "@material-ui/icons/VideoCall"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {getHeader, getSidebarTrigger} from "@mui-treasury/layout";
import {createStyles, makeStyles, Theme, useTheme} from "@material-ui/core/styles";

const Header = getHeader(styled);
const SidebarTrigger = getSidebarTrigger(styled)

const useStyles = makeStyles<Theme>((theme) => createStyles({
    appBar: {
        marginRight: "0 !important",
        zIndex: theme.zIndex.drawer + 1,
        [theme.breakpoints.only("xl")]: {
            width: "calc(100% - 420px) !important",
        },
        [theme.breakpoints.between("md", "lg")]:
            {
                width: "calc(100% - 300px) !important",
            }
    },
}))

const MessengerMainHeaderComponent: React.FC = (props) => {
    const classes = useStyles();

    return (
        <Header elevation={1} className={classes.appBar}>
            <Toolbar>
                <Grid container justify={"space-between"} alignItems={"center"}>
                    <Grid item>
                        <Avatar alt={"john doe"} src={"https://picsum.photos/200/300?grayscale&random=2"}/>
                    </Grid>
                    <Grid item>
                        <IconButton color={"primary"}>
                            <PhoneIcon fontSize={"large"}/>
                        </IconButton>

                        <IconButton color={"primary"}>
                            <VideoCallIcon fontSize={"large"}/>
                        </IconButton>

                        <SidebarTrigger sidebarId={"right_sidebar"} color={"primary"}>
                            {({open, anchor}) => {
                                if (!open) return <InfoIcon fontSize={"large"}/>
                                if (anchor === "left") return <InfoIcon fontSize={"large"}/>
                                if (anchor === "right") return <InfoIcon fontSize={"large"}/>
                            }}
                        </SidebarTrigger>
                    </Grid>
                </Grid>
            </Toolbar>
        </Header>
    );
};

export default MessengerMainHeaderComponent;