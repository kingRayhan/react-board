import { firebaseLogout } from "@/app/firebase/auth.firebase";
import { useAuth } from "@/auth/AuthContext";
import {
  Avatar,
  Burger,
  Header,
  MediaQuery,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { HiLogout } from "react-icons/hi";

const AppHeader = () => {
  const { authUser } = useAuth();

  const handleClickLogout = () => {
    firebaseLogout();
  };

  return (
    <Header px={"md"} height={45} className={"flex items-center"}>
      <div className="flex items-center justify-between w-full">
        {/* <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery> */}

        <Link href={"/"} className="no-underline text-slate-800">
          React Board
        </Link>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton className="flex items-center gap-1">
              <Avatar src={authUser?.photoURL} />
              <Text>{authUser?.displayName}</Text>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={handleClickLogout} icon={<HiLogout />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </Header>
  );
};

export default AppHeader;
