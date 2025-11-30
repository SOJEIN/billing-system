import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
