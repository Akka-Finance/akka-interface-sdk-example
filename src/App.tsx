import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { routes } from "./routes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Toolbar />

        <Routes>
          {routes.map((route) => {
            return <Route path={route.path} element={<route.component />} />;
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
