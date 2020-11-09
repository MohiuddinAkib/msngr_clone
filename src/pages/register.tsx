import React from "react";
import {GetServerSideProps, NextPage} from "next";
import AuthLayout from "@layouts/AuthLayout";
import withGuest from "@components/auth/withGuest";
import RegisterComponent from "@components/auth/Register";
import {getServerSidePropsPublic} from "@src/utils/auth";


const Register: NextPage = () => {
    return (
        <AuthLayout>
            <RegisterComponent/>
        </AuthLayout>
    );
};

export default withGuest(Register);
// export const getServerSideProps: GetServerSideProps = getServerSidePropsPublic()

