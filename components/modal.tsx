import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Divider, Input, Typography } from "@mui/material";
import { ItemType } from "./board/board";
import { Item, Priority } from "../api/models";

interface ModalProps {
  item: Item;
  isOpen: boolean;
  isNew: boolean;
  handleClose: (value: React.SetStateAction<boolean>) => void;
}

const labels = [
  {
    id: 1,
    label: "Maintenance",
  },
  {
    id: 2,
    label: "Cleaning",
  },
];
const users = [
  {
    id: 1,
    username: "Shawn",
  },
  {
    id: 2,
    username: "Kathleen",
  },
  {
    id: 3,
    username: "Ingo",
  },
];

const demo: Item = {
  id: "e62b28ab-addb-4144-a54e-951a6c803cc7",
  label: "label",
  user: "user1",
  content: "some import stuff to do",
  updateDateTime: "2022-05-05T00:11:49.474547",
  itemStatus: "BACKLOG",
  creationDateTime: "2022-05-05T00:11:49.47522",
  position: 0,
  priority: Priority.LOW,
  title: "Import item",
};

export default function ContentForm({
  item,
  isOpen,
  handleClose,
  isNew,
}: ModalProps) {
  const [label, setLabel] = React.useState(item ? item.label : labels[0].label);
  const [user, setUser] = React.useState(item ? item.user : users[0].username);
  const [priority, setPriority] = React.useState(
    item ? item.priority : Priority.STANDARD
  );
  const [title, setTitle] = React.useState(item ? item.title : undefined);
  const [content, setContent] = React.useState(item ? item.content : undefined);

  const handleChange = (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    type: "label" | "priority" | "title" | "user" | "content"
  ) => {
    console.log(event.target.value);
    switch (type) {
      case "label":
        setLabel(event.target.value as string);
        break;
      case "title":
        setTitle(
          (event.target as HTMLInputElement | HTMLTextAreaElement)
            .value as string
        );
        break;
      case "user":
        setUser(event.target.value as string);
        break;
      case "priority":
        setPriority(event.target.value as Priority);
        break;
      case "content":
        setContent(
          (event.target as HTMLInputElement | HTMLTextAreaElement)
            .value as string
        );
        break;
    }
  };

  const getDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString(
      "en-US"
    )}`;
  };

  return (
    <Box>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>{isNew ? "New Task" : title}</DialogTitle>
        <Divider />
        <DialogContent>
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
            <div>
              <span style={{ margin: 2, background: "pink" }} />
              {getDate(item.updateDateTime)}
            </div>
          </Box>
          <form>
            <Box sx={{ my: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Title"
                fullWidth
                variant="standard"
                value={title}
                onChange={(e) => handleChange(e, "title")}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormControl margin="dense" sx={{ my: 2, mr: 2, width: 200 }}>
                <InputLabel id="demo-simple-select-label">Label</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={label}
                  label="label"
                  onChange={(e) => handleChange(e, "label")}
                >
                  {labels.map((val) => (
                    <MenuItem key={val.id} value={val.label}>
                      {val.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl margin="dense" sx={{ my: 2, width: 200 }}>
                <InputLabel id="prioity-select">Priority</InputLabel>
                <Select
                  labelId="prioity-select"
                  value={priority}
                  label="Priority"
                  onChange={(e) => handleChange(e, "priority")}
                  sx={{ textTransform: "capitalize" }}
                >
                  {Object.keys(Priority).map((val) => (
                    <MenuItem
                      key={val}
                      value={val}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {val.toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControl margin="dense" sx={{ my: 2, width: 200 }}>
              <InputLabel id="user-select">User</InputLabel>
              <Select
                labelId="user-select"
                value={user}
                label="User"
                onChange={(e) => handleChange(e, "user")}
                sx={{ textTransform: "capitalize" }}
              >
                {users.map((val) => (
                  <MenuItem key={val.id} value={val.username}>
                    {val.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ my: 2 }}>
              <InputLabel id="user-select">Comments</InputLabel>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={8}
                minLength={6}
                placeholder="Minimum 3 rows"
                defaultValue={item ? item.content : ""}
                style={{ width: "100%" }}
                value={content}
                onChange={(e) => handleChange(e, "content")}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Box>
            <Button onClick={() => handleClose(false)} autoFocus>
              close
            </Button>
            <Button
              variant="contained"
              onClick={() => handleClose(false)}
              autoFocus
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// export function FormDialog({ isOpen, handleClose }: ModalProps) {
//   return (
//     <div>
//       <Dialog open={isOpen} onClose={handleClose}>
//         <DialogTitle>Subscribe</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             To subscribe to this website, please enter your email address here.
//             We will send updates occasionally.
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="name"
//             label="Email Address"
//             type="email"
//             fullWidth
//             variant="standard"
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
