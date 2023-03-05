import AppLayout from "@/components/layouts/AppLayout";
import { GetServerSideProps } from "next";
import React from "react";
import dynamic from "next/dynamic";
import {
  DropResult,
  OnDragEndResponder,
  ResponderProvided,
} from "react-beautiful-dnd";
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

const BoardInsidePage = () => {
  const [boards, setBoards] = React.useState<typeof items>(items);

  function handleOnDragEnd(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;
    const items = [...boards];
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    items[sourceIndex] = boards[destinationIndex];
    items[destinationIndex] = boards[sourceIndex];  
    setBoards(items);
  }
  return (
    <AppLayout>
      <div>
        <h1>Board Inside Page</h1>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="boards" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-4 gap-2 "
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {boards.map((board, index) => (
                <Draggable
                  key={board.id}
                  draggableId={board.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="bg-white border border-solid border-slate-300"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <h2 className="m-0 ">{board.title}</h2>
                      <p>{board.description}</p>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </AppLayout>
  );
};

export default BoardInsidePage;

// export const getServerSideProps: GetServerSideProps = async () => {
//   resetServerContext(); // <-- CALL RESET SERVER CONTEXT, SERVER SIDE
//   return { props: { data: [] } };
// };
