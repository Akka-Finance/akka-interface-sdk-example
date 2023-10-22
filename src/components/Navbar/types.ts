import { MouseEventHandler } from "react";

export interface navItem {
  name: string;
  path: string;
}

export interface MyDrawerProps {
  navItems: Array<navItem>;
  handleDrawerToggle: MouseEventHandler<HTMLDivElement>;
}
