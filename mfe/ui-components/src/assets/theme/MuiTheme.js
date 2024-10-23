import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  typography: {
    fontFamily: ["var(--brand-font-family-body)"].join(","),
  },
  breakpoints: {
    values: {
      xs: 200,
      sm: 320,
      tab: 481,
      smT: 576,
      md: 768,
      "2md": 812,
      lg: 992,
      xl: 1280,
      "2xl": 1440,
    },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          overflowY: "visible",
        },
      },
    },
  },
});

export default muiTheme;
