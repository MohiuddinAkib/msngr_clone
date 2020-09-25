import React from "react";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {RootState} from "@store/configureStore";
import {FirebaseReducer, isLoaded, isEmpty} from "react-redux-firebase";

const withAuth = <T extends object>(WrappedComponent: NextPage): React.FC<T> => {
    return (props) => {
        const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)
        const router = useRouter()

        React.useEffect(() => {
            if (isLoaded(auth) && isEmpty(auth)) {
                router.replace({
                    pathname: "/login",
                    query: {
                        next: router.pathname
                    }
                })
            }
        }, [auth])

        return <WrappedComponent/>
    }
}

export default withAuth;