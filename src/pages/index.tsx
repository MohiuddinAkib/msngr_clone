import React from "react";
import Link from "next/link";
import Peer from "simple-peer";
import { NextPage } from "next";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import withAuth from "@components/auth/withAuth";
import WebRTCLayout from "@layouts/WebRTCLayout";
import GroupIcon from "@material-ui/icons/Group";
import CloseIcon from "@material-ui/icons/Close";
import { useFirestore } from "react-redux-firebase";
import TextField from "@material-ui/core/TextField";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import DialogContent from "@material-ui/core/DialogContent";
import * as FirestoreTypes from "@firebase/firestore-types";
import PermCameraMicIcon from "@material-ui/icons/PermCameraMic";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    videoElement: {
      width: "100%",
      height: "100%",
      display: "block",
      backgroundColor: theme.palette.common.black,
    },
  })
);

const App: NextPage = () => {
  const classes = useStyles();
  const firestore = useFirestore();

  const localVideo = React.useRef<HTMLVideoElement>();
  const remoteVideo = React.useRef<HTMLVideoElement>();

  const [roomId, setRoomId] = React.useState("");
  const [showRoomIdModal, setShowRoomIdModal] = React.useState(false);
  const [peerConnection, setPeerConnection] = React.useState<RTCPeerConnection>(
    null
  );
  const [disableJoinBtn, setDisableJoinBtn] = React.useState(true);
  const [disableCreateBtn, setDisableCreateBtn] = React.useState(true);
  const [disableHangUpBtn, setDisableHangUpBtn] = React.useState(true);
  const [disableCameraBtn, setDisableCameraBtn] = React.useState(false);
  const [roomRef, setRoomRef] = React.useState<
    FirestoreTypes.DocumentReference<FirestoreTypes.DocumentData>
  >(null);

  const [localStream, setLocalStream] = React.useState(() => {
    const stream = new MediaStream();

    return stream;
  });
  const [remoteStream, setRemoteStream] = React.useState(() => {
    const stream = new MediaStream();

    return stream;
  });

  const [roomRefSubscription, setRoomRefSubscription] = React.useState<
    () => void
  >(null);
  const [
    calleeCandidatesSubscription,
    setCalleeCandidatesSubscription,
  ] = React.useState<() => void>(null);

  const [
    callerCandidatesSubscription,
    setCallerCandidatesSubscription,
  ] = React.useState<() => void>(null);

  React.useEffect(() => {
    if (localVideo.current) {
      localVideo.current.srcObject = localStream;
    }

    if (remoteVideo.current) {
      // remoteVideo.current.srcObject = remoteStream;
    }
  }, [localVideo, remoteVideo, localStream, remoteStream]);

  React.useEffect(() => {
    return () => {
      if (roomRefSubscription) {
        roomRefSubscription();
      }

      if (calleeCandidatesSubscription) {
        calleeCandidatesSubscription();
      }

      if (callerCandidatesSubscription) {
        callerCandidatesSubscription();
      }
    };
  }, [
    roomRefSubscription,
    calleeCandidatesSubscription,
    callerCandidatesSubscription,
  ]);

  const createRoom = async () => {
    setDisableJoinBtn(true);
    setDisableCreateBtn(true);
    const roomRef = await firestore.collection("rooms").doc();
    setRoomRef(roomRef);

    const peer = new Peer({
      trickle: false,
      initiator: true,
      stream: localStream,
    });

    const callerCandidatesCollection = roomRef.collection("callerCandidates");

    peer.on("signal", async (data) => {
      console.log(data);
      if (data) {
        if (data.type === "offer") {
          await roomRef.set({ offer: data });
          console.log(
            `New room created with SDP offer. Room ID: ${roomRef.id}`
          );
        } else if (data.type === "candidate") {
          callerCandidatesCollection.add(data.candidate);
        }
      }
    });

    // Listening for remote session description below
    roomRef.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      console.log("roomref snapshot on caller side", data);
      if (data && data.answer) {
        console.log("Got remote description: ", data.answer);
        peer.signal(data.answer);
      }
    });
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          peer.signal(data);
        }
      });
    });
    // Listen for remote ICE candidates above

    peer.on("stream", (stream) => {
      console.log("callee stream", stream, remoteVideo);
      remoteVideo.current.srcObject = stream;
    });
  };

  function joinRoom() {
    setDisableCreateBtn(true);
    setDisableJoinBtn(true);
    setShowRoomIdModal(true);
  }

  // React.useEffect(() => {
  //   if (!!roomId) {
  //     joinRoomById(roomId);
  //   }
  // }, [roomId]);

  async function joinRoomById(roomId) {
    const roomRef = firestore.collection("rooms").doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
    console.log("Got room:", roomSnapshot.exists);

    if (roomSnapshot.exists) {
      const peer = new Peer({
        trickle: false,
        initiator: false,
        stream: localStream,
      });

      const calleeCandidatesCollection = roomRef.collection("calleeCandidates");

      peer.on("signal", async (data) => {
        console.log(data);

        if (data) {
          if (data.type === "answer") {
            await roomRef.update({ answer: data });
            console.log(`Room updated with SDP answer. Room ID: ${roomRef.id}`);
          } else if (data.type === "candidate") {
            calleeCandidatesCollection.add(data.candidate);
          }
        }
      });

      peer.on("stream", (stream) => {
        console.log("caller stream", stream, remoteVideo);

        remoteVideo.current.srcObject = stream;
      });

      const offer = roomSnapshot.data().offer;
      console.log("Got offer:", offer);
      peer.signal(offer);

      // Listening for remote ICE candidates below
      const callerCandidatesSubscription = roomRef
        .collection("callerCandidates")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              let data = change.doc.data();
              console.log(
                `Got new remote ICE candidate: ${JSON.stringify(data)}`
              );
              peer.signal(data);
            }
          });
        });

      setCallerCandidatesSubscription(callerCandidatesSubscription);
      // Listening for remote ICE candidates above
    } else {
      setRoomId("");
    }
  }

  async function hangUp(e: React.MouseEvent) {
    const tracks = (localVideo.current.srcObject as MediaStream).getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
      peerConnection.close();
    }

    localVideo.current.srcObject = null;
    remoteVideo.current.srcObject = null;
    setDisableCameraBtn(false);
    setDisableJoinBtn(true);
    setDisableCreateBtn(true);
    setDisableHangUpBtn(true);

    // Delete room on hangup
    if (roomId) {
      const roomRef = firestore.collection("rooms").doc(roomId);
      const calleeCandidates = await roomRef
        .collection("calleeCandidates")
        .get();
      calleeCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      const callerCandidates = await roomRef
        .collection("callerCandidates")
        .get();
      callerCandidates.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      await roomRef.delete();
    }
  }

  const openUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    setDisableCameraBtn(true);
    setDisableJoinBtn(false);
    setDisableCreateBtn(false);
    setDisableHangUpBtn(false);
  };

  return (
    <WebRTCLayout>
      <Box
        display={"flex"}
        height={"100vh"}
        flexWrap={"wrap"}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"center"}
      >
        <Box width={"100%"}>
          <Grid container>
            <Grid item xs={12} md>
              <Box mr={2}>
                <Button
                  color={"primary"}
                  variant={"contained"}
                  onClick={openUserMedia}
                  disabled={disableCameraBtn}
                  startIcon={<PermCameraMicIcon />}
                >
                  Open camera & microphone
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Box mr={2}>
                <Button
                  color={"primary"}
                  onClick={createRoom}
                  variant={"contained"}
                  disabled={disableCreateBtn}
                  startIcon={<GroupAddIcon />}
                >
                  Create room
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Box mr={2}>
                <Button
                  color={"primary"}
                  onClick={joinRoom}
                  variant={"contained"}
                  disabled={disableJoinBtn}
                  startIcon={<GroupIcon />}
                >
                  Join
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Box mr={2}>
                <Button
                  onClick={hangUp}
                  color={"primary"}
                  variant={"contained"}
                  startIcon={<CloseIcon />}
                  disabled={disableHangUpBtn}
                >
                  Hang Up
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box width={"100%"} mt={2}>
          <Grid container>
            <Grid item md={6}>
              <Box pr={1}>
                <video
                  muted
                  autoPlay
                  playsInline
                  ref={localVideo}
                  className={classes.videoElement}
                ></video>
              </Box>
            </Grid>

            <Grid item md={6}>
              <Box pl={1}>
                <video
                  autoPlay
                  playsInline
                  ref={remoteVideo}
                  className={classes.videoElement}
                ></video>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box width={"100%"} mt={2}>
          <Box>
            <Link href={"/messages"} passHref>
              <Button component={"a"} variant={"text"}>
                Go to messages
              </Button>
            </Link>
          </Box>
        </Box>

        <Dialog
          open={showRoomIdModal}
          onClose={() => setShowRoomIdModal(false)}
        >
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                setShowRoomIdModal(false);
                // setRoomId(e.target["room-id"].value);
                joinRoomById(e.target["room-id"].value);
              }}
            >
              <TextField
                name={"room-id"}
                variant={"outlined"}
                label={"Enter room ID"}
              />

              <Button type={"submit"} variant={"contained"}>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </WebRTCLayout>
  );
};

export default withAuth(App);
