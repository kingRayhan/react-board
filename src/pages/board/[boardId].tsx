import AppLayout from "@/components/layouts/AppLayout";
import { GetServerSideProps, NextPage } from "next";
import React, { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  DropResult,
  OnDragEndResponder,
  ResponderProvided,
} from "react-beautiful-dnd";
import { IBoardColumn } from "@/app/models/board-column.model";
import withFirebaseProtection from "@/auth/withFirebaseProtection";
import { ColumnController } from "@/app/controllers/columnController";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/app/firebase/app.firebase";
import { useQuery } from "@tanstack/react-query";
const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false }
);
const Droppable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Droppable;
    }),
  { ssr: false }
);
const Draggable = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.Draggable;
    }),
  { ssr: false }
);

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

  const { data } = useQuery([`columns/${boardId}`], () =>
    columnController.getColumnsByBoardId(boardId)
  );

  const [boardColumns, setBoardColumns] = React.useState<IBoardColumn[]>([
    {
      index: 0,
      id: "1",
      name: "To Do",
      cards: [
        {
          id: "1",
          title: "Board 1",
          description: "This is board 1",
          index: 0,
        },
        {
          id: "2",
          title: "Board 2",
          description: "This is board 2",
          index: 1,
        },
        {
          id: "3",
          title: "Board 3",
          description: "This is board 3",
          index: 2,
        },
      ],
    },
    {
      index: 1,
      id: "2",
      name: "In Progress",
    },
    {
      index: 2,
      id: "3",
      name: "Done",
    },
    {
      index: 3,
      id: "4",
      name: "Issues",
    },
  ]);

  function handleOnDragEnd(result: DropResult, provided: ResponderProvided) {
    // if (!result.destination) return;
    // const items = [...boards];
    // const sourceIndex = result.source.index;
    // const destinationIndex = result.destination.index;
    // items[sourceIndex] = boards[destinationIndex];
    // items[destinationIndex] = boards[sourceIndex];
    // setBoards(items);
  }
  return (
    <AppLayout>
      <pre>{boardId}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex flex-wrap whitespace-nowrap">
          {boardColumns?.map((column) => (
            <Droppable droppableId={column.id!} key={column.id}>
              {(provided) => (
                <div
                  className="flex flex-col gap-3 p-2 rounded-sm bg-slate-50 w-[300px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <p className="m-0 font-semibold">{column.name}</p>
                  {column.cards?.map((card, index) => (
                    <Draggable
                      key={card?.id}
                      draggableId={card?.id!.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="bg-white border border-solid border-slate-300"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h2 className="m-0 ">{card.title}</h2>
                          <p>{card.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </AppLayout>
  );
};

export default withFirebaseProtection(BoardInsidePage);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: { boardId: query.boardId } };
};
