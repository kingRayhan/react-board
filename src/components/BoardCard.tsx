import { Menu, UnstyledButton } from "@mantine/core";
import React from "react";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";

interface BoardCardProps {
  title: string;
  imageUrl?: string;
  onClick?: () => void;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
}
const BoardCard: React.FC<BoardCardProps> = ({
  title,
  imageUrl,
  onClick,
  onClickDelete,
  onClickEdit,
}) => {
  return (
    <div
      className="flex flex-col justify-start p-2 border border-gray-300 hover:bg-slate-50 cursor-pointer border-solid rounded-md min-h-[65px] shadow-sm"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <p className="m-0">{title}</p>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="hover:bg-slate-200"
            >
              <CgMoreVerticalAlt className="text-gray-500" />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={(e) => {
                e.stopPropagation();
                onClickEdit && onClickEdit();
              }}
              icon={<MdOutlineEdit />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={(e) => {
                e.stopPropagation();
                onClickDelete && onClickDelete();
              }}
              icon={<MdOutlineDeleteOutline />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default BoardCard;
