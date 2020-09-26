import React from "react";
import {NextPage} from "next";
import Cookies from "universal-cookie"
import {useSelector} from "react-redux";
import Router, {useRouter,} from "next/router";
import {RootState} from "@store/configureStore";
import {FirebaseReducer, isLoaded, isEmpty} from "react-redux-firebase";


const withAuth = (WrappedComponent: NextPage): NextPage => {
    return class AuthComponent extends React.Component {
        static async getInitialProps(ctx) {
            const cookeis = new Cookies(ctx.req && ctx.req.headers.cookie)
            const idToken = cookeis.get("auth")

            //TODO: complete the authentication SSR

            // if (!idToken) {
            //     if (ctx.res) {
            //         // server
            //         // 303: "See other"
            //         ctx.res.writeHead(303, {Location: "/login"});
            //         ctx.res.end();
            //     } else {
            //         // In the browser, we just pretend like this never even happened ;)
            //         Router.replace("/login");
            //     }
            //     return {};
            // }
            //
            return {};
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}


export default withAuth;