import React from "react";
import Invoices from "./pages/Invoices/Invoices";
import { Container, Typography } from "@mui/material";

const App: React.FC = () => {
  return (
    <Container
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
        Facturas
      </Typography>
      <Invoices />
    </Container>
  );
};

export default App;
