import React from "react";
import Cookies from "universal-cookie";
import withAuth from "@components/auth/withAuth";
import MessengerLayout from "@layouts/MessengerLayout";
import firebaseAdminApi from "@src/api/firebaseAdminApi";
import HeaderComponent from "@components/messenger/header/main/Header";
import InfoListDrawerComponent from "@components/messenger/InfoListDrawer";
import { GetServerSideProps, NextPage, GetServerSidePropsContext } from "next";
import LayoutContentComponent from "@components/messenger/content/LayoutContent";
import ListDrawerComponent from "@components/messenger/convesation/ConversationListDrawer";
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  try {
    const cookies = new Cookies(ctx.req.headers.cookie);
    const token = cookies.get("token");
    const auth = await firebaseAdminApi.auth().verifyIdToken(token);
    if (!auth) {
      return {
        props: {},
        redirect: "/login",
      };
    }
  } catch (error) {
  } finally {
    return {
      props: {},
    };
  }
};
