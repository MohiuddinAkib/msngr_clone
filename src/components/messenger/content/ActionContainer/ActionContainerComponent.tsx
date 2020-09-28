import React from "react";
import moment from "moment";
import Webcam from "react-webcam";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
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
import {RootState} from "@store/configureStore";
import CloseIcon from "@material-ui/icons/Close";
import CameraIcon from "@material-ui/icons/Camera";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {useErrorHandler} from "react-error-boundary";
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
import {FirebaseReducer, isEmpty, isLoaded, useFirebase} from "react-redux-firebase";


const ReactMic = dynamic<ReactMicProps>(import("react-mic").then(module => module.ReactMic), {
    ssr: false,
    loading: () => <CircularProgress/>
})


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
    },
    cameraDialogContent: {
        [theme.breakpoints.only("xl")]: {
            minWidth: 600,
            minHeight: 436,
        }
    },
    webcamContainer: {
        position: "relative",
        width: "100%",
        height: "100%"
    },
    webcamOverlay: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "transparent",
        zIndex: theme.zIndex.modal + 1
    },
    ssTimeTxt: {
        fontWeight: "bold",
        color: theme.palette.common.white
    },
    screenshotPreview: {
        transform: "scale(-1,1)"
    }
}))

const ActionContainerComponent: React.FC<Props> = (props) => {
    const theme = useTheme()
    const router = useRouter()
    const classes = useStyles()
    const firebase = useFirebase()
    const handleError = useErrorHandler()
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)

    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef<MediaRecorder>(null);
    const previewVideoRef = React.useRef<HTMLVideoElement>(null);

    const [openCameraDialog, setOpenCameraDialog] = React.useState(false)
    const [capturingVideo, setCapturingVideo] = React.useState(false);
    const [videoChunks, setVideoChunks] = React.useState<Blob[]>([]);
    const [videoRecordPreviewBlob, setVideoRecordPreviewBlob] = React.useState("")
    const [videoSending, setVideoSending] = React.useState(false)
    const [screenshotSending, setScreenshotSending] = React.useState(false)

    const [ssTime, setSsTime] = React.useState(3)
    const [capturingScreenShot, setCapturingScreenshot] = React.useState(false);
    const [screenshotPreviewBlob, setScreenshotPreviewBlob] = React.useState("");

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
        setVideoChunks([])
        setCapturingVideo(false)
        setScreenshotPreviewBlob("")
        setVideoRecordPreviewBlob("")
        setCapturingScreenshot(false)
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
            if (ssTime) {
                setCapturingScreenshot(true)

            }

            if (ssTime === 0) {
                const imageSrc = webcamRef.current.getScreenshot();
                setScreenshotPreviewBlob(imageSrc)
            }
        },
        [webcamRef, ssTime]
    );

    React.useEffect(() => {
        let timer;
        if (capturingScreenShot) {
            timer = setInterval(() => {
                setSsTime(prevSsTime => {
                    if (prevSsTime === 0) {
                        clearInterval(timer)
                    }
                    return prevSsTime !== 0 ? (prevSsTime - 1) : prevSsTime
                })
            }, 1500)
        }

        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [capturingScreenShot])

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
        if (videoChunks.length && isLoaded(auth) && !isEmpty(auth)) {
            setVideoSending(true)
            try {
                const rcrdBlob = new Blob(videoChunks, {type: "video/webm;codecs=vp8"})

                await firebase.uploadFile(
                    "message-videos",
                    rcrdBlob,
                    `conversations/${router.query.conversation_uid}/messages`,
                    {
                        metadataFactory: (uploadRes, firebase, meta, downloadURL) => {
                            const {metadata: {fullPath, timeCreated, updated, contentType, customMetadata, size, name}} = uploadRes
                            return {
                                name,
                                size,
                                fullPath,
                                downloadURL,
                                type: "file",
                                contentType,
                                customMetadata,
                                deleted_at: null,
                                updated_at: updated,
                                sender_id: auth.uid,
                                created_at: timeCreated,
                            }
                        },
                        metadata: {
                            customMetadata: {
                                sender_id: auth.uid,
                            },
                            contentType: "video/webm;codecs=vp8",

                        },
                        name: `${auth.uid}-${moment().toISOString()}`,
                    })
            } catch (error) {
                // handleError(error)
            } finally {
                handleCameraDialogClose()
                setVideoSending(false)
            }
        }
    }, [videoChunks])

    const handleRetakeScreenshot = () => {
        setScreenshotPreviewBlob("")
    }

    const handleSendScreenShot = React.useCallback(async () => {
        if (!!screenshotPreviewBlob && isLoaded(auth) && !isEmpty(auth)) {
            setScreenshotSending(true)

            try {
                const res = await fetch(screenshotPreviewBlob)
                const data = await res.blob()

                await firebase.uploadFile(
                    "message-images",
                    data,
                    `conversations/${router.query.conversation_uid}/messages`,
                    {
                        metadataFactory: (uploadRes, firebase1, metadata, downloadURL) => {
                            const {metadata: {fullPath, timeCreated, updated, contentType, customMetadata, size, name}} = uploadRes
                            return {
                                name,
                                size,
                                fullPath,
                                downloadURL,
                                type: "file",
                                contentType,
                                customMetadata,
                                deleted_at: null,
                                updated_at: updated,
                                sender_id: auth.uid,
                                created_at: timeCreated,
                            }
                        },
                        metadata: {
                            customMetadata: {
                                sender_id: auth.uid,
                            },
                            contentType: "image/jpeg",
                        },
                        name: `${auth.uid}-${moment().toISOString()}`,
                    })

            } catch (error) {
                // handleError(error)
            } finally {
                handleCameraDialogClose()
                setScreenshotSending(false)
            }
        }
    }, [screenshotPreviewBlob])

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

    React.useEffect(() => {
        if (ssTime === 0) {
            handleTakeScreenshot()
            setSsTime(3)
            setCapturingScreenshot(false)
        }

    }, [ssTime])

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
                <DialogContent
                    className={classes.cameraDialogContent}
                >
                    {(hasCameraPermission && videoChunks.length === 0 && !screenshotPreviewBlob) &&
                    <div
                        className={classes.webcamContainer}
                    >
                        {capturingScreenShot && <span
                            className={classes.webcamOverlay}
                        >
                            <Typography
                                variant={"h1"}
                                className={classes.ssTimeTxt}
                            >
                            {ssTime}
                            </Typography>
                        </span>}
                        <Webcam
                            audio
                            width={"100%"}
                            height={"100%"}
                            ref={webcamRef}
                            className={classes.webcam}
                            onUserMedia={handleOnUserMedia}
                            onUserMediaError={handleOnUserMediaError}
                        />
                    </div>}
                    {
                        !!screenshotPreviewBlob && <img
                            src={screenshotPreviewBlob}
                            className={classes.screenshotPreview}
                        />
                    }

                    {(!capturingVideo && videoChunks.length > 0) && (
                        <video
                            loop
                            autoPlay
                            width={"100%"}
                            height={"100%"}
                            ref={previewVideoRef}
                            className={classes.webcam}
                            src={videoRecordPreviewBlob}
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
                        {(!capturingVideo && videoChunks.length === 0 && !screenshotPreviewBlob) && <>
                            <Grid
                                item
                            >
                                <Button
                                    color={"primary"}
                                    onClick={handleTakeVideo}
                                    disabled={capturingVideo || capturingScreenShot}
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
                                    disabled={capturingVideo || capturingScreenShot}
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

                        {(!capturingVideo && videoChunks.length > 0 && !screenshotPreviewBlob) && (
                            <>
                                <Grid
                                    item
                                >
                                    <Button
                                        color={"primary"}
                                        onClick={handleRetakeVideo}
                                        disabled={screenshotSending || videoSending}
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
                                        disabled={screenshotSending || videoSending}
                                    >
                                        Send Video
                                    </Button>
                                </Grid>
                            </>
                        )}

                        {(!capturingScreenShot && !!screenshotPreviewBlob) && (
                            <>
                                <Grid
                                    item
                                >
                                    <Button
                                        color={"primary"}
                                        onClick={handleRetakeScreenshot}
                                        disabled={screenshotSending || videoSending}
                                    >
                                        Retake
                                    </Button>
                                </Grid>

                                <Grid
                                    item
                                >
                                    <Button
                                        color={"primary"}
                                        onClick={handleSendScreenShot}
                                        disabled={screenshotSending || videoSending}
                                    >
                                        Send Photo
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