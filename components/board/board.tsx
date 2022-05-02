import React from "react";
import Grid from "@mui/material/Grid";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Column from "./column";
import Item from "./item";

interface ItemType {
  id: number;
  title: string;
  label: string;
  user: string;
  date: string;
  column: string;
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

export type BoardAction =
  | {
      type: "MOVE";
      payload: { from: string; to: string; id: number };
    }
  | {
      type: "SHUFFLE";
      payload: { dragIndex: number; hoverIndex: number; column: string };
    }
  | {
      type: "INITIALIZE";
      payload: { items: ItemType[] };
    };

const baseState: BoardState = {
  Backlog: [],
  "In Progress": [],
  Blocked: [],
  "In Review": [],
  Complete: [],
};

const boardReducer = (state: BoardState, action: BoardAction) => {
  const { type, payload } = action;
  switch (type) {
    case "MOVE":
      console.log('move')
      if (payload.to === payload.from) return { ...state };

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
      // console.log(dragItem, "DDDDDD")
      if (dragItem) {
        const shuffleSet = [...state[payload.column]];
        const prevItem = shuffleSet.splice(payload.hoverIndex, 1, dragItem);
        shuffleSet.splice(payload.dragIndex, 1, prevItem[0]);
        return {
          ...state,
          [payload.column]: shuffleSet,
        };
      } else return { ...state };

    case "INITIALIZE":
      const initState = { ...baseState };
      initDat.forEach((item) => {
        let currentArray = initState[item.column];
        const hasId = currentArray.some(
          (currentItem) => currentItem.id === item.id
        );

        !hasId && currentArray.push(item);
      });
      // console.log(initState);
      return { ...baseState, Backlog: payload.items };

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
  const [boardState, boardDispatch] = React.useReducer(boardReducer, baseState);

  React.useEffect(() => {
    // console.log("fire");
    boardDispatch({
      type: "INITIALIZE",
      payload: {
        items: initDat,
      },
    });
  }, []);

  const handleShuffle = (
    dragIndex: number,
    hoverIndex: number,
    column: string
  ) => {

    boardDispatch({
      type: "SHUFFLE",
      payload: {
        dragIndex: dragIndex,
        hoverIndex: hoverIndex,
        column: column,
      },
    });
  };

  const returnItemsForCol = (colName: string) => {
    // console.log(boardState[colName])
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
        handleShuffle={handleShuffle}
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
