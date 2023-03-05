import { firebaseApp } from "@/app/firebase/app.firebase";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import BoardCard from "@/components/BoardCard";
import AppLayout from "@/components/layouts/AppLayout";
import {
  Button,
  Card,
  Input,
  Modal,
  Skeleton,
  Space,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BoardController } from "@/app/controllers/boardController";
import { useAuth } from "@/auth/AuthContext";
import { notifications } from "@mantine/notifications";
import { IBoard } from "@/app/models/board.model";
import { useRouter } from "next/router";

const HomePage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [editableBoard, setEditableBoard] = useState<IBoard | null>(null);
  const db = getFirestore(firebaseApp);
  const board = useMemo(() => new BoardController(db), [db]);
  const { authUser } = useAuth();
  const router = useRouter();

  const fetchBoards = useCallback(() => {
    setLoadingBoards(true);
    board.getBoards(authUser?.uid!).then((res) => {
      setBoards(res);
      setLoadingBoards(false);
    });
  }, [authUser, board]);

  useEffect(() => {
    fetchBoards();
  }, [board, fetchBoards]);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmitCreateBoard = (data: any) => {
    setLoading(true);
    if (!editableBoard) {
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
    } else {
      board
        .upDateBoard(editableBoard.id!, {
          name: data.name,
          ownerId: authUser?.uid!,
        })
        .then((res) => {
          setCreateModalOpen(false);
          setLoading(false);
          notifications.show({
            color: "teal",
            message: "Board updated successfully!",
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
    }
  };

  const handleOnDeleteBoard = (id: string) => {
    board
      .deleteBoard(id)
      .then((res) => {
        notifications.show({
          color: "teal",
          message: "Board deleted successfully!",
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
          {loadingBoards &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                radius="md"
                style={{ width: "100%", height: "65px" }}
              />
            ))}
          {boards.map((board) => (
            <BoardCard
              title={board.name}
              key={board.id}
              onClick={() => router.push(`/board/${board.id}`)}
              onClickDelete={() => handleOnDeleteBoard(board.id!)}
              onClickEdit={() => {
                setEditableBoard(board);
                setValue("name", board.name);
                setCreateModalOpen(true);
              }}
            />
          ))}
          <div
            className="p-2 border border-gray-300 hover:bg-slate-50 cursor-pointer border-solid rounded-md min-h-[65px] shadow-sm grid place-content-center"
            onClick={() => setCreateModalOpen(true)}
          >
            <AiOutlinePlus size={28} />
          </div>
        </div>
      </AppLayout>
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Board"
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
