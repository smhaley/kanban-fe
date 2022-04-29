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

function Item({
  title,
  label,
  user,
  date,
  id,
  index,
  column,
  boardDispatch,
}: ItemProps) {
  // console.log({title, index})
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "Our first type",
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
      // console.log({ dragIndex, hoverIndex, id });
      // Time to actually perform the action
      // moveCardHandler(dragIndex, hoverIndex, column);
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
    item: { id: id, currentColumn: column },
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

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));
  const card = (
    <React.Fragment>
      <CardContent ref={ref} sx={{ opacity: opacity, background: "white" }}>
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
      {/* <CardActions>
      </CardActions> */}
    </React.Fragment>
  );
  return (
    <Box ref={drag} sx={{ maxWidth: 170 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}

interface ColumnProps {
  title: string;
  children?: JSX.Element[];
}
function Column({ children, title }: ColumnProps) {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    canDrop: (item: { id: number; currentColumn: string }) => {
      const { currentColumn } = item;
      return (
        currentColumn === title ||
        (currentColumn === "Backlog" && title == "In Progress") ||
        (currentColumn === "In Progress" &&
          (title === "Blocked" ||
            title === "In Review" ||
            title === "Backlog")) ||
        (currentColumn === "In Review" &&
          (title === "Complete" || title === "Blocked"))
      );
    },
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        return "yellow";
      } else if (!canDrop) {
        return "purple";
      }
    }
  };
  return (
    <Paper
      ref={drop}
      sx={{ minHeight: "80vh", width: 180, background: getBackgroundColor() }}
    >
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {children}
      </Box>
    </Paper>
  );
}

export const COLUMN_NAMES = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  IN_REVIEW: "In Review",
  COMPLETE: "Complete",
};

interface BoardState {
  [key: string]: ItemType[];
  Backlog: ItemType[];
  "In Progress": ItemType[];
}

type BoardAction =
  | {
      type: "MOVE";
      payload: { from: string; to: string; id: number };
    }
  | {
      type: "SHUFFLE";
      payload: { dragIndex: number; hoverIndex: number; column: string };
    };

const boardReducer = (state: BoardState, action: BoardAction) => {
  const { type, payload } = action;
  switch (type) {
    case "MOVE":
      if (payload.to === payload.from) return { ...state };
      
      console.log(payload)

      const fromSet = [...state[payload.from]];
      const itemIndex = fromSet.findIndex((item) => item.id === payload.id);
      const itemToMove = fromSet.splice(itemIndex, 1);
      itemToMove[0].column = payload.to;
      const toSet = [...state[payload.to], ...itemToMove];
      return {
        ...state,
        [payload.from]: fromSet,
        [payload.to]: toSet,
      };

    case "SHUFFLE":
      const dragItem = state[payload.column][payload.dragIndex];
      if (dragItem) {
        const shuffleSet = [...state[payload.column]];
        const prevItem = shuffleSet.splice(payload.hoverIndex, 1, dragItem);
        shuffleSet.splice(payload.dragIndex, 1, prevItem[0]);
        return {
          ...state,
          [payload.column]: shuffleSet,
        };
      } else return { ...state };

    default:
      return state;
  }
};

const initDat: ItemType[] = [
  {
    id: 1,
    title: "blah",
    label: "home",
    user: "shawn",
    date: "blah",
    column: "Backlog",
  },
  {
    id: 2,
    title: "blah2",
    label: "home",
    user: "shawn",
    date: "blah",
    column: "Backlog",
  },
  {
    id: 3,
    title: "blah3",
    label: "home",
    user: "shawn",
    date: "blah",
    column: "Backlog",
  },
  {
    id: 4,
    title: "blah4",
    label: "home",
    user: "shawn",
    date: "blah",
    column: "Backlog",
  },
];

export default function Board() {
  const [boardState, boardDispatch] = React.useReducer(boardReducer, {
    Backlog: initDat,
    "In Progress": [],
    Blocked: [],
    "In Review": [],
    Complete: [],
  });

  const returnItemsForCol = (colName: string) => {
    return boardState[colName].map((item, idx) => (
      <Item
        key={item.id}
        id={item.id}
        title={item.title}
        label={item.label}
        user={item.user}
        date={item.date}
        column={item.column}
        boardDispatch={boardDispatch}
        index={idx}
      />
    ));
  };
  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={3}>
      <DndProvider backend={HTML5Backend}>
        {Object.values(COLUMN_NAMES).map((name) => (
          <Grid key={name} item>
            <Column title={name}>{returnItemsForCol(name)}</Column>
          </Grid>
        ))}
      </DndProvider>
    </Grid>
  );
}
