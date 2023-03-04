import { LoadingOverlay } from "@mantine/core";
import { useRouter } from "next/router";
import React, { ComponentType, useEffect, FC } from "react";
import { useAuth } from "./AuthContext";

const withFirebaseProtection = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  const WithAuthenticationRequired: FC<P> = (props) => {
    const { loading, authUser } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!loading && !authUser) {
        router.push("/entry");
      }
    }, [loading, authUser, router]);

    if (loading || !authUser) {
      return (
        <div>
          <LoadingOverlay overlayBlur={100} visible={true} />
        </div>
      );
    }

    return <Component {...props} />;
  };

  return WithAuthenticationRequired;
};

export default withFirebaseProtection;
