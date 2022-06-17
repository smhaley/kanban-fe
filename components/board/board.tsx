import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { DragDropContext } from "react-beautiful-dnd";
import Modal from "./modal";
import { Item, User, Label, ItemStatus, Priority } from "../../api/models";
import * as ItemsService from "../../api/item_service";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { emptyItem } from "../../constants/board-constants";
import { instantiateCols, dragEndHandler } from "../../utils/board-utils";
import ItemDisplay from "../shared/item-display";
import DragItem from "./drag-item";
import Column from "./column";
import { DragStart, DropResult } from "react-beautiful-dnd";
import Filter from "../filter/filter";
import { FilterState } from "../filter/filter";

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
  const [currentDragId, setCurrentDragId] = useState<ItemStatus>();
  const [localFilters, setLocalFilters] = useState<FilterState>();
  const [isFiltered, setIsFiltered] = useState(false);

  React.useEffect(() => {
    const getItems = async () => {
      try {
        const items = await ItemsService.getItems();
        setItems(items);
      } catch (error) {
        console.log(error);
      }
    };

    const prevFilters = localStorage.getItem("filterState");

    if (prevFilters) {
      const parsedFilters: FilterState = JSON.parse(prevFilters);
      setLocalFilters(parsedFilters);
      applyFilters(parsedFilters);
    } else {
      getItems();
    }
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

  const onDragStart = (start: DragStart) => {
    setCurrentDragId(start.source.droppableId as ItemStatus);
  };

  const onDragEnd = (result: DropResult) => {
    setCurrentDragId(undefined);
    dragEndHandler(result, setColumns, columns);
  };

  const applyFilters = async (filterState: FilterState) => {
    const { users, labels, priorities } = filterState;
    const queryString = `?users=${users.toString()}&labels=${labels.toString()}&priorities=${priorities.toString()}`;
    const filteredItems = await ItemsService.getItems(false, queryString);
    setItems(filteredItems);
    if (users.length || labels.length || priorities.length) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  };

  const clearFilters = async () => {
    const items = await ItemsService.getItems(false);
    setItems(items);
    setIsFiltered(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
        {items ? (
          <Box sx={{ mt: -3, top: 0 }}>
            <Button
              color="secondary"
              startIcon={<AddIcon />}
              onClick={newItemModal}
            >
              New Task
            </Button>
            <Filter
              users={users}
              labels={labels}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              localFilters={localFilters}
              isFiltered={isFiltered}
            />
          </Box>
        ) : (
          <LinearProgress color="secondary" />
        )}
        <Grid sx={{ flexGrow: 1 }} container spacing={1}>
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {columns &&
              Object.entries(columns).map(([columnId, column]) => {
                return (
                  <Column
                    key={columnId}
                    columnId={columnId as ItemStatus}
                    currentDragId={currentDragId}
                  >
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
