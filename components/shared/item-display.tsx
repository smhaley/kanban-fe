import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import CardHeader from "@mui/material/CardHeader";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Typography } from "@mui/material";
import ConfirmationModal from "../board/confirm-delete";
import { Item, Priority, ItemStatus, Label, User } from "../../api/models";
import { labelPrettify } from "../../utils/shared";
import { getDate } from "../../utils/item-display-utils";

interface ItemDisplayProps {
  item: Item;
  isNew: boolean;
  addNewItem?: (item: Item) => void;
  updateItem: (updateItem: Item) => void;
  archiveItem?: (archiveItem: Item) => void;
  handleClose?: () => void;
  deleteItem: (itemId: string) => void;
  labels: Label[];
  users: User[];
  showTitle: boolean;
}

interface State {
  item: Item;
}
type Action =
  | { type: "update_label"; payload: string }
  | { type: "update_title"; payload: string }
  | { type: "update_user"; payload: string }
  | { type: "update_priority"; payload: Priority }
  | { type: "update_content"; payload: string }
  | { type: "update_status"; payload: ItemStatus };

const itemReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "update_label":
      return {
        ...state,
        item: { ...state.item, label: action.payload },
      };
    case "update_title":
      return {
        item: { ...state.item, title: action.payload },
      };
    case "update_user":
      return {
        ...state,
        item: { ...state.item, user: action.payload },
      };
    case "update_content":
      return {
        ...state,
        item: { ...state.item, content: action.payload },
      };
    case "update_status":
      return {
        ...state,
        item: { ...state.item, itemStatus: action.payload },
      };
    case "update_priority":
      return {
        ...state,
        item: { ...state.item, priority: action.payload },
      };
  }
};

const baseError = { title: false, user: false, label: false };

const getItemStatusOptions = (isArchived: boolean) => {
  if (isArchived) {
    return Object.values(ItemStatus).filter(
      (status) => status === ItemStatus.ARCHIVE
    );
  } else {
    return Object.values(ItemStatus).filter(
      (status) => status !== ItemStatus.ARCHIVE
    );
  }
};

