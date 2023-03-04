import { firebaseApp } from "@/app/firebase/app.firebase";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import BoardCard from "@/components/BoardCard";
import AppLayout from "@/components/layouts/AppLayout";
import { Button, Card, Input, Modal, Space, Title } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BoardController } from "@/app/controllers/boardController";
import { useAuth } from "@/auth/AuthContext";
import { notifications } from "@mantine/notifications";
import { IBoard } from "@/app/models/board.model";

const HomePage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const db = getFirestore(firebaseApp);
  const board = useMemo(() => new BoardController(db), [db]);
  const { authUser } = useAuth();

  const fetchBoards = useCallback(() => {
    board.getBoards(authUser?.uid!).then((res) => {
      setBoards(res);
    });
  }, [authUser, board]);

  useEffect(() => {
    fetchBoards();
  }, [board, fetchBoards]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmitCreateBoard = (data: any) => {
    setLoading(true);
    board
      .createBoard({
        name: data.name,
        ownerId: authUser?.uid!,
        createdAt: serverTimestamp(),
      })
      .then((res) => {
        setCreateModalOpen(false);
        setLoading(false);
        notifications.show({
          color: "teal",
          message: "Board created successfully!",
        });
        fetchBoards();
      })
      .catch((err) => {
        notifications.show({
          color: "red",
          message: "Something went wrong!",
        });
        console.log(err.message);
      });
  };

  return (
    <>
      <AppLayout>
        <Title order={4}>Boards</Title>
        <Space h={"lg"} />
        <div className="grid grid-cols-4 gap-2">
          {boards.map((board) => (
            <BoardCard title={board.name} key={board.id} />
          ))}
          <Card
            padding="lg"
            radius="md"
            withBorder
            component="button"
            className="cursor-pointer"
            onClick={() => setCreateModalOpen(true)}
          >
            <AiOutlinePlus size={28} />
          </Card>
        </div>
      </AppLayout>
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Board"
      >
        <form action="#" onSubmit={handleSubmit(onSubmitCreateBoard)}>
          <Input.Wrapper label="Board Name">
            <Input placeholder="Enter board name" {...register("name")} />
          </Input.Wrapper>
          <Space h={"sm"} />
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default withFirebaseProtection(HomePage);
