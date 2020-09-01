import React from 'react';
import styled from "styled-components";
import {getDrawerSidebar, getSidebarContent} from "@mui-treasury/layout";
import Toolbar from '@material-ui/core/Toolbar';

const DrawerSidebar = getDrawerSidebar(styled);
const SidebarContent = getSidebarContent(styled)

const InfoListDrawerComponent: React.FC = (props) => {
    return (
        <DrawerSidebar sidebarId={"right_sidebar"}>
            <Toolbar/>
            <SidebarContent>
                right sidebar content
            </SidebarContent>
        </DrawerSidebar>
    );
};

export default InfoListDrawerComponent;