import React from "react";
import Card from "@mui/material/Card";
import { Draggable } from "react-beautiful-dnd";
import { Item } from "../../api/models";
import ItemContent from "../shared/item-card-content";

interface BoardProps {
  item: Item;
  index: number;
  updateItemModal: (itemId: string) => void;
}

export default function DragItem({ item, updateItemModal, index }: BoardProps) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            sx={{
              cursor: "pointer",
              userSelect: "none",
              margin: 1,
              minHeight: 50,
              backgroundColor: snapshot.isDragging ? "#f6f2fd" : "#fffefe",
              ...provided.draggableProps.style,
            }}
            onClick={() => updateItemModal(item.id)}
          >
            <ItemContent item={item} isSmall />
          </Card>
        );
      }}
    </Draggable>
  );
}
