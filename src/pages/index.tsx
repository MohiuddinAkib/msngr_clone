// @generated: @expo/next-adapter@2.1.29
import React from "react";
import {NextPage} from "next";
import withAuth from "@components/auth/withAuth";
import {StyleSheet, Text, View} from "react-native";

const App: NextPage = () => {
    return (
        <View
        >
            <Text
            >
                Welcome to Expo + Next.js 👋
            </Text>
        </View>
    );
}

export default withAuth(App)