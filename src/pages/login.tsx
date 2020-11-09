import React from "react";
import {NextPage} from "next";
import AuthLayout from "@layouts/AuthLayout";
import withGuest from "@components/auth/withGuest";
import LoginComponent from "@components/auth/Login";

const Login: NextPage = () => {
    return (
        <AuthLayout>
            <LoginComponent/>
        </AuthLayout>
    );
};

export default withGuest(Login);

// export const getServerSideProps: GetServerSideProps = getServerSidePropsPublic()

