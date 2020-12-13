import React from "react";
import { NextPage } from "next";
import withAuth from "@components/auth/withAuth";
import MessengerLayout from "@layouts/MessengerLayout";
import HeaderComponent from "@components/messenger/header/main/Header";
import InfoListDrawerComponent from "@components/messenger/InfoListDrawer";
import ListDrawerComponent from "@components/messenger/convesation/ListDrawer";
import LayoutContentComponent from "@components/messenger/content/LayoutContent";
import MessageListContainer from "@containers/messenger/MessageListContainer/MessageListContainer";

const Conversation: NextPage = (props) => {
  return (
    <MessengerLayout>
      <HeaderComponent />
      <ListDrawerComponent />
      <LayoutContentComponent>
        <MessageListContainer />
      </LayoutContentComponent>
      <InfoListDrawerComponent />
    </MessengerLayout>
  );
};

export default withAuth(Conversation);
