import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Box, Toolbar } from "@mui/material";
import Tokens from "./pages/Tokens";

function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Toolbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
