import React from "react";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IProfile } from "@src/models/IProfile";
import { RootState } from "@store/configureStore";
import { useErrorHandler } from "react-error-boundary";
import AuthIsLoadedComponent from "@components/auth/AuthIsLoaded";
import {
  isEmpty,
  isLoaded,
  useFirebase,
  FirebaseReducer,
} from "react-redux-firebase";

const initialLoginValues = {
  email: "",
  password: "",
};

const initialRegisterValues = {
  email: "",
  password: "",
  last_name: "",
  first_name: "",
};

export const AuthContext = React.createContext({
  user: null,
  profile: null,
  initialLoginValues,
  authenticated: false,
  initialRegisterValues,
  profileLoading: false,
  handleLogout: () => null,
  handleLogin: (values: typeof initialLoginValues) => null,
  handleRegister: (values: typeof initialRegisterValues) => null,
});

const AuthProvider: React.FC = (props) => {
  const router = useRouter();
  const cookies = new Cookies();
  const firebase = useFirebase();
  const handleError = useErrorHandler();
  const auth = useSelector<RootState, FirebaseReducer.AuthState>(
    (state) => state.firebase.auth
  );
  // Profile related starts
  const profile = useSelector<RootState, FirebaseReducer.Profile<IProfile>>(
    (state) => state.firebase.profile
  );
  // Profile related ends;

  const handleLogin = async (values: typeof initialLoginValues) => {
    try {
      await firebase.login(values);

      const redirecPath = (router.query.next as string) || "/";
      router.replace({ pathname: redirecPath });
    } catch (e) {
      handleError(e);
    }
  };

  const handleRegister = async (values: typeof initialRegisterValues) => {
    try {
      const { email, password, ...profile } = values;
      await firebase.createUser({ email, password }, profile);
    } catch (e) {
      handleError(e);
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.logout();

      router.replace({
        pathname: "/login",
      });
    } catch (error) {
      handleError(error);
    }
  };

  React.useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        cookies.set("auth", token);
      } else {
        cookies.remove("auth");
      }
    });
  }, []);

  return (
    <AuthIsLoadedComponent>
      <AuthContext.Provider
        value={{
          profile,
          user: auth,
          handleLogin,
          handleLogout,
          handleRegister,
          initialLoginValues,
          initialRegisterValues,
          profileLoading: !isLoaded(profile),
          authenticated: !isEmpty(auth) && isLoaded(auth),
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </AuthIsLoadedComponent>
  );
};

export default AuthProvider;
