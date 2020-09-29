import React from "react";
import {NextPage} from "next";
import Router from "next/router";
import Cookies from "universal-cookie";

const WithGuest = (WrappedComponent: NextPage): NextPage => {
    return class GuestComponent extends React.Component {
        static async getInitialProps(ctx) {
            const cookeis = new Cookies(ctx.req && ctx.req.headers.cookie)
            const idToken = cookeis.get("auth")

            try {
                const res = await fetch("http://localhost:3000/api/check-auth", {
                    headers: {
                        "Authorization": idToken,
                        "Content-Type": "application/json",
                    }
                })
                const data = await res.json()

                if (res.ok || data.msg === "Authenticated") {
                    if (ctx.res) {
                        // server
                        // 303: "See other"
                        ctx.res.writeHead(303, {Location: `/`});
                        ctx.res.end();
                    } else {
                        // In the browser, we just pretend like this never even happened ;)
                        Router.back();
                    }
                    return {};
                }

            } catch (e) {
                if (ctx.res) {
                    // server
                    // 303: "See other"
                    ctx.res.writeHead(303, {Location: `/`});
                    ctx.res.end();
                } else {
                    // In the browser, we just pretend like this never even happened ;)
                    Router.back();
                }
            }

            return {};
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default WithGuest;