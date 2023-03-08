import { BoardController } from "@/app/controllers/boardController";
import { ColumnController } from "@/app/controllers/columnController";
import { firebaseApp } from "@/app/firebase/app.firebase";
import { IBoardColumn } from "@/app/models/board-column.model";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import BoardColumn from "@/components/BoardColumn";
import AppLayout from "@/components/layouts/AppLayout";
import {
  Anchor,
  Button,
  Input,
  Modal,
  Skeleton,
  Space,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";
import { getFirestore } from "firebase/firestore";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { queryClient } from "../_app";

const items = [
  {
    id: 1,
    title: "Board 1",
    description: "This is board 1",
  },
  {
    id: 2,
    title: "Board 2",
    description: "This is board 2",
  },
  {
    id: 3,
    title: "Board 3",
    description: "This is board 3",
  },
];

interface PageProp {
  boardId: string;
}

const BoardInsidePage: NextPage<PageProp> = ({ boardId }) => {
  const db = getFirestore(firebaseApp);
  const columnController = useMemo(() => new ColumnController(db), [db]);
  const boardController = useMemo(() => new BoardController(db), [db]);
  const boardNameInputRef = React.useRef<HTMLInputElement>(null);
  const [boardNameInputWidth, setBoardNameInputWith] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);

  const { data: board, refetch: refetch__board } = useQuery(
    [`boards/${boardId}`],
    () => boardController.getBoardDetails(boardId)
  );

  const { data: columns, refetch: refetch__columns } = useQuery(
    [`boards/${boardId}/column`],
    () => {
      return columnController.getColumnsByBoardId(boardId);
    }
  );

  const { data } = useQuery([`columns/${boardId}`], () =>
    columnController.getColumnsByBoardId(boardId)
  );

  const handleChangeBoardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    boardController.upDateBoard(board?.id!, { name: e.target.value });
  };

  function handleOnDragEnd(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;

    if (result.type === "COLUMN") {
      const items = Array.from(columns!);
      const sourceColumn = items[result.source.index];
      const destinationColumn = items[result.destination.index];

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      queryClient.setQueryData(
        [`boards/${boardId}/column`],
        items.map((item, index) => ({ ...item, index }))
      );

      // update to firebase
      columnController.updateColumn(boardId, sourceColumn.id!, {
        index: result.destination.index,
      });
      columnController.updateColumn(boardId, destinationColumn.id!, {
        index: result.source.index,
      });
      return;
    }
  }

  useEffect(() => {
    refetch__board();
  }, [boardId, refetch__board]);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const handleSubmitCreateNewColumn = (data: any) => {
    try {
      columnController.createColumnForBoard(boardId, {
        name: data.name,
        index: columns?.length,
      });
      setModelOpen(false);
      refetch__columns();
    } catch (error) {}
  };

  const handleDeleteColumn = (column: IBoardColumn) => {
    modals.openConfirmModal({
      title: `Sure to delete column "${column.name!}"`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete column <b>{column.name!}</b>? This
          action cannot be undone. All cards in this column will be deleted.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: async () => {
        await columnController.deleteColumn(board?.id!, column.id!);
        refetch__columns();
      },
    });
  };

  return (
    <AppLayout
      fluidLayout
      Leading={
        <>
          <div className="flex items-center gap-3">
            <Text className="flex font-semibold text-gray-800">
              <span>Boards/</span>
              {board ? (
                <input
                  defaultValue={board?.name}
                  onBlur={handleChangeBoardName}
                  ref={boardNameInputRef}
                  className="border-none"
                  style={{
                    width: boardNameInputRef
                      ? boardNameInputRef.current?.value.length + "ch"
                      : "auto",
                  }}
                />
              ) : (
                <Skeleton width={100} height={25} />
              )}
            </Text>
            <Anchor
              size={"sm"}
              component="button"
              onClick={() => setModelOpen(true)}
            >
              Add Column
            </Anchor>
          </div>
        </>
      }
    >
      <pre>{JSON.stringify(board, null, 2)}</pre>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              className="flex "
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns
                ?.sort((a, b) => a?.index! - b?.index!)
                .map((column, index) => (
                  <BoardColumn
                    key={index}
                    column={column}
                    index={index}
                    onColumnAction={function (
                      action: "delete" | "edit",
                      column: IBoardColumn
                    ) {
                      if (action === "delete") {
                        handleDeleteColumn(column);
                      }
                    }}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        opened={modelOpen}
        onClose={() => setModelOpen(false)}
        title="New Column"
      >
        <form action="#" onSubmit={handleSubmit(handleSubmitCreateNewColumn)}>
          <Input.Wrapper label="Column Name">
            <Input placeholder="Enter board name" {...register("name")} />
          </Input.Wrapper>
          <Space h={"sm"} />
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default withFirebaseProtection(BoardInsidePage);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { boardId: query.boardId } };
};
