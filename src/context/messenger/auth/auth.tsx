import React from "react";
import {useRouter} from "next/router";
import Cookies from "universal-cookie";
import {useSelector} from "react-redux";
import {RootState} from "@store/configureStore";
import {useErrorHandler} from "react-error-boundary";
import AuthIsLoadedComponent from "@components/auth/AuthIsLoaded";
import {FirebaseReducer, isEmpty, isLoaded, useFirebase} from "react-redux-firebase";

const initialLoginValues = {
    email: "",
    password: "",
}

const initialRegisterValues = {
    email: "",
    password: "",
    last_name: "",
    first_name: "",
}

const publicroutes = ["/login", "/register", "forgot-password"]

export const AuthContext = React.createContext({
    initialLoginValues,
    initialRegisterValues,
    handleLogout: () => null,
    handleLogin: (values: typeof initialLoginValues) => null,
    handleRegister: (values: typeof initialRegisterValues) => null,
    authenticated: false,
})

const AuthProvider: React.FC = (props) => {
    const router = useRouter()
    const cookies = new Cookies()
    const firebase = useFirebase()
    const handleError = useErrorHandler()
    const auth = useSelector<RootState, FirebaseReducer.AuthState>(state => state.firebase.auth)

    const handleLogin = async (values: typeof initialLoginValues) => {
        try {
            await firebase.login(values)

            const redirecPath = router.query.next as string || "/"
            router.replace({pathname: redirecPath})
        } catch (e) {
            handleError(e)
        }
    }

    const handleRegister = async (values: typeof initialRegisterValues) => {
        try {
            const {email, password, ...profile} = values
            await firebase.createUser({email, password}, profile)
        } catch (e) {
            handleError(e)
        }
    }

    const handleLogout = async () => {
        try {
            await firebase.logout()

            router.replace({
                pathname: "/login"
            })
        } catch (error) {
            handleError(error)
        }
    }

    React.useEffect(() => {
        return firebase.auth().onIdTokenChanged(async user => {
            if (user) {
                const token = await user.getIdToken()
                cookies.set("auth", token)
            } else {
                cookies.remove("auth")
            }
        })
    }, [])

    return (
        <AuthIsLoadedComponent>
            <AuthContext.Provider value={{
                handleLogin,
                handleLogout,
                handleRegister,
                initialLoginValues,
                initialRegisterValues,
                authenticated: (!isEmpty(auth) && isLoaded(auth))
            }}>
                {props.children}
            </AuthContext.Provider>
        </AuthIsLoadedComponent>
    );
};

export default AuthProvider;
