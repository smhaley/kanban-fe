import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import { BoardAction } from "./board";

type DropEffect = {
  dropEffect: string;
  name: string;
};

interface ItemProps {
  title: string;
  label: string;
  user: string;
  date: string;
  id: number;
  index: number;
  column: string;
  boardDispatch: React.Dispatch<BoardAction>;
  handleShuffle: (
    dragIndex: number,
    hoverIndex: number,
    column: string
  ) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function Item({
  title,
  label,
  user,
  date,
  id,
  index,
  column,
  boardDispatch,
  handleShuffle,
}: ItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "Our first type",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      // console.log(monitor, item);

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      console.log(dragIndex, hoverIndex, column);
      console.log(item);
      handleShuffle(dragIndex, hoverIndex, column);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Our first type",
    item: () => {
      return { id: id, currentColumn: column };
    },
    end: (_, monitor) => {
      const dropResult = monitor.getDropResult() as DropEffect;
      if (dropResult && dropResult.name) {
        boardDispatch({
          type: "MOVE",
          payload: { from: column, to: dropResult.name, id: id },
        });
      }
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;

  drag(drop(ref));

  const card = (
    <CardContent
      ref={ref}
      sx={{ background: "white" }}
      data-handler-id={handlerId}
    >
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Typography>{user}</Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary">
        {label}
      </Typography>

      <Typography sx={{ fontSize: 14 }} color="text.secondary">
        {date}
      </Typography>
    </CardContent>
  );
  return (
    <Card ref={ref} variant="outlined" sx={{ m: 1, opacity: opacity }}>
      {card}
    </Card>
  );
}
