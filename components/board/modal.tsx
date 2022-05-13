import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";

interface ModalProps {
  title: string;
  isOpen: boolean;
  handleClose: () => void;
  children: JSX.Element;
}

export default function ContentForm({
  title,
  isOpen,
  handleClose,
  children,
}: ModalProps) {
  return (
    <Box>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <Divider />
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </Box>
  );
}
