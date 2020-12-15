import React from "react";
import Link from "next/link";
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
  const [callerOrCallee, setCallerOrCallee] = React.useState<
    "caller" | "callee"
  >("");
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

  const configuration = React.useMemo(() => {
    return {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };
  }, []);

  React.useEffect(() => {
    if (localVideo.current) {
      localVideo.current.srcObject = localStream;
    }

    if (remoteVideo.current) {
      remoteVideo.current.srcObject = remoteStream;
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

  React.useEffect(() => {
    if (peerConnection) {
      peerConnection.addEventListener(
        "icegatheringstatechange",
        handleicegatheringstatechange
      );

      peerConnection.addEventListener(
        "connectionstatechange",
        handleconnectionstatechange
      );

      peerConnection.addEventListener(
        "signalingstatechange",
        handlesignalingstatechange
      );

      peerConnection.addEventListener(
        "iceconnectionstatechange ",
        handleiceconnectionstatechange
      );

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Code for collecting ICE candidates below
      peerConnection.addEventListener("icecandidate", handleicecandidatecaller);
      peerConnection.addEventListener("icecandidate", handleicecandidatecallee);

      // Code for collecting ICE candidates above
    }

    return () => {
      if (peerConnection) {
        peerConnection.removeEventListener(
          "icegatheringstatechange",
          handleicegatheringstatechange
        );
        peerConnection.removeEventListener(
          "connectionstatechange",
          handleconnectionstatechange
        );
        peerConnection.removeEventListener(
          "signalingstatechange",
          handlesignalingstatechange
        );
        peerConnection.removeEventListener(
          "iceconnectionstatechange",
          handleiceconnectionstatechange
        );
        peerConnection.removeEventListener(
          "icecandidate",
          handleicecandidatecaller
        );
        peerConnection.removeEventListener(
          "icecandidate",
          handleicecandidatecallee
        );

        peerConnection.removeEventListener("track", handletrack);
      }
    };
  }, [peerConnection]);

  function handleicegatheringstatechange() {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`
    );
  }

  function handleconnectionstatechange() {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  }

  function handlesignalingstatechange() {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  }

  function handleiceconnectionstatechange() {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`
    );
  }

  function handleicecandidatecallee(event: RTCPeerConnectionIceEvent) {
    if (!event.candidate) {
      console.log("Got final candidate!");
      return;
    }
    const calleeCandidatesCollection = roomRef.collection("calleeCandidates");
    console.log("Got candidate: ", event.candidate);
    calleeCandidatesCollection.add(event.candidate.toJSON());
  }

  function handleicecandidatecaller(event: RTCPeerConnectionIceEvent) {
    const callerCandidatesCollection = roomRef.collection("callerCandidates");

    if (!event.candidate) {
      console.log("Got final candidate!");
      return;
    }
    console.log("Got candidate: ", event.candidate);
    callerCandidatesCollection.add(event.candidate.toJSON());
  }

  function handletrack(event: RTCTrackEvent) {
    console.log("Got remote track:", event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log("Add a track to the remoteStream:", track);
      remoteStream.addTrack(track);
    });
  }

  React.useEffect(() => {
    if (roomRef) {
    }
  }, [roomRef]);

  const createRoom = async () => {
    setDisableJoinBtn(true);
    setDisableCreateBtn(true);
    const roomRef = await firestore.collection("rooms").doc();
    setRoomRef(roomRef);
    console.log("Create PeerConnection with configuration: ", configuration);
    const peerConnection = new RTCPeerConnection(configuration);
    setPeerConnection(peerConnection);

    // Code for creating a room below
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Created offer:", offer);

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await roomRef.set(roomWithOffer);
    setRoomId(roomRef.id);
    setCallerOrCallee("caller");
    console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
    alert(`Current room is ${roomRef.id} - You are the caller!`);
    // Code for creating a room above

    peerConnection.addEventListener("track", handletrack);

    // Listening for remote session description below
    const roomRefSubscription = roomRef.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log("Got remote description: ", data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
    setRoomRefSubscription(roomRefSubscription);
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    const calleeCandidatesSubscription = roomRef
      .collection("calleeCandidates")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            console.log(
              `Got new remote ICE candidate: ${JSON.stringify(data)}`
            );
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    setCalleeCandidatesSubscription(calleeCandidatesSubscription);
    // Listen for remote ICE candidates above
  };

  function joinRoom() {
    setDisableCreateBtn(true);
    setDisableJoinBtn(true);
    setShowRoomIdModal(true);
  }

  React.useEffect(() => {
    if (roomId && callerOrCallee === "callee") {
      (async () => {
        console.log("Join room: ", roomId);
        console.log(`Current room is ${roomId} - You are the callee!`);
        await joinRoomById(roomId);
      })();
    }
  }, [roomId]);

  async function joinRoomById(roomId) {
    const roomRef = firestore.collection("rooms").doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
    console.log("Got room:", roomSnapshot.exists);

    if (roomSnapshot.exists) {
      console.log("Create PeerConnection with configuration: ", configuration);
      const peerConnection = new RTCPeerConnection(configuration);
      setPeerConnection(peerConnection);

      // Code for collecting ICE candidates below
      peerConnection.addEventListener("icecandidate", handleicecandidatecallee);
      // Code for collecting ICE candidates above

      peerConnection.addEventListener("track", handletrack);

      // Code for creating SDP answer below
      const offer = roomSnapshot.data().offer;
      console.log("Got offer:", offer);
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      console.log("Created answer:", answer);
      await peerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await roomRef.update(roomWithAnswer);
      // Code for creating SDP answer above

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
              await peerConnection.addIceCandidate(new RTCIceCandidate(data));
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
                setRoomId(e.target["room-id"].value);
                setCallerOrCallee("callee");
                e.target.reset();
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
