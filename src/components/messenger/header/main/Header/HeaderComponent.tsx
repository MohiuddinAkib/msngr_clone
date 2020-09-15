import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import {getHeader} from "@mui-treasury/layout";
import Toolbar from "@material-ui/core/Toolbar";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import ActionBtnsComponent from "@components/messenger/header/main/ActionBtns";

const Header = getHeader(styled);

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
}))

const HeaderComponent: React.FC = (props) => {
    const classes = useStyles();

    return (
        <Header elevation={1} className={classes.appBar}>
            <Toolbar>
                <Grid container justify={"space-between"} alignItems={"center"}>
                    <Grid item>
                        <Avatar alt={"john doe"} src={"https://picsum.photos/200/300?grayscale&random=2"}/>
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