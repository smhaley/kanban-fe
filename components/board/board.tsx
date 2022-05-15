import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DragDropContext } from "react-beautiful-dnd";
import Modal from "./modal";
import { Item, User, Label } from "../../api/models";
import * as ItemsService from "../../api/item_service";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { emptyItem } from "../../constants/board-constants";
import { instantiateCols, onDragEnd } from "../../utils/board-utils";
import ItemDisplay from "../shared/item-display";
import DragItem from "./drag-item";
import Column from "./column";

export interface ColType {
  [x: string]: Item[];
}

interface BoardProps {
  labels: Label[];
  users: User[];
}

export default function Board({ labels, users }: BoardProps) {
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

  const handleArchive = async (archiveItem: Item) => {
    if (!items || items.length < 1) return;
    const filteredItems = items.filter((val) => val.id !== archiveItem.id);
    await ItemsService.updateItem(archiveItem);
    setItems([...filteredItems]);
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
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
                  <Column key={columnId} columnId={columnId}>
                    {column.map((item, idx) => {
                      return (
                        <DragItem
                          key={item.id}
                          updateItemModal={updateItemModal}
                          item={item}
                          index={idx}
                        />
                      );
                    })}
                  </Column>
                );
              })}
          </DragDropContext>
        </Grid>
        {modalState && (
          <Modal
            isOpen={modalState}
            title={isNew ? "New Task" : `Update Task: ${currentItem.title}`}
            handleClose={modalClose}
          >
            <ItemDisplay
              item={currentItem}
              handleClose={modalClose}
              addNewItem={handleNewItem}
              updateItem={handleUpdateItem}
              archiveItem={handleArchive}
              isNew={isNew}
              deleteItem={handleDeleteItem}
              labels={labels}
              users={users}
              showTitle={false}
            />
          </Modal>
        )}
      </Box>
    </Box>
  );
}
