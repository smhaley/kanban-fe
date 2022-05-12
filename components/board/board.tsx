import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Modal from "./modal";
import { Item, User, Label } from "../../api/models";
import * as ItemsService from "../../api/item_service";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { emptyItem } from "../../constants/board-constants";
import {
  labelPrettify,
  instantiateCols,
  onDragEnd,
} from "../../utils/board-utils";

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

export interface ColType {
  [x: string]: Item[];
}

interface BoardProps {
  labels: Label[];
  users: User[];
}

function App({ labels, users }: BoardProps) {
  const [columns, setColumns] = useState<ColType>();
  const [items, setItems] = useState<Item[]>();
  const [modalState, setModalState] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>(emptyItem);

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

  const handleUpdateItem = async (updateItem: Item) => {
    if (!items || items.length < 1) return;
    const filteredItems = items.filter((val) => val.id !== updateItem.id);
    const updatedItem = await ItemsService.updateItem(updateItem);
    setItems([...filteredItems, updatedItem]);
  };

  const handleNewItem = async (item: Item) => {
    const currentItems = items ? [...items] : [];
    const position = columns ? columns.BACKLOG.length : 0;
    item.position = position;
    const newItem = await ItemsService.postItems(item);
    setItems([...currentItems, newItem]);
    setCurrentItem(emptyItem);
  };

  const handleDeleteItem = async (itemId: string) => {
    const currentItems = items ? [...items] : [];
    const filteredItems = currentItems.filter((item) => item.id !== itemId);
    await ItemsService.deleteItem(itemId);
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
          labels={labels}
          users={users}
        />
      )}
    </>
  );
}

export default App;
