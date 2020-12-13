import React from "react";
import { NextPage } from "next";
import AuthLayout from "@layouts/AuthLayout";
import withGuest from "@components/auth/withGuest";
import RegisterComponent from "@components/auth/Register";

const Register: NextPage = () => {
  return (
    <AuthLayout>
      <RegisterComponent />
    </AuthLayout>
  );
};

export default withGuest(Register);
