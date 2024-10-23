import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import muiTheme from "../../assets/theme/MuiTheme";

export const Circular = (props) => (
  <ThemeProvider theme={muiTheme}>
    <div
      id={props?.id}
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: props?.height,
      }}
    >
      <CircularProgress />
    </div>
  </ThemeProvider>
);
