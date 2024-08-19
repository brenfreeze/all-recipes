import { SyntheticEvent, useEffect, useState } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function AppSnackBar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const errors = useSelector<RootState>(
    ({ recipesReducer: { errors } }) => errors
  ) as any[];

  const handleClose = (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (errors.length) {
      setOpen(true);
      setMessage(errors.at(-1).error);
    }
  }, [errors]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
    />
  );
}
