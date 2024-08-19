import { useState } from "react";
import { createCallable } from "react-call";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addError } from "@/slices/recipes/recipes-slice";

interface ConfirmProps {
  message: string;
  title?: string;
  onConfirm?: () => void | Promise<void>;
}

type ConfirmResponse = boolean;

const CallableConfirm = createCallable<ConfirmProps, ConfirmResponse>(
  ({ call, message, title = "Confirm", onConfirm }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(true);

    const handleClose = async (response: boolean) => {
      setOpen(false);
      if (response && onConfirm) {
        onConfirm();
      }
      call.end(response);
    };

    return (
      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)}>No</Button>
          <Button onClick={() => handleClose(true)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default CallableConfirm;
