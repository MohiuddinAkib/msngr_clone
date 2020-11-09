import React from "react";
import {useSelector} from "react-redux";
import NoSsr from "@material-ui/core/NoSsr";
import {isLoaded} from "react-redux-firebase";
import {RootState} from "@store/configureStore";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
    }),
);

const AuthIsLoadedComponent: React.FC = (props) => {
    const classes = useStyles();
    const auth = useSelector<RootState>(state => state.firebase.auth)

    return (<>
        {isLoaded(auth) ? props.children : <NoSsr>
            <Backdrop
                open
                className={classes.backdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </NoSsr>}
    </>)
};

export default AuthIsLoadedComponent;
