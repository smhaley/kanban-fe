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
import {
  Item,
  NewItem,
  Priority,
  ItemStatus,
  labelPrettify,
} from "../../api/models";
import { v4 as uuid } from "uuid";
// import { getLabels, addLabel } from "../../api/label_service";
import * as ItemsService from "../../api/item_service";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const emptyItem: Item = {
  id: "",
  content: "",
  title: "",
  label: "",
  user: "",
  updateDateTime: "",
  creationDateTime: "",
  itemStatus: ItemStatus.BACKLOG,
  priority: Priority.STANDARD,
  position: 999,
};

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
  const baseState: ColType = Object.keys(ItemStatus).reduce((acc, curr) => {
    return { ...acc, [curr]: [] };
  }, {});

  for (let item of resp) {
    baseState[item.itemStatus].push(item);
  }

  Object.values(baseState).forEach((item) =>
    item.sort((a: Item, b: Item) => {
      return a.position - b.position;
    })
  );

  return baseState;
};

interface ColType {
  [x: string]: Item[];
}

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
    removed.itemStatus = destination.droppableId as ItemStatus;
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
};

function App() {
  const [columns, setColumns] = useState<ColType>();
  const [items, setItems] = useState<Item[]>();
  const [modalState, setModalState] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | NewItem>(emptyItem);

  React.useEffect(() => {
    const getItems = async () => {
      try {
        const items = await ItemsService.getItems();
        setItems(items);
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
  }, []);

  React.useEffect(() => {
    if (items) {
      const columns = instantiateCols(items);
      setColumns(columns);
    }
  }, [items]);

  const handleUpdateItem = (updateItem: Item) => {
    if (!items || items.length < 1) return;
    const filteredItems = items.filter((val) => val.id !== updateItem.id);
    setItems([...filteredItems, updateItem]);
  };

  const handleNewItem = async (item: NewItem) => {
    const currentItems = items ? [...items] : [];
    const newItem = (await ItemsService.postItems(item)) as Item;
    setItems([...currentItems, newItem]);
    setCurrentItem(emptyItem);
  };

  const handleDeleteItem = (itemId: string) => {
    const currentItems = items ? [...items] : [];
    const filteredItems = currentItems.filter((item) => item.id !== itemId);
    setItems([...filteredItems]);
    setCurrentItem(emptyItem);

  };

  const newItemModal = () => {
    setIsNew(true);
    setModalState(!modalState);
  };

  const modalClose = () => {
    setCurrentItem(emptyItem);
    setModalState(false);
  };

  const updateItemModal = (itemId: string) => {
    if (!items || items.length < 1) return;
    setIsNew(false);
    setModalState(!modalState);
    const itemToUpdate = items.filter((item) => item.id === itemId)[0];
    setCurrentItem(itemToUpdate);
  };

  return (
    <>
      <Box sx={{ mt: -3, maxWidth: 250, top: 0 }}>
        <Button startIcon={<AddIcon />} onClick={newItemModal}>
          New Task
        </Button>
      </Box>
      <Grid sx={{ flexGrow: 1 }} container spacing={1}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, setColumns, columns)}
        >
          {columns &&
            Object.entries(columns).map(([columnId, column]) => {
              return (
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <Grid item>
                        <Box sx={{ textAlign: "center", mb: 1, pt: 1 }}>
                          <Typography variant="h6">
                            {labelPrettify(columnId)}
                          </Typography>
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
                                      onClick={() => updateItemModal(item.id)}
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
        <Modal
          isOpen={modalState}
          item={currentItem}
          handleClose={modalClose}
          addNewItem={handleNewItem}
          updateItem={handleUpdateItem}
          isNew={isNew}
          deleteItem={handleDeleteItem}
        />
      )}
    </>
  );
}

export default App;
