import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDeleteProps {
  handleClose: () => void;
  handleDelete: () => void;
  isOpen: boolean;
}

export default function ConfirmDelete({
  handleClose,
  handleDelete,
  isOpen,
}: ConfirmDeleteProps) {
  const handleDeleteConfirm = () => {
    handleDelete();
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"Are you sure you want to delete this task?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDeleteConfirm}
          >
            confirm delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
