import React from "react";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import PhoneIcon from "@material-ui/icons/Phone";
import IconButton from "@material-ui/core/IconButton";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { getSidebarTrigger } from "@mui-treasury/layout";

const SidebarTrigger = getSidebarTrigger(styled);

const ActionBtnsComponent = () => {
  const handleAudioCall = () => {
    window.open(
      "http://127.0.0.1:3000/messages",
      "Messenger Clone",
      "modal=yes;alwaysRaised=yes"
    );
  };

  const handleVideoCall = () => {
    window.open(
      "http://127.0.0.1:3000/messages",
      "Messenger Clone",
      "modal=yes;alwaysRaised=yes"
    );
  };

  return (
    <>
      <IconButton color={"primary"} onClick={handleAudioCall}>
        <PhoneIcon />
      </IconButton>

      <IconButton color={"primary"} onClick={handleVideoCall}>
        <VideoCallIcon />
      </IconButton>

      <SidebarTrigger color={"primary"} sidebarId={"right_sidebar"}>
        {({ open, anchor }) => {
          if (!open) return <InfoIcon />;
          if (anchor === "left") return <InfoIcon />;
          if (anchor === "right") return <InfoIcon />;
        }}
      </SidebarTrigger>
    </>
  );
};

export default ActionBtnsComponent;
