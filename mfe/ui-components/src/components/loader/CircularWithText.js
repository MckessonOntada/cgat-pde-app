import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CircularProgress from "@mui/material/CircularProgress"
import muiTheme from "../../assets/theme/MuiTheme"
import styles from "./assets/styles/Loader.module.scss"

export const CircularWithText = (props) => (
  <ThemeProvider theme={muiTheme}>
    <div
      id={props?.id}
      style={{
        height: props?.height,
      }}
    >
      <div className={styles.circularloaderTextContainer}>
        <p className={styles.circularloaderText}>{props?.loaderText}</p>
      </div>
      <CircularProgress size={props?.loaderSize}/>
    </div>
  </ThemeProvider>
)
