import { AppShell, Container, Header, Navbar } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import AppHeader from "../layout-components/AppHeader";

interface AppLayoutProps {}
const AppLayout: React.FC<PropsWithChildren<AppLayoutProps>> = ({
  children,
}) => {
  return (
    <AppShell padding="md" header={<AppHeader />}>
      <Container size={"lg"}>{children}</Container>
    </AppShell>
  );
};

export default AppLayout;
