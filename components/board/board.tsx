// import React from "react";
// import Grid from "@mui/material/Grid";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { DndProvider } from "react-dnd";
// import Column from "./column";
// import Item from "./item";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// interface ItemType {
//   id: number;
//   title: string;
//   label: string;
//   user: string;
//   date: string;
//   column: string;
// }

// export const COLUMN_NAMES = {
//   BACKLOG: "Backlog",
//   IN_PROGRESS: "In Progress",
//   BLOCKED: "Blocked",
//   IN_REVIEW: "In Review",
//   COMPLETE: "Complete",
// };

// interface BoardState {
//   [key: string]: ItemType[];
//   Backlog: ItemType[];
//   "In Progress": ItemType[];
// }

// export type BoardAction =
//   | {
//       type: "MOVE";
//       payload: { from: string; to: string; id: number };
//     }
//   | {
//       type: "SHUFFLE";
//       payload: { dragIndex: number; hoverIndex: number; column: string };
//     }
//   | {
//       type: "INITIALIZE";
//       payload: { items: ItemType[] };
//     };

// const baseState: BoardState = {
//   Backlog: [],
//   "In Progress": [],
//   Blocked: [],
//   "In Review": [],
//   Complete: [],
// };

// const boardReducer = (state: BoardState, action: BoardAction) => {
//   const { type, payload } = action;
//   switch (type) {
//     case "MOVE":
//       console.log("move");
//       if (payload.to === payload.from) return { ...state };

//       const fromSet = [...state[payload.from]];
//       const itemIndex = fromSet.findIndex((item) => item.id === payload.id);
//       const itemToMove = fromSet.splice(itemIndex, 1);
//       itemToMove[0].column = payload.to;
//       const toSet = [...state[payload.to], ...itemToMove];
//       return {
//         ...state,
//         [payload.from]: fromSet,
//         [payload.to]: toSet,
//       };

//     case "SHUFFLE":
//       const dragItem = state[payload.column][payload.dragIndex];
//       // console.log(dragItem, "DDDDDD")
//       if (dragItem) {
//         const shuffleSet = [...state[payload.column]];
//         const prevItem = shuffleSet.splice(payload.hoverIndex, 1, dragItem);
//         shuffleSet.splice(payload.dragIndex, 1, prevItem[0]);
//         return {
//           ...state,
//           [payload.column]: shuffleSet,
//         };
//       } else return { ...state };

//     case "INITIALIZE":
//       const initState = { ...baseState };
//       initDat.forEach((item) => {
//         let currentArray = initState[item.column];
//         const hasId = currentArray.some(
//           (currentItem) => currentItem.id === item.id
//         );

//         !hasId && currentArray.push(item);
//       });
//       // console.log(initState);
//       return { ...baseState, Backlog: payload.items };

//     default:
//       return state;
//   }
// };

// const initDat: ItemType[] = [
//   {
//     id: 1,
//     title: "blah",
//     label: "home",
//     user: "shawn",
//     date: "blah",
//     column: "Backlog",
//   },
//   {
//     id: 2,
//     title: "blah2",
//     label: "home",
//     user: "shawn",
//     date: "blah",
//     column: "Backlog",
//   },
//   {
//     id: 3,
//     title: "blah3",
//     label: "home",
//     user: "shawn",
//     date: "blah",
//     column: "Backlog",
//   },
//   {
//     id: 4,
//     title: "blah4",
//     label: "home",
//     user: "shawn",
//     date: "blah",
//     column: "Backlog",
//   },
// ];

// export default function Board() {
//   const [boardState, boardDispatch] = React.useReducer(boardReducer, baseState);

//   React.useEffect(() => {
//     // console.log("fire");
//     boardDispatch({
//       type: "INITIALIZE",
//       payload: {
//         items: initDat,
//       },
//     });
//   }, []);

//   const handleShuffle = (
//     dragIndex: number,
//     hoverIndex: number,
//     column: string,
//     id: number,
//     dragItem: { id: number; currentColumn: string }
//   ) => {
//     console.log(column, dragItem.currentColumn, hoverIndex, dragIndex);
//     if (dragItem.currentColumn === column) {
//       boardDispatch({
//         type: "SHUFFLE",
//         payload: {
//           dragIndex: dragIndex,
//           hoverIndex: hoverIndex,
//           column: column,
//         },
//       });
//     }
//     if (dragItem.currentColumn !== column && hoverIndex) {
//       console.log(
//         "insert",
//         `${id} from ${dragItem.currentColumn} to ${column} at position ${
//           hoverIndex + 1
//         }`
//       );
//     }
//   };

//   const returnItemsForCol = (colName: string) => {
//     return boardState[colName].map((item, idx) => (
//       <Item
//         key={item.id}
//         id={item.id}
//         title={item.title}
//         label={item.label}
//         user={item.user}
//         date={item.date}
//         column={item.column}
//         boardDispatch={boardDispatch}
//         handleShuffle={handleShuffle}
//         index={idx}
//       />
//     ));
//   };

//   return (
//     <Grid sx={{ flexGrow: 1 }} container spacing={3}>
//       <DragDropContext onDragEnd={()=> console.log('blah')}>
//         {Object.values(COLUMN_NAMES).map((name) => (

//           <Grid key={name} item>
//             <Column title={name}>{returnItemsForCol(name)}</Column>
//           </Grid>
//         ))}
//       </DragDropContext>
//     </Grid>
//   );
// }

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const itemsFromBackend = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" },
];

interface ItemType {
  id: string;
  label: string;
  user: string;
  content: string;
  updateDateTime: string;
  itemStatus: string;
  creationDateTime: string;
}

interface ColType {
  [x: string]: {
    items: {
      id: string;
      content: string;
    }[];
  };
}
const columnsFromBackend: ColType = {
  Backlog: {
    items: itemsFromBackend,
  },
  "In Progress": {
    items: [],
  },
  Blocked: {
    items: [],
  },
  "In Review": {
    items: [],
  },
  Complete: {
    items: [],
  },
};

const onDragEnd = (
  result: DropResult,
  setColumns: React.Dispatch<React.SetStateAction<ColType | undefined>>,
  columns?: ColType
) => {
  if (!columns) return;
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];

    const [removed] = copiedItems.splice(source.index, 1);

    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
  console.log("fire col updates");
};

function App() {
  const [columns, setColumns] = useState<ColType>();
  React.useEffect(() => {
    let loadTimer = setTimeout(() => setColumns(columnsFromBackend), 100);
    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={1}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, setColumns, columns)}
      >
        {columns &&
          Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                  return (
                    <Grid item>
                      <Box sx={{ textAlign: "center", mb: 1, pt: 1 }}>
                        <Typography variant="h6">{columnId}</Typography>
                      </Box>
                      <Paper
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          background: snapshot.isDraggingOver
                            ? "#c3e9e9"
                            : "#ececec",
                          padding: 1,
                          width: 210,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, idx) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={idx}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <Card
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    sx={{
                                      userSelect: "none",
                                      margin: "0 0 8px 0",
                                      minHeight: 50,
                                      backgroundColor: snapshot.isDragging
                                        ? "#f6f2fd"
                                        : "#fffefe",
                                      ...provided.draggableProps.style,
                                    }}
                                    onClick={() => console.log("open modal")}
                                  >
                                    {item.content}
                                  </Card>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </Paper>
                    </Grid>
                  );
                }}
              </Droppable>
            );
          })}
      </DragDropContext>
    </Grid>
  );
}

export default App;
