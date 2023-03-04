import {
  firebaseLogout,
  firebaseSigninWithGoogle,
} from "@/app/firebase/auth.firebase";
import { useAuth } from "@/auth/AuthContext";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import BoardCard from "@/components/BoardCard";
import AppLayout from "@/components/layouts/AppLayout";
import {
  AppShell,
  Card,
  Group,
  Header,
  Title,
  Text,
  Image,
  Badge,
  Button,
  Space,
} from "@mantine/core";
import { AiOutlinePlus } from "react-icons/ai";

const HomePage = () => {
  const { authUser, loading } = useAuth();

  const handleSignin = () => {
    firebaseSigninWithGoogle()
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AppLayout>
      <Title order={4}>Boards</Title>
      <Space h={"lg"} />
      <div className="grid grid-cols-4 gap-2">
        <BoardCard title={"Card 1"} />
        <BoardCard title={"Card 2"} />
        <BoardCard
          title={"Card 3"}
          imageUrl={
            "https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1450&q=80"
          }
        />
        <Card
          padding="lg"
          radius="md"
          withBorder
          component="button"
          className="cursor-pointer"
        >
          <AiOutlinePlus size={28} />
        </Card>
      </div>
    </AppLayout>
  );
};

export default withFirebaseProtection(HomePage);
