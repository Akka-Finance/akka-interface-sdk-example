import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { MyDrawerProps } from "./types";
import { useNavigate } from "react-router-dom";

const Drawer = ({ navItems, handleDrawerToggle }: MyDrawerProps) => {
  const navigate = useNavigate();

  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Box
          component="img"
          sx={{
            height: 100,
            width: 120,
          }}
          alt="Logo"
          src="https://www.app.akka.finance/static/media/akka-colorfull1.e14f6961870541109dba75ec1c36da0e.svg"
        />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => {
                navigate(item.path);
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Drawer;
