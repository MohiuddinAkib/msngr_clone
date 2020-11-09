import admin from "@config/admin";
import Cookies from "universal-cookie";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

export const checkAuth = async (context: GetServerSidePropsContext) => {
    const cookies = new Cookies(context.req.headers.cookie);
    const idToken = cookies.get("auth");

    if (!idToken) {
        return false;
    }

    const decoded = await admin.auth().verifyIdToken(idToken)

    return !!decoded
}

export const getServerSidePropsPrivate = (inner?: GetServerSideProps): GetServerSideProps => {
    return async (context) => {
        const auth = await checkAuth(context)

        if (!auth) {
            return {
                props: {},
                redirect: {
                    permanent: true,
                    destination: `/login?next=${context.req.url}`
                }
            };
        }

        return inner ? inner(context) : {props: {}};
    };
};


export const getServerSidePropsPublic = (inner?: GetServerSideProps): GetServerSideProps => {
    return async (context) => {
        const auth = await checkAuth(context)

        if (auth) {
            return {
                props: {},
                redirect: {
                    permanent: true,
                    destination: "/"
                }
            };
        }

        return inner ? inner(context) : {props: {}};
    };
};
