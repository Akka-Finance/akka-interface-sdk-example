import { Box as MuiBox, BoxProps, Theme } from "@mui/material";
import { SystemProps } from "@mui/system";

export interface CustomBoxProps extends SystemProps<Theme> {
  onClick?: BoxProps["onClick"];
  sx?: BoxProps["sx"];
  children?: React.ReactNode;
  id?: string;
}

export function MyBox(props: CustomBoxProps) {
  return <MuiBox component="div" {...props} />;
}
