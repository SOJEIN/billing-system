import React from "react";
import Invoices from "./pages/Invoices/Invoices";
import { Container, Typography } from "@mui/material";

const App: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Facturas
      </Typography>
      <Invoices />
    </Container>
  );
};

export default App;
