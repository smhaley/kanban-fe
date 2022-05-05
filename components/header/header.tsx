import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../modal";

export default function ButtonAppBar() {
  const [modalState, setModalState] = React.useState(false);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shawnban 2000
            </Typography>

            <Button color="inherit" startIcon={<AddIcon />} onClick={() => setModalState(!modalState)}>
              New Task
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {modalState && (
        <Modal isOpen={modalState} handleClose={() => setModalState(false)} />
      )}
    </>
  );
}
