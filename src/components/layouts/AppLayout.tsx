import { AppShell, Container, Header, Navbar } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import AppHeader from "../layout-components/AppHeader";

interface AppLayoutProps {
  fluidLayout?: boolean;
  Leading?: React.ReactNode;
  Actions?: React.ReactNode;
}
const AppLayout: React.FC<PropsWithChildren<AppLayoutProps>> = ({
  children,
  fluidLayout = false,
  Leading,
  Actions,
}) => {
  return (
    <AppShell
      padding="md"
      header={<AppHeader Leading={Leading} Actions={Actions} />}
    >
      <Container size={fluidLayout ? "98%" : "xl"}>{children}</Container>
    </AppShell>
  );
};

export default AppLayout;
