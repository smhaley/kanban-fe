import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
import Modal from "../modal";
import { Item } from "../../api/models";
import { v4 as uuid } from "uuid";
// import { getLabels, addLabel } from "../../api/label_service";
import * as ItemsService from "../../api/item_service";

const itemsFromBackend = [
  {
    id: "1",
    content: "First task",
    title: "blah",
    label: "home",
    user: "shawn",
    updateDateTime: "1/2/22",
    creationDateTime: "1/2/22",
    itemStatus: "Backlog",
  },
  {
    id: "2",
    content: "First task",
    title: "blah",
    label: "home",
    user: "shawn",
    updateDateTime: "1/2/22",
    creationDateTime: "1/2/22",
    itemStatus: "Backlog",
  },
  {
    id: "3",
    content: "First task",
    title: "blah",
    label: "home",
    user: "shawn",
    updateDateTime: "1/2/22",
    creationDateTime: "1/2/22",
    itemStatus: "Backlog",
  },
  {
    id: "4",
    content: "First task",
    title: "blah",
    label: "home",
    user: "shawn",
    updateDateTime: "1/2/22",
    creationDateTime: "1/2/22",
    itemStatus: "Backlog",
  },
  {
    id: "5",
    content: "First task",
    title: "blah",
    label: "home",
    user: "shawn",
    updateDateTime: "1/2/22",
    creationDateTime: "1/2/22",
    itemStatus: "Backlog",
  },
];

export interface ItemType {
  id: string;
  title: string;
  label: string;
  user: string;
  content: string;
  updateDateTime: string;
  itemStatus: string;
  creationDateTime: string;
}

const instantiateCols = (resp: Item[]) => {
  const baseState: ColType = {
    BACKLOG: [],
    IN_PROGRESS: [],
    BLOCKED: [],
    IN_REVIEW: [],
    COMPLETE: [],
  };

  for (let item of resp) {
    baseState[item.itemStatus].push(item);
  }

  Object.values(baseState).sort((a: Item, b: Item) => {
    return a.position - b.position;
  });

  return baseState;
};

interface ColType {
  [x: string]: Item[];
}
// const columnsFromBackend: ColType = {
//   Backlog: itemsFromBackend,
//   "In Progress": [],
//   Blocked: [],
//   "In Review": [],
//   Complete: [],
// };

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
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];
    const [removed] = sourceItems.splice(source.index, 1);
    removed.itemStatus = destination.droppableId;
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    });
    destItems.forEach((item, index) => (item.position = index));
    destItems.forEach((item, index) => (item.position = index));
    ItemsService.batchPutItems([...sourceItems, ...destItems]);
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column];

    const [removed] = copiedItems.splice(source.index, 1);

    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: copiedItems,
    });
    copiedItems.forEach((item, index) => (item.position = index));
    ItemsService.batchPutItems(copiedItems);
  }
  console.log("fire col updates");
};

function App() {
  const [columns, setColumns] = useState<ColType>();
  const [modalState, setModalState] = useState(false);

  React.useEffect(() => {
    // console.log(getLabels());
    const getItems = async () => {
      try {
        const items = await ItemsService.getItems();
        const columns = instantiateCols(items);
        setColumns(columns);
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
    // console.log(items);

    // // console.log(
    // //   fetch("http://localhost:8080/api/v1/label").then((resp) =>
    // //     console.log(resp)
    // //   )
    // // );
    // let loadTimer = setTimeout(() => setColumns(columnsFromBackend), 100);
    // return () => {
    //   clearTimeout(loadTimer);
    // };
  }, []);

  return (
    <>
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
                              ? "#cdafff"
                              : "#ececec",
                            padding: 1,
                            width: 210,
                            minHeight: 500,
                          }}
                        >
                          {column.map((item, idx) => {
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
                                        margin: 1,
                                        minHeight: 50,
                                        backgroundColor: snapshot.isDragging
                                          ? "#f6f2fd"
                                          : "#fffefe",
                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={() => setModalState(!modalState)}
                                    >
                                      <CardContent>
                                        <Typography variant="h6">
                                          {item.title}
                                        </Typography>
                                        <Typography>{item.user}</Typography>
                                        <Typography
                                          sx={{ fontSize: 14 }}
                                          color="text.secondary"
                                        >
                                          {item.label}
                                        </Typography>
                                      </CardContent>
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
      {modalState && (
        <Modal isOpen={modalState} handleClose={() => setModalState(false)} />
      )}
    </>
  );
}

export default App;
