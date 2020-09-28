import React from "react";
import Webcam from "react-webcam";
import dynamic from "next/dynamic";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import Slide from "@material-ui/core/Slide";
import GifIcon from "@material-ui/icons/Gif";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Popper from "@material-ui/core/Popper";
import NoteIcon from "@material-ui/icons/Note";
import CloseIcon from "@material-ui/icons/Close";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import {withResizeDetector} from "react-resize-detector";
import useTheme from "@material-ui/core/styles/useTheme";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {ReactMicStopEvent, ReactMicProps} from "react-mic";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import AddCircleOulineIcon from "@material-ui/icons/AddCircleOutline";
import MessageFieldComponent from "@components/messenger/content/MessageField";
import {bindPopper, bindTrigger, usePopupState} from "material-ui-popup-state/hooks";
import {useFirebase} from "react-redux-firebase";
import {useErrorHandler} from "react-error-boundary";

const ReactMic = dynamic<ReactMicProps>(import("react-mic").then(module => module.ReactMic), {ssr: false})


interface Props {
    height: number;
    width: number;
}

const useStyles = makeStyles(theme => createStyles({
    actionSlide: {
        backgroundColor: "#fafafa"
    },
    webcam: {
        transform: "scale(-1,1)"
    },
    reactMic: {
        width: 300,
        height: 300
    }
}))

const ActionContainerComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const classes = useStyles()
    const firebase = useFirebase()
    const handleError = useErrorHandler()

    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef<MediaRecorder>(null);
    const previewVideoRef = React.useRef<HTMLVideoElement>(null);

    const [openCameraDialog, setOpenCameraDialog] = React.useState(false)
    const [capturingVideo, setCapturingVideo] = React.useState(false);
    const [videoChunks, setVideoChunks] = React.useState<Blob[]>([]);
    const [videoRecordPreviewBlob, setVideoRecordPreviewBlob] = React.useState("")

    const [capturingScreenShot, setCapturingScreenshot] = React.useState(false);
    const [screenshotPreviewBlob, setScreenshotPreviewBlob] = React.useState(false);

    const [openBtn, setOpenBtn] = React.useState(false)
    const pc = useMediaQuery(theme.breakpoints.up("md"))
    const [record, setRecord] = React.useState(false)
    const [hasCameraPermission, setCameraPermission] = React.useState(true)
    const recordPopupState = usePopupState({
        variant: "popper",
        popupId: "record-popper",
    })

    const handleToggle = () => {
        setOpenBtn((prev) => !prev);
    };

    const handleOpenCameraDialog = () => {
        setOpenCameraDialog(true)
    }

    const handleCameraDialogClose = () => {
        setOpenCameraDialog(false)
    }

    const handleRecorderClickAway = () => {
        recordPopupState.close()
    }

    const startRecording = () => {
        setRecord(true);
    }

    const stopRecording = () => {
        setRecord(false);
    }

    const onRecordData = (recordedBlob: Blob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    const onRecordStop = (recordedBlob: ReactMicStopEvent) => {
        console.log('recordedBlob is: ', recordedBlob);
    }

    const handleOnUserMedia = () => {
        setCameraPermission(true)
    }
    const handleOnUserMediaError = () => {
        setCameraPermission(false)
    }

    const handleTakeScreenshot = React.useCallback(
        () => {
            setCapturingScreenshot(true)
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc)
        },
        [webcamRef]
    );

    const handleTakeVideo = React.useCallback(() => {
        setCapturingVideo(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturingVideo, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({data}: BlobEvent) => {
            if (data.size > 0) {
                setVideoChunks(prevChunks => prevChunks.concat(data));
            }
        },
        [setVideoChunks]
    );

    const handleStopVideo = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturingVideo(false);
    }, [mediaRecorderRef, webcamRef, setCapturingVideo]);

    const handleRetakeVideo = () => {
        setVideoChunks([])
    }

    const handleSendVideo = React.useCallback(async () => {
        if (videoChunks.length) {
            try {
                const rcrdBlob = new Blob(videoChunks, {type: "video/webm;codecs=vp8"})
                await firebase.uploadFile("message-videos", rcrdBlob, "conversations/vIdS1a47KND1psOurPoX/messages", {
                    metadata: {
                        customMetadata: {
                            name: "ohohoho9h"
                        },
                        contentType: "video/webm;codecs=vp8",
                    },

                    name: "heiiii",

                })

                console.log("File uploaded successfully")
            } catch (error) {
                handleError(error)
            }
        }
    }, [videoChunks])

    React.useEffect(() => {
        if (videoChunks.length) {
            const rcrdBlob = new Blob(videoChunks, {type: "video/webm;codecs=vp8"})
            const url = URL.createObjectURL(rcrdBlob)
            setVideoRecordPreviewBlob(url)
        }

        return () => {
            if (!!videoRecordPreviewBlob) {
                URL.revokeObjectURL(videoRecordPreviewBlob)
            }
        }
    }, [videoChunks, openCameraDialog, previewVideoRef])

    const cameraBtn = (
        <IconButton
            color={"primary"}
            onClick={handleOpenCameraDialog}
        >
            <CameraIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const recordBtn = (
        <IconButton
            color={"primary"}
            {...bindTrigger(recordPopupState)}
        >
            <KeyboardVoiceIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const gifBtn = (
        <IconButton
            color={"primary"}
        >
            <GifIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const fileUploadBtn = (
        <IconButton
            color={"primary"}
        >
            <NoteIcon
                fontSize={"large"}
            />
        </IconButton>
    )


    const insertPhotoBtn = (
        <IconButton
            color={"primary"}
        >
            <InsertPhotoIcon
                fontSize={"large"}
            />
        </IconButton>
    )

    const actionTop = props.width < 600 && (
        <Hidden
            smDown
        >
            <Slide
                in={openBtn}
                unmountOnExit
                direction="up"
            >
                <Grid
                    item
                    xs={12}
                    component={Box}
                    className={classes.actionSlide}
                >
                    {cameraBtn}

                    {recordBtn}

                    {gifBtn}

                    {fileUploadBtn}

                    {insertPhotoBtn}
                </Grid>
            </Slide>
        </Hidden>

    )

    const actionRight = props.width >= 600 && (
        <Hidden
            smDown
        >
            <Slide
                in={openBtn}
                unmountOnExit
                direction="right"
            >
                {cameraBtn}
            </Slide>

            <Slide
                in={openBtn}
                unmountOnExit
                direction="right"
            >
                {recordBtn}
            </Slide>

            {gifBtn}

            {fileUploadBtn}

            {insertPhotoBtn}
        </Hidden>
    )

    const actionDialog = (
        <Hidden
            lgUp
        >
            <Drawer
                open={openBtn}
                anchor={"bottom"}
                onClose={handleToggle}
            >
                <DialogContent
                    dividers
                >
                    {cameraBtn}

                    {recordBtn}

                    {gifBtn}

                    {fileUploadBtn}

                    {insertPhotoBtn}
                </DialogContent>
            </Drawer>
        </Hidden>
    )

    return (
        <Grid container>
            {actionDialog}
            {/* WHEN SIZE OF THE CONTAINER IS LESS THAN 0R EQUAL TO 600 */}
            {actionTop}

            <Grid
                item
                component={Box}>
                <IconButton
                    color={"primary"}
                    onClick={handleToggle}
                >
                    <AddCircleOulineIcon
                        fontSize={"large"}
                    />
                </IconButton>
                {/* WHEN SIZE OF THE CONTAINER IS GREATER THAN 0R EQUAL TO 600 */}
                {actionRight}
            </Grid>

            <Grid
                item
                flex={1}
                component={Box}
            >
                <MessageFieldComponent/>
            </Grid>

            <Hidden
                smDown
            >
                <Popper
                    transition
                    placement={"top-start"}
                    {...bindPopper(recordPopupState)}
                >
                    {({TransitionProps}) => (
                        <Fade
                            timeout={350}
                            {...TransitionProps}
                        >
                            <Card
                                elevation={2}
                            >
                                <ClickAwayListener
                                    onClickAway={handleRecorderClickAway}
                                >
                                    <CardContent>
                                        <ReactMic
                                            record={record}
                                            strokeColor="#000000"
                                            backgroundColor="#FF4081"
                                            onData={onRecordData}
                                            onStop={onRecordStop}
                                            className={classes.reactMic}
                                        />
                                        <Button
                                            onClick={startRecording}
                                        >
                                            Start Record
                                        </Button>

                                        <Button
                                            onClick={stopRecording}
                                        >
                                            Stop Record
                                        </Button>
                                    </CardContent>
                                </ClickAwayListener>
                            </Card>
                        </Fade>
                    )}
                </Popper>
            </Hidden>

            <Dialog
                open={openCameraDialog}
                onClose={handleCameraDialogClose}
            >
                <DialogTitle>
                    <Grid
                        container
                        alignItems={"center"}
                        justify={"space-between"}
                    >
                        <Grid
                            item
                        >
                            <Typography
                                variant={"h6"}
                            >
                                {hasCameraPermission ? "Camera" : "No camera detected"}
                            </Typography>
                        </Grid>

                        {hasCameraPermission && <Grid
                            item
                        >
                            <IconButton
                                onClick={handleCameraDialogClose}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Grid>}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    {(hasCameraPermission && videoChunks.length === 0) && <Webcam
                        audio
                        width={"100%"}
                        height={"100%"}
                        ref={webcamRef}
                        className={classes.webcam}
                        onUserMedia={handleOnUserMedia}
                        onUserMediaError={handleOnUserMediaError}
                    />}

                    {(!capturingVideo && videoChunks.length > 0) && (
                        <video
                            loop
                            autoPlay
                            width={"100%"}
                            height={"100%"}
                            ref={previewVideoRef}
                            src={videoRecordPreviewBlob}
                            className={classes.webcam}
                        />


                    )}

                    {!hasCameraPermission && <Typography>
                        Please check your camera's connection and ensure your camera is not already in use by another
                        applicaiton.
                    </Typography>}
                </DialogContent>
                <DialogActions>
                    {hasCameraPermission && <Grid
                        container
                        justify={!capturingVideo ? "space-between" : "center"}
                    >
                        {(!capturingVideo && videoChunks.length === 0) && <>
                            <Grid
                                item
                            >
                                <Button
                                    color={"primary"}
                                    onClick={handleTakeVideo}
                                >
                                    Take Video
                                </Button>
                            </Grid>

                            <Grid
                                item
                            >
                                <Button
                                    color={"primary"}
                                    onClick={handleTakeScreenshot}
                                >
                                    Take Photo
                                </Button>
                            </Grid>
                        </>}

                        {capturingVideo && <Grid
                            item
                        >
                            <Button
                                color={"primary"}
                                onClick={handleStopVideo}
                            >
                                Stop video
                            </Button>
                        </Grid>}

                        {(!capturingVideo && videoChunks.length > 0) && (
                            <>
                                <Grid
                                    item
                                >
                                    <Button
                                        color={"primary"}
                                        onClick={handleRetakeVideo}
                                    >
                                        Retake
                                    </Button>
                                </Grid>

                                <Grid
                                    item
                                >
                                    <Button
                                        color={"primary"}
                                        onClick={handleSendVideo}
                                    >
                                        Send Video
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>}
                    {!hasCameraPermission && (
                        <Button
                            color={"primary"}
                            onClick={handleCameraDialogClose}
                        >
                            ok
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Grid>
    )

};

export default withResizeDetector(ActionContainerComponent);