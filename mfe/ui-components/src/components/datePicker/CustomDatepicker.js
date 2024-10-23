import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styles from "./assets/styles/CustomDatepicker.module.scss";
import { ReactComponent as ArrowLeft } from "./assets/svg/arrow-button-left.svg";
import { ReactComponent as ArrowRight } from "./assets/svg/arrow-button-right.svg";
import { ReactComponent as ArrowLeftDisabled } from "./assets/svg/arrow-button-left-disabled.svg";
import { ReactComponent as ArrowRightDisabled } from "./assets/svg/arrow-button-right-disabled.svg";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CommonUtils, Required, Label, TextError } from "../../";
import dayjs from "dayjs";

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: "3.8rem",

    "& :focus-visible": {
      outline: "none !important",
    },
    "&.Mui-disabled": {
      background: "var(--brand-color-cool-blue)",
    },
    "& .Mui-disabled fieldset": {
      border: "none",
    },
    "& fieldset": {
      borderRadius: "0.6rem",
      borderWidth: "0.1rem",
      borderStyle: "solid",
      borderColor: "var(--brand-color-primary-background)",
    },
    "&.Mui-focused fieldset": {
      borderRadius: "0.6rem",
      borderWidth: "0.1rem",
      borderStyle: "solid",
      borderColor: "var(--brand-color-secondary-active-yellow-1)",
    },
    "& input": {
      appearance: "none",
      fontSize: "var(--brand-font-size--default)",
      lineHeight: "var(--brand-line-height--m-large)",
      letterSpacing: "-0.001em",
      fontWeight: "var(--brand-font-weight-400)",
      color: "var(--brand-color-black)",
    },

    "& input:read-only + div + fieldset": {
      borderColor: "var(--brand-color-primary-background)",
    },
    "& .MuiSvgIcon-root": {
      width: "19.17px",
      height: "20px",
      color: "var(--brand-color-black)",
      backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9ImNhbGVuZGFyLTMgMiIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM3NTM2XzQyNjIpIj4KPHBhdGggaWQ9IlZlY3RvciIgZD0iTTUuMDAwMDIgN0g0LjMzMzM1QzQuMTU2NTQgNyAzLjk4Njk3IDcuMDcwMjQgMy44NjE5NSA3LjE5NTI2QzMuNzM2OTMgNy4zMjAyOSAzLjY2NjY5IDcuNDg5ODYgMy42NjY2OSA3LjY2NjY3QzMuNjY2NjkgNy44NDM0OCAzLjczNjkzIDguMDEzMDUgMy44NjE5NSA4LjEzODA3QzMuOTg2OTcgOC4yNjMxIDQuMTU2NTQgOC4zMzMzMyA0LjMzMzM1IDguMzMzMzNINS4wMDAwMkM1LjE3NjgzIDguMzMzMzMgNS4zNDY0IDguMjYzMSA1LjQ3MTQyIDguMTM4MDdDNS41OTY0NSA4LjAxMzA1IDUuNjY2NjkgNy44NDM0OCA1LjY2NjY5IDcuNjY2NjdDNS42NjY2OSA3LjQ4OTg2IDUuNTk2NDUgNy4zMjAyOSA1LjQ3MTQyIDcuMTk1MjZDNS4zNDY0IDcuMDcwMjQgNS4xNzY4MyA3IDUuMDAwMDIgN1oiIGZpbGw9IiMxRTM5NEUiLz4KPHBhdGggaWQ9IlZlY3Rvcl8yIiBkPSJNOC4zMzMzMyA3SDcuNjY2NjdDNy40ODk4NiA3IDcuMzIwMjkgNy4wNzAyNCA3LjE5NTI2IDcuMTk1MjZDNy4wNzAyNCA3LjMyMDI5IDcgNy40ODk4NiA3IDcuNjY2NjdDNyA3Ljg0MzQ4IDcuMDcwMjQgOC4wMTMwNSA3LjE5NTI2IDguMTM4MDdDNy4zMjAyOSA4LjI2MzEgNy40ODk4NiA4LjMzMzMzIDcuNjY2NjcgOC4zMzMzM0g4LjMzMzMzQzguNTEwMTQgOC4zMzMzMyA4LjY3OTcxIDguMjYzMSA4LjgwNDc0IDguMTM4MDdDOC45Mjk3NiA4LjAxMzA1IDkgNy44NDM0OCA5IDcuNjY2NjdDOSA3LjQ4OTg2IDguOTI5NzYgNy4zMjAyOSA4LjgwNDc0IDcuMTk1MjZDOC42Nzk3MSA3LjA3MDI0IDguNTEwMTQgNyA4LjMzMzMzIDdaIiBmaWxsPSIjMUUzOTRFIi8+CjxwYXRoIGlkPSJWZWN0b3JfMyIgZD0iTTExLjY2NjYgN0gxMUMxMC44MjMyIDcgMTAuNjUzNiA3LjA3MDI0IDEwLjUyODYgNy4xOTUyNkMxMC40MDM2IDcuMzIwMjkgMTAuMzMzMyA3LjQ4OTg2IDEwLjMzMzMgNy42NjY2N0MxMC4zMzMzIDcuODQzNDggMTAuNDAzNiA4LjAxMzA1IDEwLjUyODYgOC4xMzgwN0MxMC42NTM2IDguMjYzMSAxMC44MjMyIDguMzMzMzMgMTEgOC4zMzMzM0gxMS42NjY2QzExLjg0MzUgOC4zMzMzMyAxMi4wMTMgOC4yNjMxIDEyLjEzODEgOC4xMzgwN0MxMi4yNjMxIDguMDEzMDUgMTIuMzMzMyA3Ljg0MzQ4IDEyLjMzMzMgNy42NjY2N0MxMi4zMzMzIDcuNDg5ODYgMTIuMjYzMSA3LjMyMDI5IDEyLjEzODEgNy4xOTUyNkMxMi4wMTMgNy4wNzAyNCAxMS44NDM1IDcgMTEuNjY2NiA3WiIgZmlsbD0iIzFFMzk0RSIvPgo8cGF0aCBpZD0iVmVjdG9yXzQiIGQ9Ik01LjAwMDAyIDkuNjY2NjNINC4zMzMzNUM0LjE1NjU0IDkuNjY2NjMgMy45ODY5NyA5LjczNjg2IDMuODYxOTUgOS44NjE4OUMzLjczNjkzIDkuOTg2OTEgMy42NjY2OSAxMC4xNTY1IDMuNjY2NjkgMTAuMzMzM0MzLjY2NjY5IDEwLjUxMDEgMy43MzY5MyAxMC42Nzk3IDMuODYxOTUgMTAuODA0N0MzLjk4Njk3IDEwLjkyOTcgNC4xNTY1NCAxMSA0LjMzMzM1IDExSDUuMDAwMDJDNS4xNzY4MyAxMSA1LjM0NjQgMTAuOTI5NyA1LjQ3MTQyIDEwLjgwNDdDNS41OTY0NSAxMC42Nzk3IDUuNjY2NjkgMTAuNTEwMSA1LjY2NjY5IDEwLjMzMzNDNS42NjY2OSAxMC4xNTY1IDUuNTk2NDUgOS45ODY5MSA1LjQ3MTQyIDkuODYxODlDNS4zNDY0IDkuNzM2ODYgNS4xNzY4MyA5LjY2NjYzIDUuMDAwMDIgOS42NjY2M1oiIGZpbGw9IiMxRTM5NEUiLz4KPHBhdGggaWQ9IlZlY3Rvcl81IiBkPSJNOC4zMzMzMyA5LjY2NjYzSDcuNjY2NjdDNy40ODk4NiA5LjY2NjYzIDcuMzIwMjkgOS43MzY4NiA3LjE5NTI2IDkuODYxODlDNy4wNzAyNCA5Ljk4NjkxIDcgMTAuMTU2NSA3IDEwLjMzMzNDNyAxMC41MTAxIDcuMDcwMjQgMTAuNjc5NyA3LjE5NTI2IDEwLjgwNDdDNy4zMjAyOSAxMC45Mjk3IDcuNDg5ODYgMTEgNy42NjY2NyAxMUg4LjMzMzMzQzguNTEwMTQgMTEgOC42Nzk3MSAxMC45Mjk3IDguODA0NzQgMTAuODA0N0M4LjkyOTc2IDEwLjY3OTcgOSAxMC41MTAxIDkgMTAuMzMzM0M5IDEwLjE1NjUgOC45Mjk3NiA5Ljk4NjkxIDguODA0NzQgOS44NjE4OUM4LjY3OTcxIDkuNzM2ODYgOC41MTAxNCA5LjY2NjYzIDguMzMzMzMgOS42NjY2M1oiIGZpbGw9IiMxRTM5NEUiLz4KPHBhdGggaWQ9IlZlY3Rvcl82IiBkPSJNMTEuNjY2NiA5LjY2NjYzSDExQzEwLjgyMzIgOS42NjY2MyAxMC42NTM2IDkuNzM2ODYgMTAuNTI4NiA5Ljg2MTg5QzEwLjQwMzYgOS45ODY5MSAxMC4zMzMzIDEwLjE1NjUgMTAuMzMzMyAxMC4zMzMzQzEwLjMzMzMgMTAuNTEwMSAxMC40MDM2IDEwLjY3OTcgMTAuNTI4NiAxMC44MDQ3QzEwLjY1MzYgMTAuOTI5NyAxMC44MjMyIDExIDExIDExSDExLjY2NjZDMTEuODQzNSAxMSAxMi4wMTMgMTAuOTI5NyAxMi4xMzgxIDEwLjgwNDdDMTIuMjYzMSAxMC42Nzk3IDEyLjMzMzMgMTAuNTEwMSAxMi4zMzMzIDEwLjMzMzNDMTIuMzMzMyAxMC4xNTY1IDEyLjI2MzEgOS45ODY5MSAxMi4xMzgxIDkuODYxODlDMTIuMDEzIDkuNzM2ODYgMTEuODQzNSA5LjY2NjYzIDExLjY2NjYgOS42NjY2M1oiIGZpbGw9IiMxRTM5NEUiLz4KPHBhdGggaWQ9IlZlY3Rvcl83IiBkPSJNNS4wMDAwMiAxMi4zMzM0SDQuMzMzMzVDNC4xNTY1NCAxMi4zMzM0IDMuOTg2OTcgMTIuNDAzNiAzLjg2MTk1IDEyLjUyODZDMy43MzY5MyAxMi42NTM3IDMuNjY2NjkgMTIuODIzMiAzLjY2NjY5IDEzQzMuNjY2NjkgMTMuMTc2OSAzLjczNjkzIDEzLjM0NjQgMy44NjE5NSAxMy40NzE0QzMuOTg2OTcgMTMuNTk2NSA0LjE1NjU0IDEzLjY2NjcgNC4zMzMzNSAxMy42NjY3SDUuMDAwMDJDNS4xNzY4MyAxMy42NjY3IDUuMzQ2NCAxMy41OTY1IDUuNDcxNDIgMTMuNDcxNEM1LjU5NjQ1IDEzLjM0NjQgNS42NjY2OSAxMy4xNzY5IDUuNjY2NjkgMTNDNS42NjY2OSAxMi44MjMyIDUuNTk2NDUgMTIuNjUzNyA1LjQ3MTQyIDEyLjUyODZDNS4zNDY0IDEyLjQwMzYgNS4xNzY4MyAxMi4zMzM0IDUuMDAwMDIgMTIuMzMzNFoiIGZpbGw9IiMxRTM5NEUiLz4KPHBhdGggaWQ9IlZlY3Rvcl84IiBkPSJNOC4zMzMzMyAxMi4zMzM0SDcuNjY2NjdDNy40ODk4NiAxMi4zMzM0IDcuMzIwMjkgMTIuNDAzNiA3LjE5NTI2IDEyLjUyODZDNy4wNzAyNCAxMi42NTM3IDcgMTIuODIzMiA3IDEzQzcgMTMuMTc2OSA3LjA3MDI0IDEzLjM0NjQgNy4xOTUyNiAxMy40NzE0QzcuMzIwMjkgMTMuNTk2NSA3LjQ4OTg2IDEzLjY2NjcgNy42NjY2NyAxMy42NjY3SDguMzMzMzNDOC41MTAxNCAxMy42NjY3IDguNjc5NzEgMTMuNTk2NSA4LjgwNDc0IDEzLjQ3MTRDOC45Mjk3NiAxMy4zNDY0IDkgMTMuMTc2OSA5IDEzQzkgMTIuODIzMiA4LjkyOTc2IDEyLjY1MzcgOC44MDQ3NCAxMi41Mjg2QzguNjc5NzEgMTIuNDAzNiA4LjUxMDE0IDEyLjMzMzQgOC4zMzMzMyAxMi4zMzM0WiIgZmlsbD0iIzFFMzk0RSIvPgo8cGF0aCBpZD0iVmVjdG9yXzkiIGQ9Ik0xMS42NjY2IDEyLjMzMzRIMTFDMTAuODIzMiAxMi4zMzM0IDEwLjY1MzYgMTIuNDAzNiAxMC41Mjg2IDEyLjUyODZDMTAuNDAzNiAxMi42NTM3IDEwLjMzMzMgMTIuODIzMiAxMC4zMzMzIDEzQzEwLjMzMzMgMTMuMTc2OSAxMC40MDM2IDEzLjM0NjQgMTAuNTI4NiAxMy40NzE0QzEwLjY1MzYgMTMuNTk2NSAxMC44MjMyIDEzLjY2NjcgMTEgMTMuNjY2N0gxMS42NjY2QzExLjg0MzUgMTMuNjY2NyAxMi4wMTMgMTMuNTk2NSAxMi4xMzgxIDEzLjQ3MTRDMTIuMjYzMSAxMy4zNDY0IDEyLjMzMzMgMTMuMTc2OSAxMi4zMzMzIDEzQzEyLjMzMzMgMTIuODIzMiAxMi4yNjMxIDEyLjY1MzcgMTIuMTM4MSAxMi41Mjg2QzEyLjAxMyAxMi40MDM2IDExLjg0MzUgMTIuMzMzNCAxMS42NjY2IDEyLjMzMzRaIiBmaWxsPSIjMUUzOTRFIi8+CjxwYXRoIGlkPSJWZWN0b3JfMTAiIGQ9Ik0xNC4zMzMzIDJIMTIuNUMxMi40NTU4IDIgMTIuNDEzNCAxLjk4MjQ0IDEyLjM4MjEgMS45NTExOEMxMi4zNTA5IDEuOTE5OTMgMTIuMzMzMyAxLjg3NzU0IDEyLjMzMzMgMS44MzMzM1YwLjY2NjY2N0MxMi4zMzMzIDAuNDg5ODU2IDEyLjI2MzEgMC4zMjAyODYgMTIuMTM4MSAwLjE5NTI2MkMxMi4wMTMgMC4wNzAyMzc5IDExLjg0MzUgMCAxMS42NjY2IDBDMTEuNDg5OCAwIDExLjMyMDMgMC4wNzAyMzc5IDExLjE5NTIgMC4xOTUyNjJDMTEuMDcwMiAwLjMyMDI4NiAxMSAwLjQ4OTg1NiAxMSAwLjY2NjY2N1YzLjgzMzMzQzExIDMuOTY1OTQgMTAuOTQ3MyA0LjA5MzEyIDEwLjg1MzUgNC4xODY4OUMxMC43NTk4IDQuMjgwNjUgMTAuNjMyNiA0LjMzMzMzIDEwLjUgNC4zMzMzM0MxMC4zNjc0IDQuMzMzMzMgMTAuMjQwMiA0LjI4MDY1IDEwLjE0NjQgNC4xODY4OUMxMC4wNTI3IDQuMDkzMTIgOS45OTk5OCAzLjk2NTk0IDkuOTk5OTggMy44MzMzM1YyLjMzMzMzQzkuOTk5OTggMi4yNDQ5MyA5Ljk2NDg2IDIuMTYwMTQgOS45MDIzNSAyLjA5NzYzQzkuODM5ODQgMi4wMzUxMiA5Ljc1NTA1IDIgOS42NjY2NSAySDUuNDk5OThDNS40NTU4OSAyIDUuNDEzNiAxLjk4MjUzIDUuMzgyMzYgMS45NTE0MkM1LjM1MTEzIDEuOTIwMzEgNS4zMzM0OSAxLjg3ODA5IDUuMzMzMzEgMS44MzRWMC42NjY2NjdDNS4zMzMzMSAwLjQ4OTg1NiA1LjI2MzA3IDAuMzIwMjg2IDUuMTM4MDUgMC4xOTUyNjJDNS4wMTMwMyAwLjA3MDIzNzkgNC44NDM0NiAwIDQuNjY2NjUgMEM0LjQ4OTg0IDAgNC4zMjAyNyAwLjA3MDIzNzkgNC4xOTUyNCAwLjE5NTI2MkM0LjA3MDIyIDAuMzIwMjg2IDMuOTk5OTggMC40ODk4NTYgMy45OTk5OCAwLjY2NjY2N1YzLjgzMzMzQzMuOTk5OTggMy45NjU5NCAzLjk0NzMgNC4wOTMxMiAzLjg1MzUzIDQuMTg2ODlDMy43NTk3NiA0LjI4MDY1IDMuNjMyNTkgNC4zMzMzMyAzLjQ5OTk4IDQuMzMzMzNDMy4zNjczNyA0LjMzMzMzIDMuMjQwMTkgNC4yODA2NSAzLjE0NjQzIDQuMTg2ODlDMy4wNTI2NiA0LjA5MzEyIDIuOTk5OTggMy45NjU5NCAyLjk5OTk4IDMuODMzMzNWMi4zMzMzM0MyLjk5OTk4IDIuMjQ0OTMgMi45NjQ4NiAyLjE2MDE0IDIuOTAyMzUgMi4wOTc2M0MyLjgzOTg0IDIuMDM1MTIgMi43NTUwNSAyIDIuNjY2NjUgMkgxLjY2NjY1QzEuMzEzMDIgMiAwLjk3Mzg4NiAyLjE0MDQ4IDAuNzIzODM3IDIuMzkwNTJDMC40NzM3ODkgMi42NDA1NyAwLjMzMzMxMyAyLjk3OTcxIDAuMzMzMzEzIDMuMzMzMzNWMTQuNjY2N0MwLjMzMzMxMyAxNS4wMjAzIDAuNDczNzg5IDE1LjM1OTQgMC43MjM4MzcgMTUuNjA5NUMwLjk3Mzg4NiAxNS44NTk1IDEuMzEzMDIgMTYgMS42NjY2NSAxNkgxNC4zMzMzQzE0LjY4NjkgMTYgMTUuMDI2MSAxNS44NTk1IDE1LjI3NjEgMTUuNjA5NUMxNS41MjYyIDE1LjM1OTQgMTUuNjY2NiAxNS4wMjAzIDE1LjY2NjYgMTQuNjY2N1YzLjMzMzMzQzE1LjY2NjYgMi45Nzk3MSAxNS41MjYyIDIuNjQwNTcgMTUuMjc2MSAyLjM5MDUyQzE1LjAyNjEgMi4xNDA0OCAxNC42ODY5IDIgMTQuMzMzMyAyWk0xNC4zMzMzIDE0LjMzMzNDMTQuMzMzMyAxNC40MjE3IDE0LjI5ODIgMTQuNTA2NSAxNC4yMzU3IDE0LjU2OUMxNC4xNzMyIDE0LjYzMTUgMTQuMDg4NCAxNC42NjY3IDE0IDE0LjY2NjdIMS45OTk5OEMxLjkxMTU3IDE0LjY2NjcgMS44MjY3OSAxNC42MzE1IDEuNzY0MjggMTQuNTY5QzEuNzAxNzcgMTQuNTA2NSAxLjY2NjY1IDE0LjQyMTcgMS42NjY2NSAxNC4zMzMzVjYuMzMzMzNDMS42NjY2NSA2LjI0NDkzIDEuNzAxNzcgNi4xNjAxNCAxLjc2NDI4IDYuMDk3NjNDMS44MjY3OSA2LjAzNTEyIDEuOTExNTcgNiAxLjk5OTk4IDZIMTRDMTQuMDg4NCA2IDE0LjE3MzIgNi4wMzUxMiAxNC4yMzU3IDYuMDk3NjNDMTQuMjk4MiA2LjE2MDE0IDE0LjMzMzMgNi4yNDQ5MyAxNC4zMzMzIDYuMzMzMzNWMTQuMzMzM1oiIGZpbGw9IiMxRTM5NEUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zNzUzNl80MjYyIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=)`,
      backgroundRepeat: "no-repeat",
    },
    "& .MuiSvgIcon-root path": {
      display: "none",
    },
  },
  "&.isReadOnly .MuiSvgIcon-root": {
    width: "19.17px",
    height: "20px",
    backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9ImNhbGVuZGFyLTMgMiIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQ3NTFfMTg5KSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik00Ljk5OTk5IDdINC4zMzMzMkM0LjE1NjUxIDcgMy45ODY5NCA3LjA3MDI0IDMuODYxOTIgNy4xOTUyNkMzLjczNjg5IDcuMzIwMjkgMy42NjY2NiA3LjQ4OTg2IDMuNjY2NjYgNy42NjY2N0MzLjY2NjY2IDcuODQzNDggMy43MzY4OSA4LjAxMzA1IDMuODYxOTIgOC4xMzgwN0MzLjk4Njk0IDguMjYzMSA0LjE1NjUxIDguMzMzMzMgNC4zMzMzMiA4LjMzMzMzSDQuOTk5OTlDNS4xNzY4IDguMzMzMzMgNS4zNDYzNyA4LjI2MzEgNS40NzEzOSA4LjEzODA3QzUuNTk2NDIgOC4wMTMwNSA1LjY2NjY2IDcuODQzNDggNS42NjY2NiA3LjY2NjY3QzUuNjY2NjYgNy40ODk4NiA1LjU5NjQyIDcuMzIwMjkgNS40NzEzOSA3LjE5NTI2QzUuMzQ2MzcgNy4wNzAyNCA1LjE3NjggNyA0Ljk5OTk5IDdaIiBmaWxsPSIjNjI3Mzg2Ii8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTguMzMzMzMgN0g3LjY2NjY3QzcuNDg5ODYgNyA3LjMyMDI5IDcuMDcwMjQgNy4xOTUyNiA3LjE5NTI2QzcuMDcwMjQgNy4zMjAyOSA3IDcuNDg5ODYgNyA3LjY2NjY3QzcgNy44NDM0OCA3LjA3MDI0IDguMDEzMDUgNy4xOTUyNiA4LjEzODA3QzcuMzIwMjkgOC4yNjMxIDcuNDg5ODYgOC4zMzMzMyA3LjY2NjY3IDguMzMzMzNIOC4zMzMzM0M4LjUxMDE0IDguMzMzMzMgOC42Nzk3MSA4LjI2MzEgOC44MDQ3NCA4LjEzODA3QzguOTI5NzYgOC4wMTMwNSA5IDcuODQzNDggOSA3LjY2NjY3QzkgNy40ODk4NiA4LjkyOTc2IDcuMzIwMjkgOC44MDQ3NCA3LjE5NTI2QzguNjc5NzEgNy4wNzAyNCA4LjUxMDE0IDcgOC4zMzMzMyA3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzMiIGQ9Ik0xMS42NjY3IDdIMTFDMTAuODIzMiA3IDEwLjY1MzYgNy4wNzAyNCAxMC41Mjg2IDcuMTk1MjZDMTAuNDAzNiA3LjMyMDI5IDEwLjMzMzMgNy40ODk4NiAxMC4zMzMzIDcuNjY2NjdDMTAuMzMzMyA3Ljg0MzQ4IDEwLjQwMzYgOC4wMTMwNSAxMC41Mjg2IDguMTM4MDdDMTAuNjUzNiA4LjI2MzEgMTAuODIzMiA4LjMzMzMzIDExIDguMzMzMzNIMTEuNjY2N0MxMS44NDM1IDguMzMzMzMgMTIuMDEzMSA4LjI2MzEgMTIuMTM4MSA4LjEzODA3QzEyLjI2MzEgOC4wMTMwNSAxMi4zMzMzIDcuODQzNDggMTIuMzMzMyA3LjY2NjY3QzEyLjMzMzMgNy40ODk4NiAxMi4yNjMxIDcuMzIwMjkgMTIuMTM4MSA3LjE5NTI2QzEyLjAxMzEgNy4wNzAyNCAxMS44NDM1IDcgMTEuNjY2NyA3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzQiIGQ9Ik00Ljk5OTk5IDkuNjY2NjdINC4zMzMzMkM0LjE1NjUxIDkuNjY2NjcgMy45ODY5NCA5LjczNjkxIDMuODYxOTIgOS44NjE5M0MzLjczNjg5IDkuOTg2OTUgMy42NjY2NiAxMC4xNTY1IDMuNjY2NjYgMTAuMzMzM0MzLjY2NjY2IDEwLjUxMDEgMy43MzY4OSAxMC42Nzk3IDMuODYxOTIgMTAuODA0N0MzLjk4Njk0IDEwLjkyOTggNC4xNTY1MSAxMSA0LjMzMzMyIDExSDQuOTk5OTlDNS4xNzY4IDExIDUuMzQ2MzcgMTAuOTI5OCA1LjQ3MTM5IDEwLjgwNDdDNS41OTY0MiAxMC42Nzk3IDUuNjY2NjYgMTAuNTEwMSA1LjY2NjY2IDEwLjMzMzNDNS42NjY2NiAxMC4xNTY1IDUuNTk2NDIgOS45ODY5NSA1LjQ3MTM5IDkuODYxOTNDNS4zNDYzNyA5LjczNjkxIDUuMTc2OCA5LjY2NjY3IDQuOTk5OTkgOS42NjY2N1oiIGZpbGw9IiM2MjczODYiLz4KPHBhdGggaWQ9IlZlY3Rvcl81IiBkPSJNOC4zMzMzMyA5LjY2NjY3SDcuNjY2NjdDNy40ODk4NiA5LjY2NjY3IDcuMzIwMjkgOS43MzY5MSA3LjE5NTI2IDkuODYxOTNDNy4wNzAyNCA5Ljk4Njk1IDcgMTAuMTU2NSA3IDEwLjMzMzNDNyAxMC41MTAxIDcuMDcwMjQgMTAuNjc5NyA3LjE5NTI2IDEwLjgwNDdDNy4zMjAyOSAxMC45Mjk4IDcuNDg5ODYgMTEgNy42NjY2NyAxMUg4LjMzMzMzQzguNTEwMTQgMTEgOC42Nzk3MSAxMC45Mjk4IDguODA0NzQgMTAuODA0N0M4LjkyOTc2IDEwLjY3OTcgOSAxMC41MTAxIDkgMTAuMzMzM0M5IDEwLjE1NjUgOC45Mjk3NiA5Ljk4Njk1IDguODA0NzQgOS44NjE5M0M4LjY3OTcxIDkuNzM2OTEgOC41MTAxNCA5LjY2NjY3IDguMzMzMzMgOS42NjY2N1oiIGZpbGw9IiM2MjczODYiLz4KPHBhdGggaWQ9IlZlY3Rvcl82IiBkPSJNMTEuNjY2NyA5LjY2NjY3SDExQzEwLjgyMzIgOS42NjY2NyAxMC42NTM2IDkuNzM2OTEgMTAuNTI4NiA5Ljg2MTkzQzEwLjQwMzYgOS45ODY5NSAxMC4zMzMzIDEwLjE1NjUgMTAuMzMzMyAxMC4zMzMzQzEwLjMzMzMgMTAuNTEwMSAxMC40MDM2IDEwLjY3OTcgMTAuNTI4NiAxMC44MDQ3QzEwLjY1MzYgMTAuOTI5OCAxMC44MjMyIDExIDExIDExSDExLjY2NjdDMTEuODQzNSAxMSAxMi4wMTMxIDEwLjkyOTggMTIuMTM4MSAxMC44MDQ3QzEyLjI2MzEgMTAuNjc5NyAxMi4zMzMzIDEwLjUxMDEgMTIuMzMzMyAxMC4zMzMzQzEyLjMzMzMgMTAuMTU2NSAxMi4yNjMxIDkuOTg2OTUgMTIuMTM4MSA5Ljg2MTkzQzEyLjAxMzEgOS43MzY5MSAxMS44NDM1IDkuNjY2NjcgMTEuNjY2NyA5LjY2NjY3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzciIGQ9Ik00Ljk5OTk5IDEyLjMzMzNINC4zMzMzMkM0LjE1NjUxIDEyLjMzMzMgMy45ODY5NCAxMi40MDM2IDMuODYxOTIgMTIuNTI4NkMzLjczNjg5IDEyLjY1MzYgMy42NjY2NiAxMi44MjMyIDMuNjY2NjYgMTNDMy42NjY2NiAxMy4xNzY4IDMuNzM2ODkgMTMuMzQ2NCAzLjg2MTkyIDEzLjQ3MTRDMy45ODY5NCAxMy41OTY0IDQuMTU2NTEgMTMuNjY2NyA0LjMzMzMyIDEzLjY2NjdINC45OTk5OUM1LjE3NjggMTMuNjY2NyA1LjM0NjM3IDEzLjU5NjQgNS40NzEzOSAxMy40NzE0QzUuNTk2NDIgMTMuMzQ2NCA1LjY2NjY2IDEzLjE3NjggNS42NjY2NiAxM0M1LjY2NjY2IDEyLjgyMzIgNS41OTY0MiAxMi42NTM2IDUuNDcxMzkgMTIuNTI4NkM1LjM0NjM3IDEyLjQwMzYgNS4xNzY4IDEyLjMzMzMgNC45OTk5OSAxMi4zMzMzWiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzgiIGQ9Ik04LjMzMzMzIDEyLjMzMzNINy42NjY2N0M3LjQ4OTg2IDEyLjMzMzMgNy4zMjAyOSAxMi40MDM2IDcuMTk1MjYgMTIuNTI4NkM3LjA3MDI0IDEyLjY1MzYgNyAxMi44MjMyIDcgMTNDNyAxMy4xNzY4IDcuMDcwMjQgMTMuMzQ2NCA3LjE5NTI2IDEzLjQ3MTRDNy4zMjAyOSAxMy41OTY0IDcuNDg5ODYgMTMuNjY2NyA3LjY2NjY3IDEzLjY2NjdIOC4zMzMzM0M4LjUxMDE0IDEzLjY2NjcgOC42Nzk3MSAxMy41OTY0IDguODA0NzQgMTMuNDcxNEM4LjkyOTc2IDEzLjM0NjQgOSAxMy4xNzY4IDkgMTNDOSAxMi44MjMyIDguOTI5NzYgMTIuNjUzNiA4LjgwNDc0IDEyLjUyODZDOC42Nzk3MSAxMi40MDM2IDguNTEwMTQgMTIuMzMzMyA4LjMzMzMzIDEyLjMzMzNaIiBmaWxsPSIjNjI3Mzg2Ii8+CjxwYXRoIGlkPSJWZWN0b3JfOSIgZD0iTTExLjY2NjcgMTIuMzMzM0gxMUMxMC44MjMyIDEyLjMzMzMgMTAuNjUzNiAxMi40MDM2IDEwLjUyODYgMTIuNTI4NkMxMC40MDM2IDEyLjY1MzYgMTAuMzMzMyAxMi44MjMyIDEwLjMzMzMgMTNDMTAuMzMzMyAxMy4xNzY4IDEwLjQwMzYgMTMuMzQ2NCAxMC41Mjg2IDEzLjQ3MTRDMTAuNjUzNiAxMy41OTY0IDEwLjgyMzIgMTMuNjY2NyAxMSAxMy42NjY3SDExLjY2NjdDMTEuODQzNSAxMy42NjY3IDEyLjAxMzEgMTMuNTk2NCAxMi4xMzgxIDEzLjQ3MTRDMTIuMjYzMSAxMy4zNDY0IDEyLjMzMzMgMTMuMTc2OCAxMi4zMzMzIDEzQzEyLjMzMzMgMTIuODIzMiAxMi4yNjMxIDEyLjY1MzYgMTIuMTM4MSAxMi41Mjg2QzEyLjAxMzEgMTIuNDAzNiAxMS44NDM1IDEyLjMzMzMgMTEuNjY2NyAxMi4zMzMzWiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzEwIiBkPSJNMTQuMzMzMyAySDEyLjVDMTIuNDU1OCAyIDEyLjQxMzQgMS45ODI0NCAxMi4zODIyIDEuOTUxMThDMTIuMzUwOSAxLjkxOTkzIDEyLjMzMzMgMS44Nzc1NCAxMi4zMzMzIDEuODMzMzNWMC42NjY2NjdDMTIuMzMzMyAwLjQ4OTg1NiAxMi4yNjMxIDAuMzIwMjg2IDEyLjEzODEgMC4xOTUyNjJDMTIuMDEzMSAwLjA3MDIzNzkgMTEuODQzNSAwIDExLjY2NjcgMEMxMS40ODk5IDAgMTEuMzIwMyAwLjA3MDIzNzkgMTEuMTk1MyAwLjE5NTI2MkMxMS4wNzAyIDAuMzIwMjg2IDExIDAuNDg5ODU2IDExIDAuNjY2NjY3VjMuODMzMzNDMTEgMy45NjU5NCAxMC45NDczIDQuMDkzMTIgMTAuODUzNiA0LjE4Njg5QzEwLjc1OTggNC4yODA2NiAxMC42MzI2IDQuMzMzMzMgMTAuNSA0LjMzMzMzQzEwLjM2NzQgNC4zMzMzMyAxMC4yNDAyIDQuMjgwNjYgMTAuMTQ2NSA0LjE4Njg5QzEwLjA1MjcgNC4wOTMxMiAxMCAzLjk2NTk0IDEwIDMuODMzMzNWMi4zMzMzM0MxMCAyLjI0NDkzIDkuOTY0ODkgMi4xNjAxNCA5LjkwMjM4IDIuMDk3NjNDOS44Mzk4NyAyLjAzNTEyIDkuNzU1MDggMiA5LjY2NjY4IDJINS41MDAwMUM1LjQ1NTkyIDIgNS40MTM2MyAxLjk4MjUzIDUuMzgyMzkgMS45NTE0MkM1LjM1MTE2IDEuOTIwMzEgNS4zMzM1MiAxLjg3ODA5IDUuMzMzMzQgMS44MzRWMC42NjY2NjdDNS4zMzMzNCAwLjQ4OTg1NiA1LjI2MzExIDAuMzIwMjg2IDUuMTM4MDggMC4xOTUyNjJDNS4wMTMwNiAwLjA3MDIzNzkgNC44NDM0OSAwIDQuNjY2NjggMEM0LjQ4OTg3IDAgNC4zMjAzIDAuMDcwMjM3OSA0LjE5NTI3IDAuMTk1MjYyQzQuMDcwMjUgMC4zMjAyODYgNC4wMDAwMSAwLjQ4OTg1NiA0LjAwMDAxIDAuNjY2NjY3VjMuODMzMzNDNC4wMDAwMSAzLjk2NTk0IDMuOTQ3MzMgNC4wOTMxMiAzLjg1MzU2IDQuMTg2ODlDMy43NTk4IDQuMjgwNjYgMy42MzI2MiA0LjMzMzMzIDMuNTAwMDEgNC4zMzMzM0MzLjM2NzQgNC4zMzMzMyAzLjI0MDIyIDQuMjgwNjYgMy4xNDY0NiA0LjE4Njg5QzMuMDUyNjkgNC4wOTMxMiAzLjAwMDAxIDMuOTY1OTQgMy4wMDAwMSAzLjgzMzMzVjIuMzMzMzNDMy4wMDAwMSAyLjI0NDkzIDIuOTY0ODkgMi4xNjAxNCAyLjkwMjM4IDIuMDk3NjNDMi44Mzk4NyAyLjAzNTEyIDIuNzU1MDggMiAyLjY2NjY4IDJIMS42NjY2OEMxLjMxMzA1IDIgMC45NzM5MTYgMi4xNDA0OCAwLjcyMzg2OCAyLjM5MDUyQzAuNDczODE5IDIuNjQwNTcgMC4zMzMzNDQgMi45Nzk3MSAwLjMzMzM0NCAzLjMzMzMzVjE0LjY2NjdDMC4zMzMzNDQgMTUuMDIwMyAwLjQ3MzgxOSAxNS4zNTk0IDAuNzIzODY4IDE1LjYwOTVDMC45NzM5MTYgMTUuODU5NSAxLjMxMzA1IDE2IDEuNjY2NjggMTZIMTQuMzMzM0MxNC42ODcgMTYgMTUuMDI2MSAxNS44NTk1IDE1LjI3NjIgMTUuNjA5NUMxNS41MjYyIDE1LjM1OTQgMTUuNjY2NyAxNS4wMjAzIDE1LjY2NjcgMTQuNjY2N1YzLjMzMzMzQzE1LjY2NjcgMi45Nzk3MSAxNS41MjYyIDIuNjQwNTcgMTUuMjc2MiAyLjM5MDUyQzE1LjAyNjEgMi4xNDA0OCAxNC42ODcgMiAxNC4zMzMzIDJaTTE0LjMzMzMgMTQuMzMzM0MxNC4zMzMzIDE0LjQyMTcgMTQuMjk4MiAxNC41MDY1IDE0LjIzNTcgMTQuNTY5QzE0LjE3MzIgMTQuNjMxNSAxNC4wODg0IDE0LjY2NjcgMTQgMTQuNjY2N0gyLjAwMDAxQzEuOTExNiAxNC42NjY3IDEuODI2ODIgMTQuNjMxNSAxLjc2NDMxIDE0LjU2OUMxLjcwMTggMTQuNTA2NSAxLjY2NjY4IDE0LjQyMTcgMS42NjY2OCAxNC4zMzMzVjYuMzMzMzNDMS42NjY2OCA2LjI0NDkzIDEuNzAxOCA2LjE2MDE0IDEuNzY0MzEgNi4wOTc2M0MxLjgyNjgyIDYuMDM1MTIgMS45MTE2IDYgMi4wMDAwMSA2SDE0QzE0LjA4ODQgNiAxNC4xNzMyIDYuMDM1MTIgMTQuMjM1NyA2LjA5NzYzQzE0LjI5ODIgNi4xNjAxNCAxNC4zMzMzIDYuMjQ0OTMgMTQuMzMzMyA2LjMzMzMzVjE0LjMzMzNaIiBmaWxsPSIjNjI3Mzg2Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNDc1MV8xODkiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==)`,
    backgroundRepeat: "no-repeat",
  },
  "& .Mui-error ": {
    "& input": {
      appearance: "none",
      fontSize: "var(--brand-font-size--default)",
      padding: "7.5px 12px !important",
      lineHeight: "var(--brand-line-height--m-large)",
      letterSpacing: "-0.001em",
      fontWeight: "var(--brand-font-weight-400)",
      color: "var(--brand-color-warning-orange-4) !important",
    },
    "& .MuiSvgIcon-root": {
      width: "19.17px",
      height: "20px",
      color: "var(--brand-color-warning-orange-4) !important",
    },
  },
});

