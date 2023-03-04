import { Button, Container, Space, Title } from "@mantine/core";
import { FcGoogle } from "react-icons/fc";
import React from "react";
import { firebaseSigninWithGoogle } from "@/app/firebase/auth.firebase";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

const Entry = () => {
  const router = useRouter();
  const handleSignin = async () => {
    try {
      await firebaseSigninWithGoogle();
      router.push("/");
    } catch (error: any) {
      notifications.show({
        color: "red",
        title: "Something went wrong!",
        message: error.message,
      });
    }
  };

  return (
    <Container size={"xs"} my={"lg"}>
      <Title order={3} align={"center"} color={"gray.7"}>
        Access using google Account
      </Title>
      <Space h={"lg"} />
      <Button
        variant={"default"}
        leftIcon={<FcGoogle />}
        fullWidth
        onClick={handleSignin}
      >
        Sign in with Google
      </Button>
    </Container>
  );
};

export default Entry;