export default function ItemDisplay({
  item,
  handleClose,
  isNew,
  addNewItem,
  updateItem,
  deleteItem,
  labels,
  users,
  archiveItem,
  showTitle,
}: ItemDisplayProps) {
  const [itemState, itemDispatch] = React.useReducer(itemReducer, {
    item: item,
  });
  const [errorState, setErrorState] = React.useState(baseError);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const isComplete = item.itemStatus === ItemStatus.COMPLETE;
  const isArchived = item.itemStatus === ItemStatus.ARCHIVE;
  const isDisabled = isArchived || isComplete;

  const itemStatusOptions = getItemStatusOptions(isArchived);

  const handleSubmit = () => {
    const { user, title, label } = itemState.item;

    const errors = {
      title: title.length <= 2,
      user: user.length <= 2,
      label: label.length <= 2,
    };

    setErrorState(errors);

    if (Object.values(errors).some((val) => val === true)) {
      return;
    }
    const now = new Date(Date.now());
    const updateTime = now.toISOString();

    if (isNew && addNewItem) {
      addNewItem(itemState.item);
    } else if (isComplete) {
      const itemToArchive = { ...itemState.item };
      itemToArchive.updateDateTime = updateTime;
      itemToArchive.itemStatus = ItemStatus.ARCHIVE;
      archiveItem && archiveItem(itemToArchive);
    } else {
      const itemToUpdate = { ...itemState.item };
      itemToUpdate.updateDateTime = updateTime;
      updateItem(itemToUpdate);
    }
    handleClose && handleClose();
  };

  const handleDeleteItem = () => {
    item.id && deleteItem(item.id);
    handleClose && handleClose();
  };

  const handleChange = (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    type: "label" | "priority" | "title" | "user" | "content" | "status"
  ) => {
    switch (type) {
      case "label":
        const label = event.target.value as string;
        if (errorState.label && label.length > 2)
          setErrorState({ ...errorState, label: false });
        itemDispatch({
          type: "update_label",
          payload: label,
        });
        break;
      case "title":
        const title = (event.target as HTMLInputElement | HTMLTextAreaElement)
          .value as string;
        if (errorState.title && title.length > 2)
          setErrorState({ ...errorState, title: false });
        itemDispatch({
          type: "update_title",
          payload: title,
        });
        break;
      case "user":
        const user = event.target.value as string;
        if (errorState.user && user.length > 2)
          setErrorState({ ...errorState, user: false });
        itemDispatch({
          type: "update_user",
          payload: user,
        });
        break;
      case "priority":
        itemDispatch({
          type: "update_priority",
          payload: event.target.value as Priority,
        });
        break;
      case "content":
        itemDispatch({
          type: "update_content",
          payload: (event.target as HTMLInputElement | HTMLTextAreaElement)
            .value as string,
        });
        break;
      case "status":
        itemDispatch({
          type: "update_status",
          payload: event.target.value as ItemStatus,
        });
        break;
    }
  };

  const renderDates = (show: boolean) => {
    if (show && item.updateDateTime && item.creationDateTime) {
      return (
        <Box>
          <Box sx={{ display: "flex" }}>
            <Typography color="text.secondary" sx={{ pr: 3 }}>
              Creation Date:
            </Typography>
            <div>{getDate(item.creationDateTime)}</div>
          </Box>
          <Box sx={{ display: "flex", pt: 2 }}>
            <Typography color="text.secondary" sx={{ pr: 4 }}>
              Last Update:
            </Typography>
            <div>{getDate(item.updateDateTime)}</div>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Card sx={{ border: "none", boxShadow: "none" }}>
      {showTitle && <CardHeader title={item.title} />}
      <CardContent>
        {renderDates(!isNew)}
        <Box sx={{ mt: isNew ? -2 : 2 }}>
          <form style={{}}>
            <Box sx={{ mb: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Title"
                fullWidth
                disabled={isDisabled}
                variant="standard"
                value={itemState.item.title}
                error={errorState.title}
                onChange={(e) => handleChange(e, "title")}
              />
              {errorState.title && (
                <FormHelperText>Title is required</FormHelperText>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl margin="dense" sx={{ my: 2, pr: 1, width: 250 }}>
                <InputLabel id="demo-simple-select-label">Label</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={itemState.item.label}
                  label="label"
                  disabled={isDisabled}
                  error={errorState.label}
                  onChange={(e) => handleChange(e, "label")}
                  style={{ textTransform: "capitalize" }}
                >
                  {labels.map((val) => (
                    <MenuItem
                      key={val.id}
                      value={val.label}
                      style={{ textTransform: "capitalize" }}
                    >
                      {val.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl margin="dense" sx={{ my: 2, pl: 1, width: 250 }}>
                <InputLabel id="priority-select">Priority</InputLabel>
                <Select
                  labelId="priority-select"
                  value={itemState.item.priority}
                  label="Priority"
                  disabled={isDisabled}
                  onChange={(e) => handleChange(e, "priority")}
                >
                  {Object.keys(Priority).map((val) => (
                    <MenuItem key={val} value={val}>
                      {labelPrettify(val)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl margin="dense" sx={{ my: 2, pr: 1, width: 250 }}>
                <InputLabel id="user-select">User</InputLabel>
                <Select
                  labelId="user-select"
                  value={itemState.item.user}
                  label="User"
                  disabled={isDisabled}
                  error={errorState.user}
                  onChange={(e) => handleChange(e, "user")}
                  style={{ textTransform: "capitalize" }}
                >
                  {users.map((val) => (
                    <MenuItem
                      key={val.id}
                      value={val.username}
                      style={{ textTransform: "capitalize" }}
                    >
                      {val.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl margin="dense" sx={{ my: 2, width: 250, pl: 1 }}>
                <InputLabel id="status-select">Status</InputLabel>
                <Select
                  labelId="status-select"
                  value={itemState.item.itemStatus}
                  label="status"
                  disabled={isNew || isDisabled}
                  onChange={(e) => handleChange(e, "status")}
                >
                  {itemStatusOptions.map((val) => (
                    <MenuItem key={val} value={val}>
                      {labelPrettify(val)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ my: 2 }}>
              <InputLabel id="user-select">Comments</InputLabel>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={8}
                minLength={6}
                maxRows={15}
                placeholder="Task details"
                disabled={isDisabled}
                style={{ width: "100%" }}
                value={itemState.item.content}
                onChange={(e) => handleChange(e, "content")}
              />
            </Box>
          </form>
        </Box>
      </CardContent>
      <CardActions
        style={{ justifyContent: isNew ? "right" : "space-between" }}
      >
        {!isNew && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => setConfirmDelete(true)}
            disabled={isComplete || isArchived}
            autoFocus
          >
            delete
          </Button>
        )}
        <Box>
          {handleClose && !isArchived && (
            <Button sx={{ mr: 1 }} onClick={() => handleClose()} autoFocus>
              close
            </Button>
          )}
          <Button
            variant="contained"
            color={isComplete ? "info" : "primary"}
            onClick={handleSubmit}
            disabled={isArchived}
            autoFocus
          >
            {isComplete ? "Archive" : "Save"}
          </Button>
        </Box>
      </CardActions>
      {!isNew && (
        <ConfirmationModal
          handleClose={() => setConfirmDelete(false)}
          isOpen={confirmDelete}
          handleDelete={handleDeleteItem}
        />
      )}
    </Card>
  );
}
