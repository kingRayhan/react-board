import { IBoardColumn } from "@/app/models/board-column.model";
import React from "react";
import { FiMoreHorizontal, FiTrash } from "react-icons/fi";
import { Draggable } from "react-beautiful-dnd";
import { Menu, UnstyledButton } from "@mantine/core";

interface BoardColumnProps {
  column: IBoardColumn;
  index: number;
  onColumnAction: (action: "delete" | "edit", column: IBoardColumn) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  index,
  onColumnAction,
}) => {
  return (
    <Draggable key={column.id} draggableId={column.id!} index={index}>
      {(provided) => (
        <div
          className="board-column"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex justify-between">
            <p className="m-0">{column.name}</p>
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <FiMoreHorizontal />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => onColumnAction("delete", column)}
                  icon={<FiTrash />}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardColumn;
