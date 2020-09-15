import React from "react";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import PhoneIcon from "@material-ui/icons/Phone";
import IconButton from "@material-ui/core/IconButton";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import {getSidebarTrigger} from "@mui-treasury/layout";

const SidebarTrigger = getSidebarTrigger(styled)


const ActionBtnsComponent = () => {
    return (
        <>
            <IconButton color={"primary"}>
                <PhoneIcon/>
            </IconButton>

            <IconButton color={"primary"}>
                <VideoCallIcon/>
            </IconButton>

            <SidebarTrigger sidebarId={"right_sidebar"} color={"primary"}>
                {({open, anchor}) => {
                    if (!open) return <InfoIcon/>
                    if (anchor === "left") return <InfoIcon/>
                    if (anchor === "right") return <InfoIcon/>
                }}
            </SidebarTrigger>
        </>
    );
};

export default ActionBtnsComponent;