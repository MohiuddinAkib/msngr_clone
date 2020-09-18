import React from "react"
import {NextPage} from "next";
import MessengerLayout from "@layouts/MessengerLayout";
import MessengerProvider from "@src/context/messenger";
import MessageListComponent from "@containers/messenger/MessageList";
import HeaderComponent from "@components/messenger/header/main/Header";
import InfoListDrawerComponent from "@components/messenger/InfoListDrawer";
import ListDrawerComponent from "@components/messenger/convesation/ListDrawer";
import LayoutContentComponent from "@components/messenger/content/LayoutContent";

const Index: NextPage = (props) => {

    React.useEffect(() => {

    }, [])

    return (
        <MessengerProvider>
            <MessengerLayout>
                <HeaderComponent/>
                <ListDrawerComponent/>
                <LayoutContentComponent>
                    <MessageListComponent/>
                </LayoutContentComponent>

                <InfoListDrawerComponent/>
            </MessengerLayout>
        </MessengerProvider>
    );
};

export default Index;