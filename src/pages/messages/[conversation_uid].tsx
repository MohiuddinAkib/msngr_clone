import React from "react";
import withAuth from "@components/auth/withAuth";
import {GetServerSideProps, NextPage} from "next";
import MessengerLayout from "@layouts/MessengerLayout";
import {getServerSidePropsPrivate} from "@src/utils/auth";
import MessageListComponent from "@containers/messenger/MessageList";
import HeaderComponent from "@components/messenger/header/main/Header";
import InfoListDrawerComponent from "@components/messenger/InfoListDrawer";
import ListDrawerComponent from "@components/messenger/convesation/ListDrawer";
import LayoutContentComponent from "@components/messenger/content/LayoutContent";

const Conversation: NextPage = (props) => {
    return (
        <MessengerLayout>
            <HeaderComponent/>
            <ListDrawerComponent/>
            <LayoutContentComponent>
                <MessageListComponent/>
            </LayoutContentComponent>
            <InfoListDrawerComponent/>
        </MessengerLayout>
    );
};

export default withAuth(Conversation);

// export const getServerSideProps: GetServerSideProps = getServerSidePropsPrivate()

