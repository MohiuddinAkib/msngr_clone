import React from "react";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {AuthContext} from "@src/context/messenger/auth";

export const withAuth = <T extends {}>(WrappedComponent: React.FC<T> | NextPage<T>) => {
    const Wrapper: React.FC<T> = props => {
        const router = useRouter()
        const authContext = React.useContext(AuthContext)
        const [render, setRender] = React.useState(false)

        React.useEffect(() => {
            if (!authContext.authenticated) {
                router.replace({
                    pathname: "/login",
                    query: {
                        next: router.pathname
                    }
                })
            } else {
                setRender(true)
            }

        }, [authContext.authenticated])

        return render && <WrappedComponent {...props} />
    }

    return Wrapper
}

export default withAuth;
