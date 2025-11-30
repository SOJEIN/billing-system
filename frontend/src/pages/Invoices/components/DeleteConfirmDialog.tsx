import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  id: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<Props> = ({
  open,
  id,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 2 } }}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
        Confirmar eliminación
      </DialogTitle>
      <DialogContent id="delete-dialog-description" sx={{ px: 3, py: 1.5 }}>
        <Typography variant="body1">
          ¿Estás seguro que deseas eliminar esta factura?
        </Typography>
        {id ? (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {`Factura #${id}. Esta acción no se puede deshacer.`}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 1, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button color="error" onClick={onConfirm} variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
