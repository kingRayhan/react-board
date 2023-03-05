import { BoardController } from "@/app/controllers/boardController";
import { firebaseApp } from "@/app/firebase/app.firebase";
import { IBoard } from "@/app/models/board.model";
import { useAuth } from "@/auth/AuthContext";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import BoardCard from "@/components/BoardCard";
import AppLayout from "@/components/layouts/AppLayout";
import {
  Anchor,
  Button,
  Input,
  Modal,
  Skeleton,
  Space,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { queryClient } from "./_app";

const HomePage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editableBoard, setEditableBoard] = useState<IBoard | null>(null);
  const db = getFirestore(firebaseApp);
  const board = useMemo(() => new BoardController(db), [db]);
  const { authUser } = useAuth();
  const router = useRouter();

  const {
    data: boards,
    isLoading: loading__boards,
    refetch: refetch__boards,
  } = useQuery(["boards"], () => board.getBoards(authUser?.uid!), {
    enabled: !!authUser,
  });

  const { mutate: mutate__createBoard, isLoading: loading__createBoard } =
    useMutation((payload: IBoard) => board.createBoard(payload), {
      onSuccess: () => {
        refetch__boards();
        setCreateModalOpen(false);
      },
    });

  const { mutate: mutate__updateBoard, isLoading: loading__updateBoard } =
    useMutation((payload: IBoard) => board.upDateBoard(payload.id!, payload), {
      onSuccess: () => {
        refetch__boards();
        setCreateModalOpen(false);
      },
    });

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmitCreateBoard = (data: any) => {
    if (!editableBoard) {
      mutate__createBoard({
        name: data.name,
        index: boards?.length,
        ownerId: authUser?.uid!,
      });
    }

    if (editableBoard) {
      mutate__updateBoard({
        id: editableBoard.id,
        name: data.name,
        ownerId: authUser?.uid!,
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
        refetch__boards();
      })
      .catch((err) => {
        notifications.show({
          color: "red",
          message: "Something went wrong!",
        });
      });
  };

  const handleDragBoardCard = (
    result: DropResult,
    provided: ResponderProvided
  ) => {
    if (!result.destination) return;
    const items = boards ? [...boards] : [];
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    items![sourceIndex] = { ...boards![destinationIndex], index: sourceIndex };
    items![destinationIndex] = {
      ...boards![sourceIndex],
      index: destinationIndex,
    };

    board.upDateBoard(items![sourceIndex].id!, {
      ...items![sourceIndex],
      index: sourceIndex,
    });

    board.upDateBoard(items![destinationIndex].id!, {
      ...items![destinationIndex],
      index: destinationIndex,
    });
    queryClient.setQueryData(["boards"], items);
  };

  // sort boards by index asc
  const sortedBoards = boards?.sort((a, b) => a?.index! - b?.index!);

  return (
    <>
      <AppLayout>
        <Title order={4}>Boards</Title>
        <Space h={"lg"} />
        <div className="grid grid-cols-4 gap-2">
          {loading__boards &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                radius="md"
                style={{ width: "100%", height: "65px" }}
              />
            ))}

          {/* <div
            className="p-2 border border-gray-300 hover:bg-slate-50 cursor-pointer border-solid rounded-md min-h-[65px] shadow-sm grid place-content-center"
            onClick={() => setCreateModalOpen(true)}
          >
            <AiOutlinePlus size={28} />
          </div> */}
        </div>

        <DragDropContext onDragEnd={handleDragBoardCard}>
          <Droppable droppableId="boards" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-4 gap-2 "
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sortedBoards?.map((board, index) => (
                  <BoardCard
                    board={board}
                    key={board.id}
                    index={index}
                    onClick={() => router.push(`/board/${board.id}`)}
                    onClickDelete={() => handleOnDeleteBoard(board.id!)}
                    onClickEdit={() => {
                      setEditableBoard(board);
                      setValue("name", board.name);
                      setCreateModalOpen(true);
                    }}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Space h={"lg"} />

        <Anchor component="button" onClick={() => setCreateModalOpen(true)}>
          New Board
        </Anchor>
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
          <Button
            type="submit"
            loading={loading__createBoard || loading__updateBoard}
          >
            Save
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default withFirebaseProtection(HomePage);
