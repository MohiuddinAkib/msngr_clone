import React from "react";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { cookies } from "@src/api/cookiesApi";
import { IProfile } from "@src/models/IProfile";
import * as AuthTypes from "@firebase/auth-types";
import { useErrorHandler } from "react-error-boundary";
import { COLLECTIONS } from "@src/api/firebaseClientApi";
import { IUserPresence } from "@src/models/IUserPresence";
import { RootState, useAppDispatch } from "@store/configureStore";
import AuthIsLoadedComponent from "@components/auth/AuthIsLoaded";
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirebaseConnect,
  FirebaseReducer,
} from "react-redux-firebase";
import { login, logout, register } from "@store/features/auth/authSlice";

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

export const AuthContext = React.createContext<{
  user: AuthTypes.UserInfo;
  profile: FirebaseReducer.Profile<IProfile>;
  initialLoginValues: typeof initialLoginValues;
  authenticated: boolean;
  initialRegisterValues: typeof initialRegisterValues;
  profileLoading: boolean;
  handleLogout: Function;
  handleLogin: Function;
  handleRegister: Function;
  presence: Record<string, IUserPresence>;
  presenceLoaded: boolean;
  getUserPresence: (userId: string) => IUserPresence;
}>({
  user: null,
  profile: null,
  initialLoginValues,
  authenticated: false,
  initialRegisterValues,
  profileLoading: false,
  handleLogout: () => null,
  handleLogin: (values: typeof initialLoginValues) => null,
  handleRegister: (values: typeof initialRegisterValues) => null,
  presence: null,
  presenceLoaded: null,
  getUserPresence: null,
});

const AuthProvider: React.FC = (props) => {
  const router = useRouter();
  const firebase = useFirebase();
  const dispatch = useAppDispatch();
  const handleError = useErrorHandler();
  const auth = useSelector<RootState, FirebaseReducer.AuthState>(
    (state) => state.firebase.auth
  );
  const presence = useSelector<RootState, Record<string, IUserPresence>>(
    (state) => state.firebase.data.presence
  );
  // Profile related starts
  const profile = useSelector<RootState, FirebaseReducer.Profile<IProfile>>(
    (state) => state.firebase.profile
  );
  // Profile related ends;

  useFirebaseConnect(COLLECTIONS.presence);

  React.useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        cookies.set("token", "");
      } else {
        const token = await user.getIdToken();
        cookies.set("token", token);
      }
    });
  }, []);

  function userStatusAwayOnDocumentVisibilityHanler(e) {
    firebase
      .database()
      .ref(`presence/${auth.uid}`)
      .once("value", (snapshot) => {
        if (document.visibilityState === "hidden") {
          if (snapshot.exists()) {
            snapshot.ref.update({
              state: "away",
              last_changed: moment().toISOString(),
            });
          } else {
          }
        } else {
          if (snapshot.exists()) {
            snapshot.ref.update({
              state: "online",
              last_changed: moment().toISOString(),
            });
          } else {
          }
        }
      });
  }

  React.useEffect(() => {
    const authLoaded = isLoaded(auth) && !isEmpty(auth);
    if (authLoaded) {
      document.addEventListener(
        "visibilitychange",
        userStatusAwayOnDocumentVisibilityHanler
      );

      // Monitor connection state on browser tab
      firebase
        .database()
        .ref(".info/connected")
        .on("value", function (snap) {
          if (snap.val()) {
            firebase
              .database()
              .ref(`${COLLECTIONS.presence}/${auth.uid}`)
              .once("value", (snapshot) => {
                if (snapshot.exists()) {
                  snapshot.ref.update({
                    state: "online",
                    last_changed: moment().toISOString(),
                  });

                  // if we lose network then remove this user from the list
                  snapshot.ref.onDisconnect().update({
                    state: "offline",
                    last_changed: moment().toISOString(),
                  });
                } else {
                  snapshot.ref.push({
                    state: "online",
                    last_changed: moment().toISOString(),
                  });
                }
              });
          } else {
            // client has lost network
            console.log("offline");
          }
        });
    }

    return () => {
      if (authLoaded) {
        document.removeEventListener(
          "visibilitychange",
          userStatusAwayOnDocumentVisibilityHanler
        );
      }
    };
  }, [auth]);

  const handleLogin = async (values: typeof initialLoginValues) => {
    try {
      const resultAction = await dispatch(login(values));

      if (login.fulfilled.match(resultAction)) {
        const redirecPath = (router.query.next as string) || "/";
        router.replace({ pathname: redirecPath });
      }
    } catch (e) {
      handleError(e);
    }
  };

  const handleRegister = async (values: typeof initialRegisterValues) => {
    try {
      await dispatch(register(values));
    } catch (e) {
      handleError(e);
    }
  };

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logout());

      if (logout.fulfilled.match(resultAction)) {
        router.replace({
          pathname: "/login",
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getUserPresence = React.useCallback(
    (userId: string) => {
      return !isEmpty(auth) && isLoaded(auth)
        ? presence[userId]
        : ({ state: "offline", last_changed: "" } as IUserPresence);
    },
    [presence]
  );

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
          presence,
          presenceLoaded: isLoaded(presence) && !isEmpty(presence),
          getUserPresence,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    </AuthIsLoadedComponent>
  );
};

export default AuthProvider;
