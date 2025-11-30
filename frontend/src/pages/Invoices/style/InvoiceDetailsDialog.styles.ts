import type { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  dialogPaper: {
    borderRadius: 2,
  },
  dialogTitle: {
    backgroundColor: "#1565c0",
    color: "white",
  },
  dialogTitleBox: {
    display: "flex",
    flexDirection: "column",
  },
  metaText: {
    opacity: 0.9,
  },
  dialogContent: {
    px: { xs: 2, md: 3 },
    py: { xs: 1, md: 2 },
  },
  tableContainer: {
    boxShadow: 0,
    overflow: "auto",
    maxHeight: "50vh",
  },
  stickyHeader: {
    width: "100%",
  },
  tableHead: {
    backgroundColor: "#1976d2",
  },
  tableCellHead: {
    color: "black",
    fontWeight: "bold",
    py: 1.25,
  },
  tableRowOdd: {
    backgroundColor: "#f1f8ff",
    "&:hover": { backgroundColor: "#e3f2fd" },
  },
  tableRowEven: {
    backgroundColor: "white",
    "&:hover": { backgroundColor: "#e3f2fd" },
  },
  tableCellTotal: {
    fontWeight: "bold",
    color: "#1565c0",
    py: 1.25,
  },
  dialogActions: {
    justifyContent: "flex-end",
    gap: 1,
    pr: 2,
    pb: 2,
  },
};
