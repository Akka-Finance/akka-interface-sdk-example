import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Box, Toolbar } from "@mui/material";
import Tokens from "./pages/Tokens";
import Spender from "./pages/Spender";

function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Toolbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/spender" element={<Spender />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
