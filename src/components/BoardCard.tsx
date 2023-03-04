import { Card, Group, Image, Text } from "@mantine/core";
import React from "react";

interface BoardCardProps {
  title: string;
  imageUrl?: string;
  onClick?: () => void;
}
const BoardCard: React.FC<BoardCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      component="button"
      onClick={onClick}
      className="cursor-pointer"
    >
      {imageUrl && (
        <Card.Section>
          <Image src={imageUrl} height={80} alt="Norway" />
        </Card.Section>
      )}

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
      </Group>
    </Card>
  );
};

export default BoardCard;
