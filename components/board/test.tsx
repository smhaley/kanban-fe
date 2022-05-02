import React from "react";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import Column from "./column";
import { BoardAction } from "./board";

type DropEffect = {
  dropEffect: string;
  name: string;
};

interface ItemType {
  id: number;
  title: string;
  label: string;
  user: string;
  date: string;
  column: string;
}

interface ItemProps {
  title: string;
  label: string;
  user: string;
  date: string;
  id: number;
  index: number;
  column: string;
  boardDispatch: React.Dispatch<BoardAction>;
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

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

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

      // Time to actually perform the action
      // moveCard(dragIndex, hoverIndex);
      console.log("MOVE", dragIndex, hoverIndex);
      boardDispatch({
        type: "SHUFFLE",
        payload: {
          dragIndex: dragIndex,
          hoverIndex: hoverIndex,
          column: column,
        },
      });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "Our first type",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {label}
    </div>
  );
}
