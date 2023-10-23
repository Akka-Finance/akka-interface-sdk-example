import Home from "../pages/Home";
import Tokens from "../pages/Tokens";
import Approve from "../pages/Approve";

export interface MyRoute {
  name: string;
  path: string;
  component: () => JSX.Element;
}

export const routes: Array<MyRoute> = [
  { name: "Home", path: "/", component: Home },
  { name: "Tokens", path: "tokens", component: Tokens },
  { name: "Approve", path: "approve", component: Approve },
];