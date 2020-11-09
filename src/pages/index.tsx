// @generated: @expo/next-adapter@2.1.29
import React from "react";
import Link from "next/link";
import {NextPage, GetServerSideProps} from "next";
import {Text, View} from "react-native";
import MUILink from "@material-ui/core/Link"
import withAuth from "@components/auth/withAuth";
import { getServerSidePropsPrivate } from "@src/utils/auth";

const App: NextPage = () => {
    return (
        <View
        >
            <Text
            >
                Welcome to Expo + Next.js 👋
            </Text>

            <Link href={"/messages"} passHref>
                <MUILink>Go to messages</MUILink>
            </Link>

            <Link href={"/login"} passHref>
                <MUILink>Go to messages</MUILink>
            </Link>
        </View>
    );
}

export default withAuth(App)

// export const getServerSideProps: GetServerSideProps = getServerSidePropsPrivate()
