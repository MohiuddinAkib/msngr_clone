import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import ReactResizeDetector from "react-resize-detector";
import AddCircleOulineIcon from "@material-ui/icons/AddCircleOutline";
import MessageTextFieldComponent from "@components/messengerLayout/messengerLayoutContent/messageField";
import MessageActionBtnsComponent
    from "@components/messengerLayout/messengerLayoutContent/messageActionContainer/messageActionBtns";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface Props {
}

const MessageActionContainerComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const xsAndSm = useMediaQuery(theme.breakpoints.between("xs", "sm"))

    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const msgActionBtnsWhenGraterThanSm = (width: number) => (
        <Slide direction="up" unmountOnExit mountOnEnter in={open && (width < 600)}>
            <Grid item component={Box} xs={12}>
                <MessageActionBtnsComponent buttonsPositionOnTop/>
            </Grid>
        </Slide>)

    const msgActionBtnsWhenXsAndSm = (
        <MessageActionBtnsComponent buttonsPositionOnTop dialog showHiddenBtns={open} onClose={handleOpen}/>
    )

    return (
        <ReactResizeDetector handleWidth>
            {({width}) => (
                <Grid container>
                    {xsAndSm ? msgActionBtnsWhenXsAndSm : msgActionBtnsWhenGraterThanSm(width)}

                    <Grid item component={Box}>
                        <IconButton color={"primary"} onClick={handleOpen}>
                            <AddCircleOulineIcon fontSize={"large"}/>
                        </IconButton>

                        <Slide direction="right" mountOnEnter unmountOnExit
                               in={width >= 600 && !xsAndSm}>
                            <span>
                                <MessageActionBtnsComponent showHiddenBtns={open}/>
                            </span>
                        </Slide>
                    </Grid>

                    <Grid item component={Box} flex={1}>
                        <MessageTextFieldComponent/>
                    </Grid>
                </Grid>
            )}
        </ReactResizeDetector>

    )

};

export default MessageActionContainerComponent;