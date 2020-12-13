import React from "react";
import { NextPage } from "next";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";

const withGuest = <T extends {}>(
  WrappedComponent: React.FC<T> | NextPage<T>
) => {
  const Wrapper: React.FC<T> = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const [render, setRender] = React.useState(false);

    React.useEffect(() => {
      if (auth.authenticated) {
        const redirecPath = (router.query.next as string) || "/";
        router.replace({ pathname: redirecPath });
      } else {
        setRender(true);
      }
    }, [auth.authenticated]);

    return render && <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withGuest;