export const CustomDatepicker = (props) => {
  const [localValue, setLocalValue] = React.useState("");

  const modalTheme = createTheme({
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontFamily: "nunito !important",
            "&.Mui-selected": {
              border:
                "0.2rem solid var(--brand-color-secondary-active-yellow-1) !important",
              backgroundColor:
                "var(--brand-color-secondary-active-yellow-2) !important",
              color: "var(--brand-color-black-1) !important",
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            minWidth: "300px !important",
            width: "300px",
          },
        },
      },

      MuiDialogContent: {
        styleOverrides: {
          root: {
            overflow: "hidden",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            justifyContent: "center",
            padding: " 24px 16px",
            "button:first-of-type": {
              padding: "7px 16px",
              border: "1px solid var(--brand-color-primary)",
              height: "32px",
              borderRadius: "6px",
              fontSize: "var(--brand-font-size--small)",
              fontWeight: "var(--brand-font-weight-600)",
              lineHeight: "var(--brand-line-height--large)",
              width: "96px",
            },
            "button:last-of-type": {
              padding: "7px 16px",
              border: "1px solid var(--brand-color-primary)",
              height: "32px",
              borderRadius: "6px",
              fontSize: "var(--brand-font-size--small)",
              fontWeight: "var(--brand-font-weight-600)",
              lineHeight: "var(--brand-line-height--large)",
              backgroundColor: "var(--brand-color-primary)",
              color: "var(--brand-color-background-white)",
              width: "96px",
              marginLeft: "12px",
            },
          },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            width: "300px",
            minWidth: "300px",
            fontFamily: "nunito !important",
            marginLeft: "21px !important",
            marginTop: props?.variant == "arrow" ? "10px !important" : "",
            button: {
              fontWeight: "400",
              fontSize: "var(--brand-font-size--extra-small)",
              lineHeight: "var(--brand-line-height--medium)",
              color: "var(--brand-color-font-black) !important",
              "&.Mui-disabled": {
                color: "var(--brand-color-text-cool-grey) !important",
              },
            },
          },
        },
      },
      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            width: "300px",
            margin: "0px",
            height: "auto",
            overflow: "hidden",
          },
          viewTransitionContainer: {
            overflow: "hidden",
            padding: "16px",
          },
        },
      },
      MuiDayPicker: {
        styleOverrides: {
          slideTransition: {
            minHeight: "172px",
            overflowX: "inherit",
          },
          header: {
            gap: "12px",
            marginBottom: "8px",
          },
          weekContainer: {
            gap: "8px",
            justifyContent: "space-around",
            margin: "0",

            "&:not(:last-child)": {
              marginBottom: "8px",
            },
            button: {
              fontSize: "var(--brand-font-size--extra-small)",
              lineHeight: "var(--brand-line-height--medium)",
            },
          },
          monthContainer: {
            position: "relative",
          },
          weekDayLabel: {
            height: "28px",
            width: "28px",
            fontWeight: "600",
            fontSize: "1.2rem",
            lineHeight: "1.6rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "--brand-color-text-light-slate !important",
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            height: "28px",
            width: "28px",
            margin: "0px",
          },
          Mui: {
            selected: {
              border:
                "0.2rem solid var(--brand-color-secondary-active-yellow-1)",
              backgroundColor: "var(--brand-color-secondary-active-yellow-2)",
            },
          },
        },
      },
      MuiMonthPicker: {
        styleOverrides: {
          root: {
            width: "100%",
            height: "160px",
            margin: "0px",

            button: {
              width: "72px !important",
              height: "28px !important",
              borderRadius: "16px",
              margin: "0px 8px",
              flex: "none",
              order: "1",
              flexGrow: "0",
              fontSize: "var(--brand-font-size--small)!important",

              "&.Mui-selected": {
                border:
                  "0.2rem solid var(--brand-color-secondary-active-yellow-1) !important",
                backgroundColor:
                  "var(--brand-color-secondary-active-yellow-2) !important",
                color: "var(--brand-color-black-1) !important",
              },
            },
          },
        },
      },
      MuiYearPicker: {
        styleOverrides: {
          root: {
            width: "284px",
            paddingLeft: "0 ",
            gap: "16px",
            maxHeight: "248px",
          },
        },
      },
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            minHeight: "20px",
            maxHeight: "20px",
            padding: "0px",
            margin: "16px 16px 0 16px",
          },
          labelSubContainer: {
            maxHeight: "20px",
            alignItems: "flex-start",
          },
          label: {
            height: "20px",
            marginLeft: "0px",
            fontWeight: "var(--brand-font-weight-600)",
            fontSize: "var(--brand-line-height--medium)",
            lineHeight: "var(--brand-line-height--m-large)",
            letterSpacing: "-0.001em !important",
            color: "var(--brand-color-font-black) !important",
            fontFamily: "nunito !important",
          },
          switchViewButton: {
            padding: "0px",
          },
          switchViewIcon: {
            fontSize: "2rem",
          },
        },
      },
      PrivatePickersYear: {
        styleOverrides: {
          root: {
            width: "56px !important",
            height: "28px !important",
            flexBasis: "0%",
          },
          button: {
            width: "56px !important",
            height: "28px !important",
            borderRadius: "16px",
            margin: "0px",
            fontSize: "var(--brand-line-height--small)!important",

            "&.Mui-selected": {
              border:
                "0.2rem solid var(--brand-color-secondary-active-yellow-1) !important",
              backgroundColor:
                "var(--brand-color-secondary-active-yellow-2) !important",
              color: "var(--brand-color-black-1) !important",
            },
          },
        },
      },
      PrivatePickersMonth: {
        styleOverrides: {
          root: {
            width: "72px !important",
            height: "28px !important",
            margin: "0px",
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          root: {
            height: "20px",
          },
          spacer: {
            width: "12px !important",
          },
          button: {
            width: "20px",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fontSize: "2.5rem",
            color: "var(--brand-color-primary-background)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: "nunito !important",
          },
          overline: {
            display: "none",
          },
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            fontFamily: "nunito !important",
            padding: "24px",
            h4: {
              fontSize: "var(--brand-font-size--28)",
              fontWeight: "var(--brand-font-weight-600)",
              lineHeight: "var(--brand-line-height--32)",
            },
            svg: {
              width: "1.6rem",
              height: "1.6rem",
              color: "var(--brand-color-primary-background)",
            },
          },
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          overflow: "hidden",
        },
      },
    },
  });

  const {
    id,
    label,
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly,
    helperMessage,
    onChangeFn,
    value,
    pickerFormat,
    views,
    isMobileView,
    isSuccess,
    onBlur,
    clearDate,
    disableFuture,
    disablePast,
    disableDateTill,
    disableAutosuggestion,
    disableTyping,
    isShowLabel,
    requiredLabel,
    variant,
    onClickLeftArrow,
    onClickRightArrow,
    isLeftArrowDisabled,
    isRightArrowDisabled,
    helperText,
    labelTemplate,
    hidePlaceHolder,
    showRequiredIcon
  } = props;

  useEffect(() => {
    if (CommonUtils.isNonEmptyString(value)) {
      setLocalValue(dayjs(value).format(pickerFormat));
    } else if (clearDate) {
      setLocalValue(value === "" ? null : value);
    }
  }, [value]);
  const handleChange = (changedDate) => {
    if (CommonUtils.isNonNullObject(changedDate)) {
      setLocalValue(dayjs(changedDate).format(pickerFormat));
      if (onChangeFn) {
        onChangeFn(dayjs(changedDate).format(pickerFormat));
      }
    } else {
      if (onChangeFn) {
        onChangeFn("");
      }
    }
  };
  let DateTag = isMobileView ? MobileDatePicker : DesktopDatePicker;

  const disableOnKeyDown = (e) => {
    if (disableTyping) {
      e.preventDefault();
    }
  };
  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `dateInput-helperText-${id} `;
    }
    if (isInvalid) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  const shouldDisableDate = (date) => {
    const disabledFromDate = new Date(disableDateTill ? disableDateTill : "");
    return date < disabledFromDate;
  };

  return (
    <div className={styles.labelParentContainer}>
      {isShowLabel && (
        <div className={styles.labelParentContainer}>
          <div className={`${styles.labelSubContainer} w-100`}>
            <Label
              htmlFor={"dateInput-" + id}
              id={"dateInput-label-" + id}
              data-testid={"dateInput-label-testid-" + id}
              labelTemplate={labelTemplate}
              className={` ${requiredLabel && styles.dFlex}${
                variant == "arrow" ? styles.arrowLabel : ""
              }`}
            >
              {label}
              {isRequired && showRequiredIcon && <Required isLegend={requiredLabel} />}
            </Label>
          </div>
        </div>
      )}
      {helperText && (
        <p
          id={`dateInput-helperText-${id}`}
          data-testid={"dateInput-helperText-testid-" + id}
          className={`${styles.helperText} ${
            variant == "arrow" ? styles.arrowLabel : ""
          } w-100`}
        >
          {helperText}
        </p>
      )}
      <div className={`${styles.inputFieldContainer}`}>
        <ThemeProvider theme={modalTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {variant == "arrow" && (
              <button
                data-testid={"dateInput-leftArrow-" + id}
                disabled={isDisabled || isLeftArrowDisabled}
                className={`${styles.arrowButton} ${styles.leftArrow} ${
                  !(isDisabled || isLeftArrowDisabled)
                    ? styles.enabledArrow
                    : ""
                }`}
                onClick={() => onClickLeftArrow()}
              >
                {isDisabled || isLeftArrowDisabled ? (
                  <ArrowLeftDisabled />
                ) : (
                  <ArrowLeft />
                )}
              </button>
            )}
            <DateTag
              inputFormat={pickerFormat}
              views={views}
              value={localValue}
              onChange={(changedDate) => handleChange(changedDate)}
              disabled={isDisabled}
              readOnly={isReadOnly}
              disableFuture={disableFuture ? disableFuture : false}
              shouldDisableDate={disableDateTill && shouldDisableDate}
              disablePast={disablePast ? disablePast : false}
              className={
                isMobileView
                  ? styles.mobileDatePicker
                  : isReadOnly
                  ? "isReadOnly"
                  : ""
              }
              renderInput={(params) => (
                <div
                  className={`${isSuccess ? styles.success : styles.width} ${
                    isReadOnly ? styles.readOnlyColor : ""
                  }`}
                >
                  <CssTextField
                    id={"dateInput-" + id}
                    disabled={disableTyping}
                    onKeyDown={disableOnKeyDown}
                    sx={{
                      "& .MuiInputBase-input": disableTyping
                        ? {
                            caretColor: "transparent",
                          }
                        : {},
                      "& input":
                        variant == "arrow"
                          ? {
                              padding: "0 0 0 7.5px !important",
                              fontSize:
                                "var(--brand-font-size--small) !important",
                              fontWeight:
                                "var(--brand-font-weight-600) !important",
                              fontFamily:
                                "var(--brand-font-family-primary) !important",
                            }
                          : {
                              padding: "7.5px 12px !important",
                            },
                      ".MuiSvgIcon-root":
                        variant == "arrow" && isDisabled
                          ? {
                              backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9ImNhbGVuZGFyLTMgMiIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQ3NTFfMTg5KSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik00Ljk5OTk5IDdINC4zMzMzMkM0LjE1NjUxIDcgMy45ODY5NCA3LjA3MDI0IDMuODYxOTIgNy4xOTUyNkMzLjczNjg5IDcuMzIwMjkgMy42NjY2NiA3LjQ4OTg2IDMuNjY2NjYgNy42NjY2N0MzLjY2NjY2IDcuODQzNDggMy43MzY4OSA4LjAxMzA1IDMuODYxOTIgOC4xMzgwN0MzLjk4Njk0IDguMjYzMSA0LjE1NjUxIDguMzMzMzMgNC4zMzMzMiA4LjMzMzMzSDQuOTk5OTlDNS4xNzY4IDguMzMzMzMgNS4zNDYzNyA4LjI2MzEgNS40NzEzOSA4LjEzODA3QzUuNTk2NDIgOC4wMTMwNSA1LjY2NjY2IDcuODQzNDggNS42NjY2NiA3LjY2NjY3QzUuNjY2NjYgNy40ODk4NiA1LjU5NjQyIDcuMzIwMjkgNS40NzEzOSA3LjE5NTI2QzUuMzQ2MzcgNy4wNzAyNCA1LjE3NjggNyA0Ljk5OTk5IDdaIiBmaWxsPSIjNjI3Mzg2Ii8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTguMzMzMzMgN0g3LjY2NjY3QzcuNDg5ODYgNyA3LjMyMDI5IDcuMDcwMjQgNy4xOTUyNiA3LjE5NTI2QzcuMDcwMjQgNy4zMjAyOSA3IDcuNDg5ODYgNyA3LjY2NjY3QzcgNy44NDM0OCA3LjA3MDI0IDguMDEzMDUgNy4xOTUyNiA4LjEzODA3QzcuMzIwMjkgOC4yNjMxIDcuNDg5ODYgOC4zMzMzMyA3LjY2NjY3IDguMzMzMzNIOC4zMzMzM0M4LjUxMDE0IDguMzMzMzMgOC42Nzk3MSA4LjI2MzEgOC44MDQ3NCA4LjEzODA3QzguOTI5NzYgOC4wMTMwNSA5IDcuODQzNDggOSA3LjY2NjY3QzkgNy40ODk4NiA4LjkyOTc2IDcuMzIwMjkgOC44MDQ3NCA3LjE5NTI2QzguNjc5NzEgNy4wNzAyNCA4LjUxMDE0IDcgOC4zMzMzMyA3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzMiIGQ9Ik0xMS42NjY3IDdIMTFDMTAuODIzMiA3IDEwLjY1MzYgNy4wNzAyNCAxMC41Mjg2IDcuMTk1MjZDMTAuNDAzNiA3LjMyMDI5IDEwLjMzMzMgNy40ODk4NiAxMC4zMzMzIDcuNjY2NjdDMTAuMzMzMyA3Ljg0MzQ4IDEwLjQwMzYgOC4wMTMwNSAxMC41Mjg2IDguMTM4MDdDMTAuNjUzNiA4LjI2MzEgMTAuODIzMiA4LjMzMzMzIDExIDguMzMzMzNIMTEuNjY2N0MxMS44NDM1IDguMzMzMzMgMTIuMDEzMSA4LjI2MzEgMTIuMTM4MSA4LjEzODA3QzEyLjI2MzEgOC4wMTMwNSAxMi4zMzMzIDcuODQzNDggMTIuMzMzMyA3LjY2NjY3QzEyLjMzMzMgNy40ODk4NiAxMi4yNjMxIDcuMzIwMjkgMTIuMTM4MSA3LjE5NTI2QzEyLjAxMzEgNy4wNzAyNCAxMS44NDM1IDcgMTEuNjY2NyA3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzQiIGQ9Ik00Ljk5OTk5IDkuNjY2NjdINC4zMzMzMkM0LjE1NjUxIDkuNjY2NjcgMy45ODY5NCA5LjczNjkxIDMuODYxOTIgOS44NjE5M0MzLjczNjg5IDkuOTg2OTUgMy42NjY2NiAxMC4xNTY1IDMuNjY2NjYgMTAuMzMzM0MzLjY2NjY2IDEwLjUxMDEgMy43MzY4OSAxMC42Nzk3IDMuODYxOTIgMTAuODA0N0MzLjk4Njk0IDEwLjkyOTggNC4xNTY1MSAxMSA0LjMzMzMyIDExSDQuOTk5OTlDNS4xNzY4IDExIDUuMzQ2MzcgMTAuOTI5OCA1LjQ3MTM5IDEwLjgwNDdDNS41OTY0MiAxMC42Nzk3IDUuNjY2NjYgMTAuNTEwMSA1LjY2NjY2IDEwLjMzMzNDNS42NjY2NiAxMC4xNTY1IDUuNTk2NDIgOS45ODY5NSA1LjQ3MTM5IDkuODYxOTNDNS4zNDYzNyA5LjczNjkxIDUuMTc2OCA5LjY2NjY3IDQuOTk5OTkgOS42NjY2N1oiIGZpbGw9IiM2MjczODYiLz4KPHBhdGggaWQ9IlZlY3Rvcl81IiBkPSJNOC4zMzMzMyA5LjY2NjY3SDcuNjY2NjdDNy40ODk4NiA5LjY2NjY3IDcuMzIwMjkgOS43MzY5MSA3LjE5NTI2IDkuODYxOTNDNy4wNzAyNCA5Ljk4Njk1IDcgMTAuMTU2NSA3IDEwLjMzMzNDNyAxMC41MTAxIDcuMDcwMjQgMTAuNjc5NyA3LjE5NTI2IDEwLjgwNDdDNy4zMjAyOSAxMC45Mjk4IDcuNDg5ODYgMTEgNy42NjY2NyAxMUg4LjMzMzMzQzguNTEwMTQgMTEgOC42Nzk3MSAxMC45Mjk4IDguODA0NzQgMTAuODA0N0M4LjkyOTc2IDEwLjY3OTcgOSAxMC41MTAxIDkgMTAuMzMzM0M5IDEwLjE1NjUgOC45Mjk3NiA5Ljk4Njk1IDguODA0NzQgOS44NjE5M0M4LjY3OTcxIDkuNzM2OTEgOC41MTAxNCA5LjY2NjY3IDguMzMzMzMgOS42NjY2N1oiIGZpbGw9IiM2MjczODYiLz4KPHBhdGggaWQ9IlZlY3Rvcl82IiBkPSJNMTEuNjY2NyA5LjY2NjY3SDExQzEwLjgyMzIgOS42NjY2NyAxMC42NTM2IDkuNzM2OTEgMTAuNTI4NiA5Ljg2MTkzQzEwLjQwMzYgOS45ODY5NSAxMC4zMzMzIDEwLjE1NjUgMTAuMzMzMyAxMC4zMzMzQzEwLjMzMzMgMTAuNTEwMSAxMC40MDM2IDEwLjY3OTcgMTAuNTI4NiAxMC44MDQ3QzEwLjY1MzYgMTAuOTI5OCAxMC44MjMyIDExIDExIDExSDExLjY2NjdDMTEuODQzNSAxMSAxMi4wMTMxIDEwLjkyOTggMTIuMTM4MSAxMC44MDQ3QzEyLjI2MzEgMTAuNjc5NyAxMi4zMzMzIDEwLjUxMDEgMTIuMzMzMyAxMC4zMzMzQzEyLjMzMzMgMTAuMTU2NSAxMi4yNjMxIDkuOTg2OTUgMTIuMTM4MSA5Ljg2MTkzQzEyLjAxMzEgOS43MzY5MSAxMS44NDM1IDkuNjY2NjcgMTEuNjY2NyA5LjY2NjY3WiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzciIGQ9Ik00Ljk5OTk5IDEyLjMzMzNINC4zMzMzMkM0LjE1NjUxIDEyLjMzMzMgMy45ODY5NCAxMi40MDM2IDMuODYxOTIgMTIuNTI4NkMzLjczNjg5IDEyLjY1MzYgMy42NjY2NiAxMi44MjMyIDMuNjY2NjYgMTNDMy42NjY2NiAxMy4xNzY4IDMuNzM2ODkgMTMuMzQ2NCAzLjg2MTkyIDEzLjQ3MTRDMy45ODY5NCAxMy41OTY0IDQuMTU2NTEgMTMuNjY2NyA0LjMzMzMyIDEzLjY2NjdINC45OTk5OUM1LjE3NjggMTMuNjY2NyA1LjM0NjM3IDEzLjU5NjQgNS40NzEzOSAxMy40NzE0QzUuNTk2NDIgMTMuMzQ2NCA1LjY2NjY2IDEzLjE3NjggNS42NjY2NiAxM0M1LjY2NjY2IDEyLjgyMzIgNS41OTY0MiAxMi42NTM2IDUuNDcxMzkgMTIuNTI4NkM1LjM0NjM3IDEyLjQwMzYgNS4xNzY4IDEyLjMzMzMgNC45OTk5OSAxMi4zMzMzWiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzgiIGQ9Ik04LjMzMzMzIDEyLjMzMzNINy42NjY2N0M3LjQ4OTg2IDEyLjMzMzMgNy4zMjAyOSAxMi40MDM2IDcuMTk1MjYgMTIuNTI4NkM3LjA3MDI0IDEyLjY1MzYgNyAxMi44MjMyIDcgMTNDNyAxMy4xNzY4IDcuMDcwMjQgMTMuMzQ2NCA3LjE5NTI2IDEzLjQ3MTRDNy4zMjAyOSAxMy41OTY0IDcuNDg5ODYgMTMuNjY2NyA3LjY2NjY3IDEzLjY2NjdIOC4zMzMzM0M4LjUxMDE0IDEzLjY2NjcgOC42Nzk3MSAxMy41OTY0IDguODA0NzQgMTMuNDcxNEM4LjkyOTc2IDEzLjM0NjQgOSAxMy4xNzY4IDkgMTNDOSAxMi44MjMyIDguOTI5NzYgMTIuNjUzNiA4LjgwNDc0IDEyLjUyODZDOC42Nzk3MSAxMi40MDM2IDguNTEwMTQgMTIuMzMzMyA4LjMzMzMzIDEyLjMzMzNaIiBmaWxsPSIjNjI3Mzg2Ii8+CjxwYXRoIGlkPSJWZWN0b3JfOSIgZD0iTTExLjY2NjcgMTIuMzMzM0gxMUMxMC44MjMyIDEyLjMzMzMgMTAuNjUzNiAxMi40MDM2IDEwLjUyODYgMTIuNTI4NkMxMC40MDM2IDEyLjY1MzYgMTAuMzMzMyAxMi44MjMyIDEwLjMzMzMgMTNDMTAuMzMzMyAxMy4xNzY4IDEwLjQwMzYgMTMuMzQ2NCAxMC41Mjg2IDEzLjQ3MTRDMTAuNjUzNiAxMy41OTY0IDEwLjgyMzIgMTMuNjY2NyAxMSAxMy42NjY3SDExLjY2NjdDMTEuODQzNSAxMy42NjY3IDEyLjAxMzEgMTMuNTk2NCAxMi4xMzgxIDEzLjQ3MTRDMTIuMjYzMSAxMy4zNDY0IDEyLjMzMzMgMTMuMTc2OCAxMi4zMzMzIDEzQzEyLjMzMzMgMTIuODIzMiAxMi4yNjMxIDEyLjY1MzYgMTIuMTM4MSAxMi41Mjg2QzEyLjAxMzEgMTIuNDAzNiAxMS44NDM1IDEyLjMzMzMgMTEuNjY2NyAxMi4zMzMzWiIgZmlsbD0iIzYyNzM4NiIvPgo8cGF0aCBpZD0iVmVjdG9yXzEwIiBkPSJNMTQuMzMzMyAySDEyLjVDMTIuNDU1OCAyIDEyLjQxMzQgMS45ODI0NCAxMi4zODIyIDEuOTUxMThDMTIuMzUwOSAxLjkxOTkzIDEyLjMzMzMgMS44Nzc1NCAxMi4zMzMzIDEuODMzMzNWMC42NjY2NjdDMTIuMzMzMyAwLjQ4OTg1NiAxMi4yNjMxIDAuMzIwMjg2IDEyLjEzODEgMC4xOTUyNjJDMTIuMDEzMSAwLjA3MDIzNzkgMTEuODQzNSAwIDExLjY2NjcgMEMxMS40ODk5IDAgMTEuMzIwMyAwLjA3MDIzNzkgMTEuMTk1MyAwLjE5NTI2MkMxMS4wNzAyIDAuMzIwMjg2IDExIDAuNDg5ODU2IDExIDAuNjY2NjY3VjMuODMzMzNDMTEgMy45NjU5NCAxMC45NDczIDQuMDkzMTIgMTAuODUzNiA0LjE4Njg5QzEwLjc1OTggNC4yODA2NiAxMC42MzI2IDQuMzMzMzMgMTAuNSA0LjMzMzMzQzEwLjM2NzQgNC4zMzMzMyAxMC4yNDAyIDQuMjgwNjYgMTAuMTQ2NSA0LjE4Njg5QzEwLjA1MjcgNC4wOTMxMiAxMCAzLjk2NTk0IDEwIDMuODMzMzNWMi4zMzMzM0MxMCAyLjI0NDkzIDkuOTY0ODkgMi4xNjAxNCA5LjkwMjM4IDIuMDk3NjNDOS44Mzk4NyAyLjAzNTEyIDkuNzU1MDggMiA5LjY2NjY4IDJINS41MDAwMUM1LjQ1NTkyIDIgNS40MTM2MyAxLjk4MjUzIDUuMzgyMzkgMS45NTE0MkM1LjM1MTE2IDEuOTIwMzEgNS4zMzM1MiAxLjg3ODA5IDUuMzMzMzQgMS44MzRWMC42NjY2NjdDNS4zMzMzNCAwLjQ4OTg1NiA1LjI2MzExIDAuMzIwMjg2IDUuMTM4MDggMC4xOTUyNjJDNS4wMTMwNiAwLjA3MDIzNzkgNC44NDM0OSAwIDQuNjY2NjggMEM0LjQ4OTg3IDAgNC4zMjAzIDAuMDcwMjM3OSA0LjE5NTI3IDAuMTk1MjYyQzQuMDcwMjUgMC4zMjAyODYgNC4wMDAwMSAwLjQ4OTg1NiA0LjAwMDAxIDAuNjY2NjY3VjMuODMzMzNDNC4wMDAwMSAzLjk2NTk0IDMuOTQ3MzMgNC4wOTMxMiAzLjg1MzU2IDQuMTg2ODlDMy43NTk4IDQuMjgwNjYgMy42MzI2MiA0LjMzMzMzIDMuNTAwMDEgNC4zMzMzM0MzLjM2NzQgNC4zMzMzMyAzLjI0MDIyIDQuMjgwNjYgMy4xNDY0NiA0LjE4Njg5QzMuMDUyNjkgNC4wOTMxMiAzLjAwMDAxIDMuOTY1OTQgMy4wMDAwMSAzLjgzMzMzVjIuMzMzMzNDMy4wMDAwMSAyLjI0NDkzIDIuOTY0ODkgMi4xNjAxNCAyLjkwMjM4IDIuMDk3NjNDMi44Mzk4NyAyLjAzNTEyIDIuNzU1MDggMiAyLjY2NjY4IDJIMS42NjY2OEMxLjMxMzA1IDIgMC45NzM5MTYgMi4xNDA0OCAwLjcyMzg2OCAyLjM5MDUyQzAuNDczODE5IDIuNjQwNTcgMC4zMzMzNDQgMi45Nzk3MSAwLjMzMzM0NCAzLjMzMzMzVjE0LjY2NjdDMC4zMzMzNDQgMTUuMDIwMyAwLjQ3MzgxOSAxNS4zNTk0IDAuNzIzODY4IDE1LjYwOTVDMC45NzM5MTYgMTUuODU5NSAxLjMxMzA1IDE2IDEuNjY2NjggMTZIMTQuMzMzM0MxNC42ODcgMTYgMTUuMDI2MSAxNS44NTk1IDE1LjI3NjIgMTUuNjA5NUMxNS41MjYyIDE1LjM1OTQgMTUuNjY2NyAxNS4wMjAzIDE1LjY2NjcgMTQuNjY2N1YzLjMzMzMzQzE1LjY2NjcgMi45Nzk3MSAxNS41MjYyIDIuNjQwNTcgMTUuMjc2MiAyLjM5MDUyQzE1LjAyNjEgMi4xNDA0OCAxNC42ODcgMiAxNC4zMzMzIDJaTTE0LjMzMzMgMTQuMzMzM0MxNC4zMzMzIDE0LjQyMTcgMTQuMjk4MiAxNC41MDY1IDE0LjIzNTcgMTQuNTY5QzE0LjE3MzIgMTQuNjMxNSAxNC4wODg0IDE0LjY2NjcgMTQgMTQuNjY2N0gyLjAwMDAxQzEuOTExNiAxNC42NjY3IDEuODI2ODIgMTQuNjMxNSAxLjc2NDMxIDE0LjU2OUMxLjcwMTggMTQuNTA2NSAxLjY2NjY4IDE0LjQyMTcgMS42NjY2OCAxNC4zMzMzVjYuMzMzMzNDMS42NjY2OCA2LjI0NDkzIDEuNzAxOCA2LjE2MDE0IDEuNzY0MzEgNi4wOTc2M0MxLjgyNjgyIDYuMDM1MTIgMS45MTE2IDYgMi4wMDAwMSA2SDE0QzE0LjA4ODQgNiAxNC4xNzMyIDYuMDM1MTIgMTQuMjM1NyA2LjA5NzYzQzE0LjI5ODIgNi4xNjAxNCAxNC4zMzMzIDYuMjQ0OTMgMTQuMzMzMyA2LjMzMzMzVjE0LjMzMzNaIiBmaWxsPSIjNjI3Mzg2Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNDc1MV8xODkiPgo8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==) !important`,
                            }
                          : {},
                      "& fieldset":
                        variant == "arrow" && isDisabled
                          ? {
                              borderColor:
                                "var(--brand-color-grey-scale-cool-3) !important",
                            }
                          : {},
                      ".MuiInputAdornment-root": {
                        margin: "3px 0 0 0 !important",
                      },
                      "input::placeholder": {
                        color:
                          variant == "arrow"
                            ? isDisabled
                              ? "var(--brand-color-text-light-slate)"
                              : "var(---brand-color-text-black)"
                            : "",
                        opacity: hidePlaceHolder ? 0 : "",
                        visibility: hidePlaceHolder ? "hidden" : "",
                        pointerEvents: hidePlaceHolder ? "none" : "",
                      },
                    }}
                    autoComplete={disableAutosuggestion ? "off" : "on"}
                    aria-invalid={isInvalid}
                    data-testid={"dateInput-testid-" + id}
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      type: "text", // Ensuring the type is set to 'text'
                      "aria-describedby": getAriaDescribedBy(),
                    }}
                    onBlur={onBlur}
                    style={{
                      width: "100%",
                    }}
                    error={isInvalid}
                  />
                </div>
              )}
              // onError={(e) => console.log(e)}
            />
            {variant == "arrow" && (
              <button
                data-testid={"dateInput-rightArrow-" + id}
                disabled={isDisabled || isRightArrowDisabled}
                className={`${styles.arrowButton} ${styles.rightArrow} ${
                  !(isDisabled || isRightArrowDisabled)
                    ? styles.enabledArrow
                    : ""
                }`}
                onClick={() => onClickRightArrow()}
              >
                {isDisabled || isRightArrowDisabled ? (
                  <ArrowRightDisabled />
                ) : (
                  <ArrowRight />
                )}
              </button>
            )}
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      {isInvalid && (
        <TextError errorMessage={helperMessage} showErrorIcon id={id} />
      )}
      {isSuccess && (
        <p
          data-testid={"success-testid-" + id}
          id={"success" + id}
          className={`${styles.successText}`}
        >
          <svg
            className={styles.iconMargin}
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5828 0.187287C15.3672 0.0327637 15.0991 -0.029814 14.8375 0.0133188C14.5758 0.0564517 14.342 0.201762 14.1874 0.417287L4.83075 13.4626L1.70742 10.3366C1.61457 10.2437 1.50434 10.17 1.38302 10.1198C1.26169 10.0695 1.13165 10.0436 1.00032 10.0435C0.868987 10.0435 0.738934 10.0693 0.617587 10.1196C0.496239 10.1698 0.385973 10.2434 0.293085 10.3363C0.200196 10.4291 0.126505 10.5394 0.0762171 10.6607C0.0259296 10.782 3.09789e-05 10.9121 2.77749e-08 11.0434C-3.09234e-05 11.1747 0.0258064 11.3048 0.0760368 11.4261C0.126267 11.5475 0.199907 11.6577 0.292751 11.7506L4.24942 15.7066C4.3533 15.8066 4.47725 15.8833 4.61304 15.9317C4.74884 15.9801 4.89337 15.9991 5.03706 15.9873C5.18074 15.9756 5.32029 15.9335 5.44644 15.8637C5.57259 15.7939 5.68246 15.6981 5.76875 15.5826L15.8128 1.58262C15.9673 1.36708 16.0299 1.09899 15.9867 0.837322C15.9436 0.575649 15.7983 0.341826 15.5828 0.187287Z"
              fill="#48A463"
            />
          </svg>
          {helperMessage}
        </p>
      )}
    </div>
  );
};

CustomDatepicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isInvalid: PropTypes.bool,
  helperMessage: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeFn: PropTypes.func,
  pickerFormat: PropTypes.string,
  views: PropTypes.array,
  isMobileView: PropTypes.bool,
  isSuccess: PropTypes.bool,
  clearDate: PropTypes.bool,
  disableAutosuggestion: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableDateTill: PropTypes.string,
  onBlur: PropTypes.func,
  disableTyping: PropTypes.bool,
  isShowLabel: PropTypes.bool,
  requiredLabel: PropTypes.string,
  variant: PropTypes.string,
  onClickLeftArrow: PropTypes.func,
  onClickRightArrow: PropTypes.func,
  isLeftArrowDisabled: PropTypes.bool,
  isRightArrowDisabled: PropTypes.bool,
  helperText: PropTypes.string,
  labelTemplate: PropTypes.string,
  hidePlaceHolder: PropTypes.bool,
  showRequiredIcon: PropTypes.bool,
};

CustomDatepicker.defaultProps = {
  placeholder: "",
  label: "",
  isRequired: false,
  isInvalid: false,
  helperMessage: "",
  pickerFormat: "MM/DD/YYYY",
  views: ["year", "month", "day"],
  isMobileView: false,
  onBlur: () => {},
  clearDate: false,
  disableFuture: false,
  disablePast: false,
  disableDateTill: "",
  disableAutosuggestion: false,
  disableTyping: false,
  isShowLabel: true,
  requiredLabel: "",
  variant: "primary",
  helperText: "",
  labelTemplate: "default",
  hidePlaceHolder: false,
  showRequiredIcon: true
};
