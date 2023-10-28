import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Toolbar } from "@mui/material";
import { MyBox } from "./components/MyBox";
import { routes } from "./routes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Navbar />
      <MyBox sx={{ p: 4 }}>
        <Toolbar />

        <Routes>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            );
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MyBox>
    </>
  );
}

export default App;
