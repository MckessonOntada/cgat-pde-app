/**
 * This component has been imported from the MCP Component Library
 * and modified to not sort selected values in the dropdown.
 * Once the feature is available in the library this can be removed
 */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './assets/styles/SearchableDropdown.module.scss';
import { Button, Tooltip, Label, Required, TextError } from '@mckesson/mcp-component-library';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

import { ReactComponent as InfoIcon } from '../../assets/svg/info.svg';
import { ReactComponent as NoResult } from './assets/svg/NoResult_copy.svg';

import CommonUtils from '../../common/util/CommonUtils';

import TooltipText from '../../common/hooks/useTooltipText';

const CssTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: '2.6rem',
    backgroundImage: `url(
      data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS44Mjk5IDEwLjY4NjlMMTYuMTgyNiAxNS4wMzk2QzE2LjUwNzggMTUuMzY1MiAxNi41MDc4IDE1Ljg5MjYgMTYuMTgyNiAxNi4yMTgzQzE1Ljg1NDggMTYuNTM4IDE1LjMzMTggMTYuNTM4IDE1LjAwMzkgMTYuMjE4M0wxMC42NTEzIDExLjg2NTZDOC4wNTk3NSAxMy44MzcgNC4zODM4OSAxMy40NjM0IDIuMjQyMDcgMTEuMDEwOEMwLjEwMDI0MiA4LjU1ODIyIDAuMjI0OTgxIDQuODY1NTMgMi41Mjc0MyAyLjU2MzA4QzQuODI5ODggMC4yNjA2MjYgOC41MjI1OCAwLjEzNTg4NyAxMC45NzUyIDIuMjc3NzFDMTMuNDI3NyA0LjQxOTU0IDEzLjgwMTQgOC4wOTU0IDExLjgyOTkgMTAuNjg2OVpNNi45MjY2MSAyLjQ2MDI1QzQuNDQxMzMgMi40NjAyNSAyLjQyNjYxIDQuNDc0OTcgMi40MjY2MSA2Ljk2MDI1QzIuNDI5NTUgOS40NDQzMiA0LjQ0MjU1IDExLjQ1NzMgNi45MjY2MSAxMS40NjAzQzkuNDExODkgMTEuNDYwMyAxMS40MjY2IDkuNDQ1NTQgMTEuNDI2NiA2Ljk2MDI1QzExLjQyNjYgNC40NzQ5NyA5LjQxMTg5IDIuNDYwMjUgNi45MjY2MSAyLjQ2MDI1WiIgZmlsbD0iIzYyNzM4NiIvPgo8L3N2Zz4K
      )`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top 5px left 8px',
    paddingRight: '12px',

    '& :focus-visible': {
      outline: 'none !important'
    },
    '&.Mui-disabled': {
      background: 'var(--brand-color-cool-blue)'
    },
    '& .Mui-disabled fieldset': {
      border: 'none'
    },
    '& fieldset': {
      borderRadius: '0.6rem',
      borderWidth: '0.1rem',
      borderStyle: 'solid',
      borderColor: 'var(--brand-color-primary-background)'
    },
    '&.Mui-focused fieldset': {
      borderRadius: '0.6rem',
      borderWidth: '0.1rem',
      borderStyle: 'solid',
      borderColor: 'var(--brand-color-secondary-active-yellow-1)'
    },
    '& input': {
      appearance: 'none',
      fontSize: 'var(--brand-font-size--extra-small)',
      lineHeight: 'var(--brand-line-height--medium)',
      letterSpacing: '-0.001em',
      fontWeight: 'var(--brand-font-weight-600)',
      color: 'var(--brand-color-black)',
      padding: '0px 0px 0px 32px'
    },
    '& button': {
      padding: '5px 8px'
    },
    '& input:-internal-autofill-selected': {
      backgroundColor: 'transparent !important'
    },
    '& input:-webkit-autofill': {
      backgroundColor: 'transparent !important'
    },
    '& .MuiSvgIcon-root': {
      width: '19.17px',
      height: '20px',
      color: 'var(--brand-color-black)',
      backgroundImage: `url(
        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xNzMzNl8xMjY5MykiPg0KPHBhdGggZD0iTTYuMjUwMTYgOS4yMTA0NUg1LjQxNjgzQzUuMTk1ODIgOS4yMTA0NSA0Ljk4Mzg1IDkuMjk4MjUgNC44Mjc1NyA5LjQ1NDUzQzQuNjcxMjkgOS42MTA4MSA0LjU4MzUgOS44MjI3NyA0LjU4MzUgMTAuMDQzOEM0LjU4MzUgMTAuMjY0OCA0LjY3MTI5IDEwLjQ3NjggNC44Mjc1NyAxMC42MzNDNC45ODM4NSAxMC43ODkzIDUuMTk1ODIgMTAuODc3MSA1LjQxNjgzIDEwLjg3NzFINi4yNTAxNkM2LjQ3MTE4IDEwLjg3NzEgNi42ODMxNCAxMC43ODkzIDYuODM5NDIgMTAuNjMzQzYuOTk1NyAxMC40NzY4IDcuMDgzNSAxMC4yNjQ4IDcuMDgzNSAxMC4wNDM4QzcuMDgzNSA5LjgyMjc3IDYuOTk1NyA5LjYxMDgxIDYuODM5NDIgOS40NTQ1M0M2LjY4MzE0IDkuMjk4MjUgNi40NzExOCA5LjIxMDQ1IDYuMjUwMTYgOS4yMTA0NVoiIGZpbGw9IiMxRTM5NEUiLz4NCjxwYXRoIGQ9Ik0xMC40MTY3IDkuMjEwNDVIOS41ODMzM0M5LjM2MjMyIDkuMjEwNDUgOS4xNTAzNiA5LjI5ODI1IDguOTk0MDggOS40NTQ1M0M4LjgzNzggOS42MTA4MSA4Ljc1IDkuODIyNzcgOC43NSAxMC4wNDM4QzguNzUgMTAuMjY0OCA4LjgzNzggMTAuNDc2OCA4Ljk5NDA4IDEwLjYzM0M5LjE1MDM2IDEwLjc4OTMgOS4zNjIzMiAxMC44NzcxIDkuNTgzMzMgMTAuODc3MUgxMC40MTY3QzEwLjYzNzcgMTAuODc3MSAxMC44NDk2IDEwLjc4OTMgMTEuMDA1OSAxMC42MzNDMTEuMTYyMiAxMC40NzY4IDExLjI1IDEwLjI2NDggMTEuMjUgMTAuMDQzOEMxMS4yNSA5LjgyMjc3IDExLjE2MjIgOS42MTA4MSAxMS4wMDU5IDkuNDU0NTNDMTAuODQ5NiA5LjI5ODI1IDEwLjYzNzcgOS4yMTA0NSAxMC40MTY3IDkuMjEwNDVaIiBmaWxsPSIjMUUzOTRFIi8+DQo8cGF0aCBkPSJNMTQuNTgzMiA5LjIxMDQ1SDEzLjc0OThDMTMuNTI4OCA5LjIxMDQ1IDEzLjMxNjkgOS4yOTgyNSAxMy4xNjA2IDkuNDU0NTNDMTMuMDA0MyA5LjYxMDgxIDEyLjkxNjUgOS44MjI3NyAxMi45MTY1IDEwLjA0MzhDMTIuOTE2NSAxMC4yNjQ4IDEzLjAwNDMgMTAuNDc2OCAxMy4xNjA2IDEwLjYzM0MxMy4zMTY5IDEwLjc4OTMgMTMuNTI4OCAxMC44NzcxIDEzLjc0OTggMTAuODc3MUgxNC41ODMyQzE0LjgwNDIgMTAuODc3MSAxNS4wMTYxIDEwLjc4OTMgMTUuMTcyNCAxMC42MzNDMTUuMzI4NyAxMC40NzY4IDE1LjQxNjUgMTAuMjY0OCAxNS40MTY1IDEwLjA0MzhDMTUuNDE2NSA5LjgyMjc3IDE1LjMyODcgOS42MTA4MSAxNS4xNzI0IDkuNDU0NTNDMTUuMDE2MSA5LjI5ODI1IDE0LjgwNDIgOS4yMTA0NSAxNC41ODMyIDkuMjEwNDVaIiBmaWxsPSIjMUUzOTRFIi8+DQo8cGF0aCBkPSJNNi4yNTAxNiAxMi41NDM5SDUuNDE2ODNDNS4xOTU4MiAxMi41NDM5IDQuOTgzODUgMTIuNjMxNyA0LjgyNzU3IDEyLjc4OEM0LjY3MTI5IDEyLjk0NDMgNC41ODM1IDEzLjE1NjMgNC41ODM1IDEzLjM3NzNDNC41ODM1IDEzLjU5ODMgNC42NzEyOSAxMy44MTAzIDQuODI3NTcgMTMuOTY2NUM0Ljk4Mzg1IDE0LjEyMjggNS4xOTU4MiAxNC4yMTA2IDUuNDE2ODMgMTQuMjEwNkg2LjI1MDE2QzYuNDcxMTggMTQuMjEwNiA2LjY4MzE0IDE0LjEyMjggNi44Mzk0MiAxMy45NjY1QzYuOTk1NyAxMy44MTAzIDcuMDgzNSAxMy41OTgzIDcuMDgzNSAxMy4zNzczQzcuMDgzNSAxMy4xNTYzIDYuOTk1NyAxMi45NDQzIDYuODM5NDIgMTIuNzg4QzYuNjgzMTQgMTIuNjMxNyA2LjQ3MTE4IDEyLjU0MzkgNi4yNTAxNiAxMi41NDM5WiIgZmlsbD0iIzFFMzk0RSIvPg0KPHBhdGggZD0iTTEwLjQxNjcgMTIuNTQzOUg5LjU4MzMzQzkuMzYyMzIgMTIuNTQzOSA5LjE1MDM2IDEyLjYzMTcgOC45OTQwOCAxMi43ODhDOC44Mzc4IDEyLjk0NDMgOC43NSAxMy4xNTYzIDguNzUgMTMuMzc3M0M4Ljc1IDEzLjU5ODMgOC44Mzc4IDEzLjgxMDMgOC45OTQwOCAxMy45NjY1QzkuMTUwMzYgMTQuMTIyOCA5LjM2MjMyIDE0LjIxMDYgOS41ODMzMyAxNC4yMTA2SDEwLjQxNjdDMTAuNjM3NyAxNC4yMTA2IDEwLjg0OTYgMTQuMTIyOCAxMS4wMDU5IDEzLjk2NjVDMTEuMTYyMiAxMy44MTAzIDExLjI1IDEzLjU5ODMgMTEuMjUgMTMuMzc3M0MxMS4yNSAxMy4xNTYzIDExLjE2MjIgMTIuOTQ0MyAxMS4wMDU5IDEyLjc4OEMxMC44NDk2IDEyLjYzMTcgMTAuNjM3NyAxMi41NDM5IDEwLjQxNjcgMTIuNTQzOVoiIGZpbGw9IiMxRTM5NEUiLz4NCjxwYXRoIGQ9Ik0xNC41ODMyIDEyLjU0MzlIMTMuNzQ5OEMxMy41Mjg4IDEyLjU0MzkgMTMuMzE2OSAxMi42MzE3IDEzLjE2MDYgMTIuNzg4QzEzLjAwNDMgMTIuOTQ0MyAxMi45MTY1IDEzLjE1NjMgMTIuOTE2NSAxMy4zNzczQzEyLjkxNjUgMTMuNTk4MyAxMy4wMDQzIDEzLjgxMDMgMTMuMTYwNiAxMy45NjY1QzEzLjMxNjkgMTQuMTIyOCAxMy41Mjg4IDE0LjIxMDYgMTMuNzQ5OCAxNC4yMTA2SDE0LjU4MzJDMTQuODA0MiAxNC4yMTA2IDE1LjAxNjEgMTQuMTIyOCAxNS4xNzI0IDEzLjk2NjVDMTUuMzI4NyAxMy44MTAzIDE1LjQxNjUgMTMuNTk4MyAxNS40MTY1IDEzLjM3NzNDMTUuNDE2NSAxMy4xNTYzIDE1LjMyODcgMTIuOTQ0MyAxNS4xNzI0IDEyLjc4OEMxNS4wMTYxIDEyLjYzMTcgMTQuODA0MiAxMi41NDM5IDE0LjU4MzIgMTIuNTQzOVoiIGZpbGw9IiMxRTM5NEUiLz4NCjxwYXRoIGQ9Ik02LjI1MDE2IDE1Ljg3N0g1LjQxNjgzQzUuMTk1ODIgMTUuODc3IDQuOTgzODUgMTUuOTY0NyA0LjgyNzU3IDE2LjEyMUM0LjY3MTI5IDE2LjI3NzMgNC41ODM1IDE2LjQ4OTMgNC41ODM1IDE2LjcxMDNDNC41ODM1IDE2LjkzMTMgNC42NzEyOSAxNy4xNDMzIDQuODI3NTcgMTcuMjk5NUM0Ljk4Mzg1IDE3LjQ1NTggNS4xOTU4MiAxNy41NDM2IDUuNDE2ODMgMTcuNTQzNkg2LjI1MDE2QzYuNDcxMTggMTcuNTQzNiA2LjY4MzE0IDE3LjQ1NTggNi44Mzk0MiAxNy4yOTk1QzYuOTk1NyAxNy4xNDMzIDcuMDgzNSAxNi45MzEzIDcuMDgzNSAxNi43MTAzQzcuMDgzNSAxNi40ODkzIDYuOTk1NyAxNi4yNzczIDYuODM5NDIgMTYuMTIxQzYuNjgzMTQgMTUuOTY0NyA2LjQ3MTE4IDE1Ljg3NyA2LjI1MDE2IDE1Ljg3N1oiIGZpbGw9IiMxRTM5NEUiLz4NCjxwYXRoIGQ9Ik0xMC40MTY3IDE1Ljg3N0g5LjU4MzMzQzkuMzYyMzIgMTUuODc3IDkuMTUwMzYgMTUuOTY0NyA4Ljk5NDA4IDE2LjEyMUM4LjgzNzggMTYuMjc3MyA4Ljc1IDE2LjQ4OTMgOC43NSAxNi43MTAzQzguNzUgMTYuOTMxMyA4LjgzNzggMTcuMTQzMyA4Ljk5NDA4IDE3LjI5OTVDOS4xNTAzNiAxNy40NTU4IDkuMzYyMzIgMTcuNTQzNiA5LjU4MzMzIDE3LjU0MzZIMTAuNDE2N0MxMC42Mzc3IDE3LjU0MzYgMTAuODQ5NiAxNy40NTU4IDExLjAwNTkgMTcuMjk5NUMxMS4xNjIyIDE3LjE0MzMgMTEuMjUgMTYuOTMxMyAxMS4yNSAxNi43MTAzQzExLjI1IDE2LjQ4OTMgMTEuMTYyMiAxNi4yNzczIDExLjAwNTkgMTYuMTIxQzEwLjg0OTYgMTUuOTY0NyAxMC42Mzc3IDE1Ljg3NyAxMC40MTY3IDE1Ljg3N1oiIGZpbGw9IiMxRTM5NEUiLz4NCjxwYXRoIGQ9Ik0xNC41ODMyIDE1Ljg3N0gxMy43NDk4QzEzLjUyODggMTUuODc3IDEzLjMxNjkgMTUuOTY0NyAxMy4xNjA2IDE2LjEyMUMxMy4wMDQzIDE2LjI3NzMgMTIuOTE2NSAxNi40ODkzIDEyLjkxNjUgMTYuNzEwM0MxMi45MTY1IDE2LjkzMTMgMTMuMDA0MyAxNy4xNDMzIDEzLjE2MDYgMTcuMjk5NUMxMy4zMTY5IDE3LjQ1NTggMTMuNTI4OCAxNy41NDM2IDEzLjc0OTggMTcuNTQzNkgxNC41ODMyQzE0LjgwNDIgMTcuNTQzNiAxNS4wMTYxIDE3LjQ1NTggMTUuMTcyNCAxNy4yOTk1QzE1LjMyODcgMTcuMTQzMyAxNS40MTY1IDE2LjkzMTMgMTUuNDE2NSAxNi43MTAzQzE1LjQxNjUgMTYuNDg5MyAxNS4zMjg3IDE2LjI3NzMgMTUuMTcyNCAxNi4xMjFDMTUuMDE2MSAxNS45NjQ3IDE0LjgwNDIgMTUuODc3IDE0LjU4MzIgMTUuODc3WiIgZmlsbD0iIzFFMzk0RSIvPg0KPHBhdGggZD0iTTE3LjkxNjUgMi45NjA0NUgxNS42MjQ4QzE1LjU2OTYgMi45NjA0NSAxNS41MTY2IDIuOTM4NSAxNS40Nzc1IDIuODk5NDNDMTUuNDM4NSAyLjg2MDM2IDE1LjQxNjUgMi44MDczNyAxNS40MTY1IDIuNzUyMTJWMS4yOTM3OEMxNS40MTY1IDEuMDcyNzcgMTUuMzI4NyAwLjg2MDgwNyAxNS4xNzI0IDAuNzA0NTI3QzE1LjAxNjEgMC41NDgyNDcgMTQuODA0MiAwLjQ2MDQ0OSAxNC41ODMyIDAuNDYwNDQ5QzE0LjM2MjIgMC40NjA0NDkgMTQuMTUwMiAwLjU0ODI0NyAxMy45OTM5IDAuNzA0NTI3QzEzLjgzNzYgMC44NjA4MDcgMTMuNzQ5OCAxLjA3Mjc3IDEzLjc0OTggMS4yOTM3OFY1LjI1MjEyQzEzLjc0OTggNS40MTc4OCAxMy42ODQgNS41NzY4NSAxMy41NjY4IDUuNjk0MDZDMTMuNDQ5NiA1LjgxMTI3IDEzLjI5MDYgNS44NzcxMiAxMy4xMjQ4IDUuODc3MTJDMTIuOTU5MSA1Ljg3NzEyIDEyLjgwMDEgNS44MTEyNyAxMi42ODI5IDUuNjk0MDZDMTIuNTY1NyA1LjU3Njg1IDEyLjQ5OTggNS40MTc4OCAxMi40OTk4IDUuMjUyMTJWMy4zNzcxMkMxMi40OTk4IDMuMjY2NjEgMTIuNDU1OSAzLjE2MDYzIDEyLjM3NzggMy4wODI0OUMxMi4yOTk3IDMuMDA0MzUgMTIuMTkzNyAyLjk2MDQ1IDEyLjA4MzIgMi45NjA0NUg2Ljg3NDg0QzYuODE5NzMgMi45NjA0NSA2Ljc2Njg2IDIuOTM4NjEgNi43Mjc4MiAyLjg5OTcyQzYuNjg4NzcgMi44NjA4MyA2LjY2NjcyIDIuODA4MDYgNi42NjY1IDIuNzUyOTVWMS4yOTM3OEM2LjY2NjUgMS4wNzI3NyA2LjU3ODcxIDAuODYwODA3IDYuNDIyNDMgMC43MDQ1MjdDNi4yNjYxNSAwLjU0ODI0NyA2LjA1NDE4IDAuNDYwNDQ5IDUuODMzMTcgMC40NjA0NDlDNS42MTIxNiAwLjQ2MDQ0OSA1LjQwMDIgMC41NDgyNDcgNS4yNDM5MiAwLjcwNDUyN0M1LjA4NzYzIDAuODYwODA3IDQuOTk5ODQgMS4wNzI3NyA0Ljk5OTg0IDEuMjkzNzhWNS4yNTIxMkM0Ljk5OTg0IDUuNDE3ODggNC45MzM5OSA1LjU3Njg1IDQuODE2NzggNS42OTQwNkM0LjY5OTU3IDUuODExMjcgNC41NDA2IDUuODc3MTIgNC4zNzQ4NCA1Ljg3NzEyQzQuMjA5MDggNS44NzcxMiA0LjA1MDExIDUuODExMjcgMy45MzI5IDUuNjk0MDZDMy44MTU2OSA1LjU3Njg1IDMuNzQ5ODQgNS40MTc4OCAzLjc0OTg0IDUuMjUyMTJWMy4zNzcxMkMzLjc0OTg0IDMuMjY2NjEgMy43MDU5NCAzLjE2MDYzIDMuNjI3OCAzLjA4MjQ5QzMuNTQ5NjYgMy4wMDQzNSAzLjQ0MzY4IDIuOTYwNDUgMy4zMzMxNyAyLjk2MDQ1SDIuMDgzMTdDMS42NDExNCAyLjk2MDQ1IDEuMjE3MjIgMy4xMzYwNCAwLjkwNDY1OSAzLjQ0ODZDMC41OTIwOTkgMy43NjExNyAwLjQxNjUwNCA0LjE4NTA5IDAuNDE2NTA0IDQuNjI3MTJWMTguNzkzOEMwLjQxNjUwNCAxOS4yMzU4IDAuNTkyMDk5IDE5LjY1OTcgMC45MDQ2NTkgMTkuOTcyM0MxLjIxNzIyIDIwLjI4NDkgMS42NDExNCAyMC40NjA0IDIuMDgzMTcgMjAuNDYwNEgxNy45MTY1QzE4LjM1ODUgMjAuNDYwNCAxOC43ODI1IDIwLjI4NDkgMTkuMDk1IDE5Ljk3MjNDMTkuNDA3NiAxOS42NTk3IDE5LjU4MzIgMTkuMjM1OCAxOS41ODMyIDE4Ljc5MzhWNC42MjcxMkMxOS41ODMyIDQuMTg1MDkgMTkuNDA3NiAzLjc2MTE3IDE5LjA5NSAzLjQ0ODZDMTguNzgyNSAzLjEzNjA0IDE4LjM1ODUgMi45NjA0NSAxNy45MTY1IDIuOTYwNDVaTTE3LjkxNjUgMTguMzc3MUMxNy45MTY1IDE4LjQ4NzYgMTcuODcyNiAxOC41OTM2IDE3Ljc5NDUgMTguNjcxN0MxNy43MTYzIDE4Ljc0OTkgMTcuNjEwMyAxOC43OTM4IDE3LjQ5OTggMTguNzkzOEgyLjQ5OTg0QzIuMzg5MzMgMTguNzkzOCAyLjI4MzM1IDE4Ljc0OTkgMi4yMDUyMSAxOC42NzE3QzIuMTI3MDcgMTguNTkzNiAyLjA4MzE3IDE4LjQ4NzYgMi4wODMxNyAxOC4zNzcxVjguMzc3MTJDMi4wODMxNyA4LjI2NjYxIDIuMTI3MDcgOC4xNjA2MyAyLjIwNTIxIDguMDgyNDlDMi4yODMzNSA4LjAwNDM1IDIuMzg5MzMgNy45NjA0NSAyLjQ5OTg0IDcuOTYwNDVIMTcuNDk5OEMxNy42MTAzIDcuOTYwNDUgMTcuNzE2MyA4LjAwNDM1IDE3Ljc5NDUgOC4wODI0OUMxNy44NzI2IDguMTYwNjMgMTcuOTE2NSA4LjI2NjYxIDE3LjkxNjUgOC4zNzcxMlYxOC4zNzcxWiIgZmlsbD0iIzFFMzk0RSIvPg0KPC9nPg0KPGRlZnM+DQo8Y2xpcFBhdGggaWQ9ImNsaXAwXzE3MzM2XzEyNjkzIj4NCjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMC40NjA0NDkpIi8+DQo8L2NsaXBQYXRoPg0KPC9kZWZzPg0KPC9zdmc+DQo=
        )`,
      backgroundRepeat: 'no-repeat'
    },
    '& .MuiSvgIcon-root path': {
      display: 'none'
    }
  },
  '& .Mui-error ': {
    '& input': {
      appearance: 'none',
      fontSize: 'var(--brand-font-size--default)',
      lineHeight: 'var(--brand-line-height--m-large)',
      letterSpacing: '-0.001em',
      fontWeight: 'var(--brand-font-weight-400)',
      color: 'var(--brand-color-warning-orange-4) !important'
    },
    '& .MuiSvgIcon-root': {
      width: '19.17px',
      height: '20px',
      color: 'var(--brand-color-warning-orange-4) !important'
    }
  }
});

const variantType = {
  DEFAULT: 'default',
  ASYNC: 'async'
};

export const SearchableDropdown = (props) => {
  const refDropdown = useRef(null);
  const listDropdown = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const [storedOptions, setStoredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [nonSelectedOptions, setNonSelectedOptions] = useState([]);
  const [localSelectedOptions, setLocalSelectedOptions] = useState([]);
  const [localNonSelectedOptions, setLocalNonSelectedOptions] = useState([]);
  const [searchString, setSearchString] = useState(null);
  const [isEmptyOptions, setIsEmptyOptions] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isRefineFilter, setIsRefineFilter] = useState(false);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [isShowClearSelection, setIsShowClearSelection] = useState(false);
  const [isFilterOptions, setIsFilterOptions] = useState(false);
  const [displayValue, setDisplayValue] = useState(null);
  const [isAsyncEnableHandle, setIsAsyncEnableHandle] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(false);
  const [disableOption, setDisabledOption] = useState(false);
  const [selectAll, setSelectAll] = useState({
    label: 'Select All',
    value: -1,
    isChecked: false,
    indeterminate: false
  });
  const {
    id,
    isMultiSelect,
    width,
    label,
    onChange,
    options,
    isRequired,
    placeholder,
    searchPlaceholder,
    showRequiredLabel,
    size,
    errorMessage,
    error,
    isSuccess,
    isClearable,
    clearFilterLabel,
    refineFilterMessage,
    isDisabled,
    value,
    isActionable,
    menuActionIcon,
    menuActionClick,
    isShowNone,
    isSortEnable,
    clearAllSelectedValues,
    recordsCountToEnableSearch,
    maxRecordsCountToShow,
    variant,
    asyncHandleSearch,
    asyncRecordsFound,
    isSelectedShiftDisable,
    isEndLabel,
    valueToMoveToLast,
    valueToMoveToTop,
    optionContainerHeight,
    optionContainerWidth,
    defaultSelectedLabel,
    emptyOptionMessage,
    isReadOnly,
    eregVariant,
    style,
    tooltipText,
    noSelectedCountMessage,
    maxSelectableOptions,
    showClear,
    fieldDisplayValue,
    isShowSelectAll,
    isModalDropdown,
    multiSelectDefaultLabel,
    isCustomVariant
  } = props;

  useEffect(() => {
    if (fieldDisplayValue !== undefined) {
      setDisplayValue(fieldDisplayValue);
    }
  }, [fieldDisplayValue]);

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    if (variant === variantType.ASYNC) {
      if (Array.isArray(options)) {
        if (options.length > recordsCountToEnableSearch) {
          setIsSearchEnable(true);
        }
        // setIsSearchEnable;
        setStoredOptions(getSortedOptions(options, valueToMoveToLast, valueToMoveToTop));
        setIsFilterOptions(true);
      }
    } else {
      if (CommonUtils.isNonEmptyArray(options)) {
        if (options.length > recordsCountToEnableSearch) {
          setIsSearchEnable(true);
        }
        // setIsSearchEnable;
        setStoredOptions(getSortedOptions(options, valueToMoveToLast, valueToMoveToTop));
        setIsFilterOptions(true);
      }
    }
  }, []);

  useEffect(() => {
    if (variant === variantType.ASYNC) {
      if (Array.isArray(options)) {
        if (options.length > recordsCountToEnableSearch) {
          setIsSearchEnable(true);
        }
        if (!searchString) {
          setStoredOptions(getSortedOptions(options, valueToMoveToLast, valueToMoveToTop));
        } else {
          setStoredOptions(options);
        }
        setIsFilterOptions(true);
        let selectedOpt = options.filter((e) => e.isChecked);
        let noSelect = options.filter((e) => !e.isChecked);
        if (selectedOpt.length == 0 || isShowSelectAll) {
          setIsShowClearSelection(false);
        } else {
          setIsShowClearSelection(true);
        }
        setSelectedOptions(selectedOpt);
        setNonSelectedOptions(noSelect);
        setLocalSelectedOptions([...selectedOpt]);
        setLocalNonSelectedOptions([...noSelect]);
      }
    } else {
      if (
        CommonUtils.isNonEmptyArray(options) &&
        (!eregVariant || (eregVariant && searchString?.length == 0))
      ) {
        if (options.length > recordsCountToEnableSearch) {
          setIsSearchEnable(true);
        }
        toggleSelectedAll(options);
        let selectedOpt = [];
        let noSelect = [];
        setStoredOptions(getSortedOptions(options, valueToMoveToLast, valueToMoveToTop));
        setIsFilterOptions(true);
        if (isSelectedShiftDisable || options.length <= 10) {
          selectedOpt = options;
        } else {
          selectedOpt = options.filter((e) => e.isChecked);
          noSelect = options.filter((e) => !e.isChecked);
        }
        if (
          isShowSelectAll ||
          (selectedOpt.length === 0 && !selectedOpt.some((e) => e.isChecked))
        ) {
          setIsShowClearSelection(false);
        } else {
          setIsShowClearSelection(true);
        }
        if (eregVariant && maxSelectableOptions && selectedOpt.length >= maxSelectableOptions) {
          setDisabledOption(true);
        } else {
          setDisabledOption(false);
        }
        if (!eregVariant) {
          setSelectedOptions(selectedOpt);
          setNonSelectedOptions(noSelect);
          setLocalSelectedOptions([...selectedOpt]);
          setLocalNonSelectedOptions([...noSelect]);
        }
      }
      // Set empty when the options is dynamically changed to empty
      if (!CommonUtils.isNonEmptyArray(options)) {
        setStoredOptions([]);
        setSelectedOptions([]);
        setNonSelectedOptions([]);
        setLocalSelectedOptions([]);
        setLocalNonSelectedOptions([]);
      }
    }
  }, [options]);

  const isNonLocalStateSet = () => {
    return localSelectedOptions?.length !== 0 || localNonSelectedOptions?.length !== 0;
  };

  useEffect(() => {
    if (
      isNonLocalStateSet() &&
      (localSelectedOptions?.filter((option) => !option?.isChecked) ||
        localNonSelectedOptions?.filter((option) => option?.isChecked))
    ) {
      setSelectedOptions(localSelectedOptions);
      setNonSelectedOptions(localNonSelectedOptions);
    } else {
      setSelectedOptions(getFilteredArray(true));
      setNonSelectedOptions(getFilteredArray(false));
      setLocalSelectedOptions(getFilteredArray(true));
      setLocalNonSelectedOptions(getFilteredArray(false));
    }
  }, [isFilterOptions]);

  const getFilteredArray = (flag) => {
    if (CommonUtils.isNonEmptyArray(storedOptions)) {
      return storedOptions.filter((option) => option.isChecked === flag);
    }
  };

  useEffect(() => {
    if (eregVariant && searchString?.length) {
      let allSelectedOptions = localNonSelectedOptions.filter((item) => item.isChecked == true);
      if (allSelectedOptions.length >= 4) {
        setDisabledOption(true);
      } else {
        setDisabledOption(false);
      }
    }
  }, [localNonSelectedOptions]);

  useEffect(() => {
    setIsEmptyOptions(false);
    if (searchString?.length > 0 && !isInitialCheck) {
      setIsInitialCheck(true);
    }

    if (variant === variantType.DEFAULT) {
      handleFilterOptions();
      if (eregVariant && searchString?.length == 0) {
        let allSelectedOptions = storedOptions.filter((i) => i.isChecked == true);
        if (allSelectedOptions.length >= maxSelectableOptions) {
          setDisabledOption(true);
        }
      }
    }
  }, [searchString]);

  useEffect(() => {
    if (!isMultiSelect) {
      if (CommonUtils.isNonEmptyString(value)) {
        let tempOption = storedOptions.filter((option) => '' + option.value === value);
        if (tempOption?.length > 0) {
          setDisplayValue(tempOption[0]);
        }
      } else {
        setDisplayValue(
          CommonUtils.isNonEmptyString(defaultSelectedLabel)
            ? defaultSelectedLabel
            : 'Select option'
        );
      }
    }
    if (isMultiSelect && onChange) {
      onChange(storedOptions);
    }
  }, [storedOptions]);

  useEffect(() => {
    setDropdownWidth(refDropdown.current ? refDropdown.current.getBoundingClientRect().width : 0);
  }, [refDropdown, window.width]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refDropdown.current && !refDropdown.current.contains(event.target)) {
        if (optionsVisible) {
          setOptionsVisible(false);
        }
      }
    };

    if (!optionsVisible) {
      setSearchString('');
      handleOptions(storedOptions);
    }

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [optionsVisible, storedOptions]);

  const handleResize = () => {
    setDropdownWidth(refDropdown.current ? refDropdown.current.getBoundingClientRect().width : 0);
    return () => window.removeEventListener('resize', handleResize);
  };

  const getSizeStyle = () => {
    let style = {};

    switch (size) {
      case 'sm':
        style = {
          padding: '5px 26px 5px 8px',
          fontSize: 'var(--brand-font-size--extra-small)',
          lineHeight: 'var(--brand-line-height--medium)',
          letterSpacing: '0.001em'
        };
        break;
      case 'md':
        style = {
          padding: '7px 28px 7px 10px',
          fontSize: 'var(--brand-font-size--small)',
          lineHeight: 'var(--brand-line-height--large)'
        };
        break;
      case 'lg':
        style = {
          padding: '9px 30px 9px 12px',
          fontSize: 'var(--brand-font-size--default)',
          lineHeight: 'var(--brand-line-height--m-large)',
          letterSpacing: '-0.001em'
        };
    }
    return {
      ...style,
      color: error ? 'var(--brand-color-warning-orange-4)' : 'var(--brand-color-text-light-slate)'
    };
  };

  const getMenuItemSizeStyle = () => {
    let style = {};

    switch (size) {
      case 'sm':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--extra-small)',
          lineHeight: 'var(--brand-line-height--medium)',
          letterSpacing: ' 0.001em'
        };
        break;
      case 'md':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--small)',
          lineHeight: 'var(--brand-line-height--large)'
        };
        break;
      case 'lg':
        style = {
          fontWeight: 'var(--brand-font-weight-400)',
          fontSize: 'var(--brand-font-size--default)',
          lineHeight: 'var(--brand-line-height--m-large)'
        };
    }
    return {
      ...style
    };
  };

  const handleAll = (value) => {
    clearAll('SELECTED');
    clearAll('NONSELECTED');
    if (clearAllSelectedValues) {
      clearAllSelectedValues(value);
    }
    manageStoredOptions('ALL', value);
    manageLocalOptions('ALL', value);
  };

  const clearAll = (type) => {
    let tempOptions = [];

    (type === 'SELECTED' ? selectedOptions : nonSelectedOptions).forEach((option) => {
      tempOptions.push({
        ...option,
        isChecked: false
      });
    });

    if (type === 'SELECTED') {
      setSelectedOptions(tempOptions);
    } else {
      setNonSelectedOptions(tempOptions);
    }
  };

  const manageLocalOptions = (type, value) => {
    let tempOptions = [];

    if (type === 'SINGLE') {
      if (localSelectedOptions.find((option) => option.value === value)) {
        localSelectedOptions.forEach((option) => {
          let checkedFlag = option.isChecked;
          if (option.value === value) {
            checkedFlag = !checkedFlag;
          }
          tempOptions.push({
            ...option,
            isChecked: checkedFlag
          });
        });

        setLocalSelectedOptions(tempOptions);
      } else {
        localNonSelectedOptions.forEach((option) => {
          let checkedFlag = option.isChecked;
          if (option.value === value) {
            checkedFlag = !checkedFlag;
          }
          tempOptions.push({
            ...option,
            isChecked: checkedFlag
          });
        });

        setLocalNonSelectedOptions(tempOptions);
      }
    } else {
      localSelectedOptions.forEach((option) => {
        tempOptions.push({
          ...option,
          isChecked: value
        });
      });

      setLocalSelectedOptions(tempOptions);
      tempOptions = [];
      localNonSelectedOptions.forEach((option) => {
        tempOptions.push({
          ...option,
          isChecked: value
        });
      });

      setLocalNonSelectedOptions(tempOptions);
    }
  };

  useEffect(() => {
    if (!optionsVisible) {
      if (variant === variantType.ASYNC && !!asyncHandleSearch) {
        asyncHandleSearch('');
        setIsAsyncEnableHandle(false);
      }
    }
  }, [optionsVisible]);

  const manageStoredOptions = (type, value) => {
    let tempOptions = [];

    if (type === 'SINGLE') {
      storedOptions.forEach((option) => {
        let checkedFlag = option.isChecked;
        if (option.value === value) {
          checkedFlag = !checkedFlag;
        }
        tempOptions.push({
          ...option,
          isChecked: checkedFlag
        });
      });
    } else {
      storedOptions.forEach((option) => {
        tempOptions.push({
          ...option,
          isChecked: value
        });
      });
    }

    setStoredOptions(tempOptions);
  };

  const handleSelect = (type, selectedValue) => {
    let tempOptions = [];

    if (!isMultiSelect) {
      let tempOption = storedOptions.filter((option) => option.value === selectedValue);
      setDisplayValue({
        ...tempOption[0],
        isChecked: true
      });
      onChange(tempOption[0].value);
      setOptionsVisible(false);
    } else {
      if (type === 'SELECTED') {
        selectedOptions.forEach((option) => {
          let checkedFlag = option.isChecked;
          if (option.value === selectedValue) {
            checkedFlag = !checkedFlag;
          }
          tempOptions.push({
            ...option,
            isChecked: checkedFlag
          });
        });

        setSelectedOptions(tempOptions);
        toggleSelectedAll(tempOptions);
      } else {
        nonSelectedOptions.forEach((option) => {
          let checkedFlag = option.isChecked;
          if (option.value === selectedValue) {
            checkedFlag = !checkedFlag;
          }
          tempOptions.push({
            ...option,
            isChecked: checkedFlag
          });
        });

        setNonSelectedOptions(tempOptions);
      }

      manageStoredOptions('SINGLE', selectedValue);
      manageLocalOptions('SINGLE', selectedValue);
    }
  };

  const toggleSelectedAll = (tempOptions) => {
    let selectedCount = tempOptions.filter((val) => val.isChecked).length;
    if (selectedCount == options.length) {
      setSelectAll({ ...selectAll, isChecked: true, indeterminate: false });
    } else if (selectedCount > 0) {
      setSelectAll({ ...selectAll, indeterminate: true });
    } else {
      setSelectAll({ ...selectAll, isChecked: false, indeterminate: false });
    }
  };

  const onSelectAll = (e) => {
    e.stopPropagation();
    if (options && options.length > 0) {
      let selectedOpt = options.map((opt) => {
        return {
          ...opt,
          isChecked: !selectAll.isChecked || selectAll.indeterminate ? true : false
        };
      });
      setSelectedOptions([...selectedOpt]);
      manageStoredOptions('', !selectAll.isChecked || selectAll.indeterminate ? true : false);
      manageLocalOptions('', !selectAll.isChecked || selectAll.indeterminate ? true : false);
    }
    setSelectAll({
      ...selectAll,
      isChecked: selectAll.indeterminate ? true : !selectAll.isChecked,
      indeterminate: false
    });
  };

  const getSortedOptions = (toSortOptions, valueToMoveToLast, valueToMoveToTop) => {
    if (!isSortEnable || !isMultiSelect) {
      return toSortOptions;
    }

    return toSortOptions.sort(function (a, b) {
      // Check if a is the value to move to the top
      if (a.label === valueToMoveToTop) {
        return -1;
      }
      // Check if b is the value to move to the top
      if (b.label === valueToMoveToTop) {
        return 1;
      }
      // Check if a is the value to move to the last
      if (a.label === valueToMoveToLast) {
        return 1;
      }
      // Check if b is the value to move to the last
      if (b.label === valueToMoveToLast) {
        return -1;
      }
      if (
        CommonUtils.isNonEmptyArray(valueToMoveToTop) &&
        (valueToMoveToTop?.includes(a.label) || valueToMoveToTop?.includes(b.label))
      ) {
        return 0;
      }
      if (
        CommonUtils.isNonEmptyArray(valueToMoveToLast) &&
        (valueToMoveToLast?.includes(a.label) || valueToMoveToLast?.includes(b.label))
      ) {
        return 0;
      }
      const nameA = a?.label?.toUpperCase(); // ignore upper and lowercase
      const nameB = b?.label?.toUpperCase(); // ignore upper and lowercase

      // sort in an ascending order
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  };

  const handleOptions = (optionsArray) => {
    let selectedArray = [];
    let nonSelectedArray = [];
    if (isSelectedShiftDisable || options?.length <= 10) {
      selectedArray = getSortedOptions(optionsArray, valueToMoveToLast, valueToMoveToTop);
    } else {
      selectedArray = getSortedOptions(
        optionsArray.filter((option) => option.isChecked),
        valueToMoveToLast,
        valueToMoveToTop
      );

      nonSelectedArray = getSortedOptions(
        optionsArray.filter((option) => !option.isChecked),
        valueToMoveToLast,
        valueToMoveToTop
      );
    }

    if (selectedArray.length > 0 && selectedArray.some((e) => e.isChecked && !isShowSelectAll)) {
      setIsShowClearSelection(true);
    } else {
      setIsShowClearSelection(false);
    }

    setRefineNeeded(nonSelectedArray);

    setSelectedOptions(selectedArray);
    setNonSelectedOptions(nonSelectedArray);
    setLocalSelectedOptions(selectedArray);
    setLocalNonSelectedOptions(nonSelectedArray);
  };

  useEffect(() => {
    setRefineNeeded(nonSelectedOptions);
  }, [nonSelectedOptions]);

  const getSelectedCount = () => {
    let count = 0;
    storedOptions.forEach((option) => {
      if (option.isChecked) {
        count++;
      }
    });
    return count;
  };

  const setRefineNeeded = (dataArray) => {
    if (CommonUtils.isNonEmptyArray(dataArray)) {
      if (dataArray.length > maxRecordsCountToShow) {
        setIsRefineFilter(true);
      } else {
        setIsRefineFilter(false);
      }
    }
  };

  const handleFilterOptions = () => {
    if (searchString === '') {
      setIsFilterOptions(!isFilterOptions);
    } else {
      if (searchString && searchString.length > 1) {
        let tempSelectedFilterOptions = CommonUtils.searchAndRankOnPrefixFirst(
          localSelectedOptions,
          searchString.toLowerCase()
        );

        let tempNonSelectedFilterOptions = CommonUtils.searchAndRankOnPrefixFirst(
          localNonSelectedOptions,
          searchString.toLowerCase()
        );

        setSelectedOptions(tempSelectedFilterOptions);
        setNonSelectedOptions(tempNonSelectedFilterOptions);

        setRefineNeeded(tempNonSelectedFilterOptions);

        if (
          !CommonUtils.isNonEmptyArray(tempSelectedFilterOptions) &&
          !CommonUtils.isNonEmptyArray(tempNonSelectedFilterOptions)
        ) {
          setIsEmptyOptions(true);
        }
      }
    }
  };

  const clearSearchInput = () => {
    setSearchString('');
    if (variant === variantType.ASYNC && !!asyncHandleSearch) {
      asyncHandleSearch('');
      setIsAsyncEnableHandle(false);
    }
  };

  const getSelectValue = () => {
    if (!isInitialCheck && options?.length === 0) {
      return 'No options available';
    }

    if (!isMultiSelect) {
      if (CommonUtils.isNonNullObject(displayValue)) {
        return displayValue.label;
      } else {
        if (isShowNone) {
          return 'None';
        }
        if (CommonUtils.isNonEmptyString(defaultSelectedLabel)) {
          return defaultSelectedLabel;
        }
        return 'Select option';
      }
    } else {
      if (getSelectedCount() === 0) {
        return noSelectedCountMessage ? noSelectedCountMessage : multiSelectDefaultLabel || 'All';
      } else {
        return getSelectedCount() + ' Selected';
      }
    }
  };

  const getRefineFilterUi = () => {
    const refineUi = refineFilterMessage.map((message) => {
      return <span className={styles.refineMessage}>{message}</span>;
    });
    if (variant === variantType.DEFAULT && !eregVariant) {
      if (isRefineFilter && !isEmptyOptions) {
        return (
          <li
            key={id + '-refine-message'}
            data-testid={id + '-refine-message'}
            tabIndex={-1}
            className={styles.refineBox}>
            {refineUi}
          </li>
        );
      }
    } else if (variant === variantType.ASYNC) {
      if (asyncRecordsFound > maxRecordsCountToShow) {
        return (
          <li
            key={id + '-refine-message-li'}
            data-testid={id + '-refine-message'}
            tabIndex={-1}
            className={styles.refineBox}>
            {refineUi}
          </li>
        );
      }
    }
  };

  const getSelectOptionsUi = () => {
    let selectedOptionsUi, nonSelectedOptionsUi;
    let tempTwentyOptions = nonSelectedOptions;
    selectedOptionsUi =
      selectedOptions &&
      selectedOptions?.map((option, index) => {
        const { label, value } = option;
        return (
          <li
            className={`${styles.selectMenuItem} ${
              !isMultiSelect ? styles['selectMenuItemSingleSelect' + size] : ''
            } ${!isMultiSelect && value === displayValue?.value ? styles.selectedMenuItem : ''}`}
            key={id + '-opt-' + index}
            value={value}
            tabIndex={isActionable ? -1 : 0}
            onClick={(e) => (isActionable ? null : handleSelect('SELECTED', value))}
            onKeyDown={(event) => {
              if (event.key === ' ' && !isActionable) {
                handleSelect('SELECTED', value);
              }
            }}
            style={{
              ...getMenuItemSizeStyle(),
              borderBottom: !isMultiSelect
                ? '1px solid var(--brand-color-grey-scale-cool-1)'
                : 'none'
            }}>
            {isMultiSelect && (
              <input
                type="checkbox"
                id={id + '-labelitem-' + index}
                key={id + '-labelitem-' + index}
                name={id + '-labelitem-' + index}
                checked={option.isChecked}
                data-testid={id + '-selectedCheckbox-testid-' + index}
                tabIndex={-1}
                onChange={(e) => handleSelect('SELECTED', value)}
                disabled={!option.isChecked && eregVariant && disableOption}
              />
            )}
            <div
              // className={`${!isMultiSelect ? styles.growFlex : ''} ${styles.lineClamps2}`}
              className={`${!isMultiSelect ? styles.growFlex : ''}`}
              tabIndex={isActionable ? 0 : -1}
              onClick={(e) => (isActionable ? handleSelect('SELECTED', value) : null)}
              onKeyDown={(event) => {
                if (event.key === ' ' && isActionable) {
                  handleSelect('SELECTED', value);
                }
              }}>
              <TooltipText className={styles.lineClamps2}>{label}</TooltipText>
            </div>
            {isActionable && !option.isHideAction && (
              <button
                data-testid={id + '-menuAction-testid-' + index}
                className={styles.menuActionIcon}
                onClick={() => menuActionClick(value)}>
                {menuActionIcon}
              </button>
            )}
          </li>
        );
      });

    if (eregVariant) {
      tempTwentyOptions = nonSelectedOptions;
    } else if (nonSelectedOptions?.length > maxRecordsCountToShow) {
      if (maxRecordsCountToShow !== -1) {
        tempTwentyOptions = nonSelectedOptions.slice(0, maxRecordsCountToShow);
      }
    }

    nonSelectedOptionsUi =
      tempTwentyOptions &&
      tempTwentyOptions.map((option, index) => {
        const { label, value, endLabel } = option;

        return (
          <li
            className={`${styles.selectMenuItem} ${
              !isMultiSelect ? styles['selectMenuItemSingleSelect' + size] : ''
            } ${!isMultiSelect && value === displayValue?.value ? styles.selectedMenuItem : ''} ${
              !option.isChecked && eregVariant && disableOption ? styles.disabledCheckboxItem : ''
            }`}
            key={id + '-opt-NS-' + index}
            value={value}
            tabIndex={isActionable ? -1 : 0}
            onClick={(e) => (isActionable ? null : handleSelect('NONSELECTED', value))}
            onKeyDown={(event) => {
              if (event.key === ' ' && !isActionable) {
                handleSelect('NONSELECTED', value);
              }
            }}
            style={{
              ...getMenuItemSizeStyle(),
              borderBottom:
                !isMultiSelect && index !== tempTwentyOptions.length - 1
                  ? '1px solid var(--brand-color-grey-scale-cool-1)'
                  : 'none'
            }}>
            {isMultiSelect && (
              <input
                disabled={!option.isChecked && eregVariant && disableOption}
                type="checkbox"
                id={id + '-labelitem-NS-' + index}
                name={id + '-labelitem-NS-' + index}
                data-testid={id + '-nonSelectedCheckbox-testid-' + index}
                key={id + '-labelitem-NS-' + index}
                checked={option.isChecked}
                tabIndex={-1}
                onChange={(e) => handleSelect('NONSELECTED', value)}
              />
            )}

            <div
              // className={`${!isMultiSelect ? styles.growFlex : ''} ${styles.lineClamps2}`}
              className={`${!isMultiSelect ? styles.growFlex : ''}`}
              tabIndex={isActionable ? 0 : -1}
              onClick={(e) => (isActionable ? handleSelect('NONSELECTED', value) : null)}
              onKeyDown={(event) => {
                if (event.key === ' ' && isActionable) {
                  handleSelect('NONSELECTED', value);
                }
              }}>
              {isEndLabel ? (
                <div className={styles.endLabelOption}>
                  <span className={styles.endLabelOptionLabel}>{label}</span>
                  <span className={styles.endLabelOptionEndLabel}>{endLabel}</span>
                </div>
              ) : (
                <TooltipText className={styles.lineClamps2}>{label}</TooltipText>
              )}
            </div>
            {isActionable && !option.isHideAction && (
              <button className={styles.menuActionIcon} onClick={() => menuActionClick(value)}>
                {menuActionIcon}
              </button>
            )}
          </li>
        );
      });

    return (
      <ul
        className={`${styles.selectMenuList} ${
          !isMultiSelect ? styles['selectMenuListSingleSelect' + size] : ''
        }`}
        style={{
          maxHeight:
            isSearchEnable && isShowSelectAll
              ? `calc(${optionContainerHeight} - 84px)`
              : isSearchEnable || isShowSelectAll
              ? `calc(${optionContainerHeight} - 66px)`
              : `calc(${optionContainerHeight} - 4px)`
        }}>
        {selectedOptionsUi}
        {isMultiSelect &&
          selectedOptions &&
          selectedOptions.length > 0 &&
          nonSelectedOptions &&
          nonSelectedOptions.length > 0 && (
            <li
              tabIndex={-1}
              className={styles.divider}
              key={`${id}-dropdown-checkbox`}
              style={{
                height: '0px',
                marginTop: '8px'
              }}
            />
          )}
        {nonSelectedOptionsUi}
        {getRefineFilterUi()}
      </ul>
    );
  };

  const getDropdownHeight = () => {
    let style = {};

    switch (size) {
      case 'sm':
        style = {
          height: '2.6rem'
        };
        break;
      case 'md':
        style = {
          height: '3.2rem'
        };
        break;
      case 'lg':
        style = {
          height: '3.8rem'
        };
    }
    return style;
  };

  const getEmptyOptionsUi = () => {
    return (
      <ul className={styles.emptyMenuContainer}>
        <li
          className={styles.emptyMenuItem}
          tabIndex={0}
          key={id + '-opt-empty'}
          style={{
            ...getMenuItemSizeStyle()
          }}
          onClick={() => setOptionsVisible(false)}>
          <NoResult className={styles.emptyMenuIcon} />
          <span className={styles.emptyMenuItemMessage}>{emptyOptionMessage}</span>
        </li>
      </ul>
    );
  };

  const getOptionConatinerStyle = () => {
    if (isCustomVariant) {
      return {
        width:
          isEmptyOptions || (!isInitialCheck && options.length === 0)
            ? '100%'
            : optionContainerWidth
            ? optionContainerWidth
            : isModalDropdown
            ? dropdownWidth
            : 'max-content',
        maxWidth: !isInitialCheck && options.length === 0 ? '100%' : isModalDropdown ? '' : '165%',
        minWidth:
          isEmptyOptions || (!isInitialCheck && options.length === 0)
            ? 'auto'
            : optionContainerWidth
            ? optionContainerWidth
            : isModalDropdown
            ? ''
            : '100%',
        maxHeight: optionContainerHeight,
        ...style
      };
    }
    return {
      minWidth: isEmptyOptions || (!isInitialCheck && options.length === 0) ? 'auto' : '180px',
      width:
        isEmptyOptions || (!isInitialCheck && options.length === 0)
          ? '100%'
          : !isMultiSelect
          ? dropdownWidth
          : 'none',
      maxWidth:
        !isMultiSelect || isEmptyOptions
          ? 'none'
          : !isInitialCheck && options.length === 0
          ? '100%'
          : '212px'
    };
  };

  return (
    <div
      ref={refDropdown}
      style={{
        position: 'relative'
      }}>
      <div className={styles.labelContainer}>
        {label && (
          <Label
            id={'dropdown-label-' + id}
            htmlFor={'dropdown-' + id}
            data-testid={'dropdown-label-testid-' + id}
            className={`${styles.label} ${styles['size-' + size]} ${
              showRequiredLabel ? styles.showRequiredLabel : ''
            }`}>
            <span className={`${styles.labelWrap}`} title={label}>
              {label}
            </span>

            {isRequired && <Required isLegend={showRequiredLabel} />}

            {/* {isRequired && (
              <span className={styles.requiredIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none">
                  <circle cx="3" cy="3" r="3" fill="#DB3A29" />
                </svg>
                {showRequiredLabel && 'Required'}
              </span>
            )} */}
            {tooltipText && (
              <Tooltip
                body={tooltipText}
                key={'input-tooltip-' + id}
                placement="top"
                alignText="left"
                maxW="325px">
                <span aria-label="information" className={styles.tooltipStyles}>
                  <InfoIcon />
                </span>
              </Tooltip>
            )}
            {showClear && (
              <div className={styles.clearFieldButton}>
                <Button
                  variant="tertiary"
                  textButton={true}
                  textTransform={'capitalize'}
                  onClick={() => {
                    if (isMultiSelect) {
                      handleAll(false);
                    } else {
                      setDisplayValue('');
                      onChange('');
                    }
                  }}>
                  clear
                </Button>
              </div>
            )}
          </Label>
        )}
      </div>
      <div
        className={`${styles.customMuiSelect} ${optionsVisible ? styles.active : ''} ${
          styles.hasValue
        } ${!error ? '' : styles.hasError} ${isDisabled ? styles.disabled : ''} ${
          isReadOnly ? styles.readOnly : isEmptyOptions ? styles.emptyOptions : ''
        } ${optionsVisible ? styles.selectLabelBlack : ''}
        ${
          eregVariant
            ? selectedOptions.length
              ? styles.hasValueEregSelectedOptions
              : styles.hasValueEreg
            : ''
        }`}
        tabIndex={0}
        role={isDisabled || isReadOnly ? '' : 'button'}
        style={{
          width: width,
          cursor: isDisabled || isReadOnly ? 'default' : 'pointer',
          ...getDropdownHeight()
        }}
        onClick={() => (isDisabled || isReadOnly ? null : setOptionsVisible(!optionsVisible))}
        data-testid={'dropdown-testid-' + id}>
        <div
          className={`${styles.selectLabel}`}
          style={{
            ...getSizeStyle()
          }}
          id={getSelectedCount() + label ? label : `${'label-' + id}`}>
          {getSelectValue()}
        </div>
        <div className={`${styles.selectSvgIcon} ${eregVariant ? styles.svgIconGreyed : ''}`}>
          {optionsVisible ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g>
                <path
                  d="M9.76548 7.917L5.71298 1.22117C5.63875 1.09852 5.53413 0.997103 5.40924 0.926711C5.28435 0.856319 5.14342 0.819336 5.00006 0.819336C4.8567 0.819336 4.71577 0.856319 4.59088 0.926711C4.46599 0.997103 4.36138 1.09852 4.28714 1.22117L0.234644 7.917C0.158207 8.04339 0.116736 8.18782 0.114477 8.33551C0.112219 8.48319 0.149254 8.62883 0.22179 8.75749C0.294327 8.88616 0.399757 8.99324 0.527286 9.06775C0.654814 9.14227 0.799857 9.18156 0.94756 9.18158H9.05256C9.20026 9.18156 9.34531 9.14227 9.47284 9.06775C9.60036 8.99324 9.70579 8.88616 9.77833 8.75749C9.85087 8.62883 9.8879 8.48319 9.88564 8.33551C9.88338 8.18782 9.84191 8.04339 9.76548 7.917Z"
                  fill={
                    isDisabled
                      ? '#CBCED2'
                      : isReadOnly
                      ? '#627386'
                      : eregVariant
                      ? '#627386'
                      : '#181818'
                  }
                />
              </g>
              <defs>
                <clipPath id="clip0_53995_233">
                  <rect width="10" height="10" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.77833 1.24338C9.70579 1.11469 9.60036 1.00759 9.47282 0.933061C9.34527 0.858528 9.20021 0.819237 9.05249 0.819214H0.947492C0.799851 0.819286 0.654879 0.85858 0.527411 0.933078C0.399942 1.00758 0.294555 1.1146 0.222031 1.2432C0.149507 1.3718 0.112452 1.51736 0.114656 1.66499C0.11686 1.81261 0.158245 1.957 0.234575 2.08338L4.28707 8.77921C4.36131 8.90186 4.46592 9.00328 4.59081 9.07367C4.7157 9.14406 4.85663 9.18105 4.99999 9.18105C5.14335 9.18105 5.28429 9.14406 5.40917 9.07367C5.53406 9.00328 5.63868 8.90186 5.71291 8.77921L9.76541 2.08338C9.84176 1.95706 9.88319 1.81272 9.88546 1.66513C9.88773 1.51754 9.85076 1.37199 9.77833 1.24338Z"
                fill={
                  isDisabled
                    ? '#CBCED2'
                    : isReadOnly || isEmptyOptions
                    ? '#627386'
                    : eregVariant
                    ? '#627386'
                    : '#181818'
                }
              />
            </svg>
          )}
        </div>
      </div>

      {error && errorMessage && (
        <TextError
          errorMessage={errorMessage}
          size={size}
          id={id}
          data-testid={'error-testid-' + id}
          showErrorIcon
        />
      )}

      {/* {error && errorMessage && (
        <p
          data-testid={'error-testid-' + id}
          id={'error' + id}
          className={`${styles.errortext} ${styles['errortext-' + size]}`}>
          <ErrorIcon />
          {errorMessage}
          <span className="sr-only">{errorMessage}</span>
        </p>
      )} */}

      {optionsVisible && (
        <div
          ref={listDropdown}
          className={`${styles.selectOptionsContainer} ${
            eregVariant ? styles.selectOptionsMaxWidth : ''
          }`}
          style={getOptionConatinerStyle()}>
          {!isInitialCheck && options.length === 0 && getEmptyOptionsUi()}

          {/* dummy div to adjust/remove extra height of empty UI */}
          {!isInitialCheck && options.length === 0 && isMultiSelect && (
            <div style={{ marginTop: '-20px' }}></div>
          )}
          <div
            style={{
              padding:
                isSearchEnable || (isShowClearSelection && !isEmptyOptions)
                  ? '12px 12px 0px 12px'
                  : isMultiSelect
                  ? '0px 12px 8px 12px'
                  : ''
            }}>
            {isSearchEnable && (
              <div
                data-testid={'search-testid-' + id}
                className={isSuccess ? styles.success : styles.width}>
                <CssTextField
                  id={'dateInput-' + id}
                  data-testid={'dateInput-testid-' + id}
                  onChange={(e) => {
                    setSearchString(e.target.value);
                    if (variant === variantType.ASYNC && !!asyncHandleSearch) {
                      if (e.target.value.length > 1) {
                        setIsAsyncEnableHandle(true);
                        asyncHandleSearch(e.target.value);
                      } else if (isAsyncEnableHandle) {
                        asyncHandleSearch(e.target.value);
                        if (e.target.value.length === 0) {
                          setIsAsyncEnableHandle(false);
                        }
                      }
                    }
                  }}
                  placeholder={searchPlaceholder}
                  value={searchString}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--brand-color-grey-scale-warm-2)',
                    borderRadius: '0.6rem'
                  }}
                  InputProps={{
                    endAdornment:
                      isClearable && CommonUtils.isNonEmptyString(searchString) ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear input search box"
                            onClick={() => clearSearchInput()}
                            onMouseDown={() => clearSearchInput()}
                            edge="end">
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <g clipPath="url(#clip0_1190_242128)">
                                <path
                                  d="M8.98863 16.2935C10.505 16.2935 11.9872 15.8439 13.248 15.0015C14.5088 14.1591 15.4914 12.9617 16.0717 11.5608C16.652 10.1599 16.8038 8.61837 16.508 7.13118C16.2122 5.64399 15.482 4.27793 14.4098 3.20572C13.3376 2.13352 11.9715 1.40334 10.4843 1.10752C8.99713 0.811701 7.45562 0.963527 6.05472 1.5438C4.65382 2.12407 3.45645 3.10673 2.61403 4.3675C1.7716 5.62828 1.32196 7.11055 1.32196 8.62687C1.32425 10.6595 2.13273 12.6082 3.57001 14.0455C5.00729 15.4828 6.95601 16.2912 8.98863 16.2935ZM5.68863 6.74154C5.62664 6.67963 5.57747 6.6061 5.54392 6.52517C5.51037 6.44424 5.4931 6.35749 5.4931 6.26988C5.4931 6.18226 5.51037 6.09551 5.54392 6.01458C5.57747 5.93365 5.62664 5.86012 5.68863 5.79821L6.15996 5.32688C6.22188 5.26489 6.2954 5.21572 6.37633 5.18217C6.45727 5.14862 6.54402 5.13135 6.63163 5.13135C6.71924 5.13135 6.80599 5.14862 6.88692 5.18217C6.96785 5.21572 7.04138 5.26489 7.10329 5.32688L8.87063 7.09354C8.88611 7.10906 8.9045 7.12138 8.92475 7.12978C8.945 7.13818 8.9667 7.14251 8.98863 7.14251C9.01055 7.14251 9.03226 7.13818 9.05251 7.12978C9.07275 7.12138 9.09115 7.10906 9.10663 7.09354L10.874 5.32688C10.9359 5.26489 11.0094 5.21572 11.0903 5.18217C11.1713 5.14862 11.258 5.13135 11.3456 5.13135C11.4332 5.13135 11.52 5.14862 11.6009 5.18217C11.6819 5.21572 11.7554 5.26489 11.8173 5.32688L12.2886 5.79821C12.3506 5.86012 12.3998 5.93365 12.4333 6.01458C12.4669 6.09551 12.4842 6.18226 12.4842 6.26988C12.4842 6.35749 12.4669 6.44424 12.4333 6.52517C12.3998 6.6061 12.3506 6.67963 12.2886 6.74154L10.522 8.50887C10.5064 8.52436 10.4941 8.54275 10.4857 8.563C10.4773 8.58325 10.473 8.60495 10.473 8.62687C10.473 8.6488 10.4773 8.6705 10.4857 8.69075C10.4941 8.711 10.5064 8.72939 10.522 8.74487L12.29 10.5122C12.3519 10.5741 12.4011 10.6476 12.4347 10.7286C12.4682 10.8095 12.4855 10.8963 12.4855 10.9839C12.4855 11.0715 12.4682 11.1582 12.4347 11.2392C12.4011 11.3201 12.3519 11.3936 12.29 11.4555L11.8186 11.9269C11.7567 11.9889 11.6832 12.038 11.6023 12.0716C11.5213 12.1051 11.4346 12.1224 11.347 12.1224C11.2594 12.1224 11.1726 12.1051 11.0917 12.0716C11.0107 12.038 10.9372 11.9889 10.8753 11.9269L9.10663 10.1602C9.07519 10.1292 9.0328 10.1118 8.98863 10.1118C8.94446 10.1118 8.90207 10.1292 8.87063 10.1602L7.10329 11.9269C7.04138 11.9889 6.96785 12.038 6.88692 12.0716C6.80599 12.1051 6.71924 12.1224 6.63163 12.1224C6.54402 12.1224 6.45727 12.1051 6.37633 12.0716C6.2954 12.038 6.22188 11.9889 6.15996 11.9269L5.68863 11.4555C5.62664 11.3936 5.57747 11.3201 5.54392 11.2392C5.51037 11.1582 5.4931 11.0715 5.4931 10.9839C5.4931 10.8963 5.51037 10.8095 5.54392 10.7286C5.57747 10.6476 5.62664 10.5741 5.68863 10.5122L7.45529 8.74487C7.47081 8.72939 7.48313 8.711 7.49153 8.69075C7.49993 8.6705 7.50426 8.6488 7.50426 8.62687C7.50426 8.60495 7.49993 8.58325 7.49153 8.563C7.48313 8.54275 7.47081 8.52436 7.45529 8.50887L5.68863 6.74154Z"
                                  fill="#627386"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_1190_242128">
                                  <rect
                                    width="17"
                                    height="17"
                                    fill="white"
                                    transform="translate(0.988647 0.626953)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </IconButton>
                        </InputAdornment>
                      ) : null
                  }}
                  autoComplete={'off'}
                />
              </div>
            )}
            {isShowClearSelection &&
              isMultiSelect &&
              !isEmptyOptions &&
              ((eregVariant &&
                selectedOptions &&
                selectedOptions.length > 0 &&
                nonSelectedOptions &&
                nonSelectedOptions.length > 0) ||
                !eregVariant) && (
                <div
                  data-testid={'clearAll-testid-' + id}
                  className={styles.clearButton}
                  style={{
                    marginTop: isSearchEnable ? '16px' : '0px'
                  }}>
                  <Button
                    textButton={true}
                    size={'md'}
                    onClick={() => handleAll(false)}
                    label={clearFilterLabel}
                    dataTestId={'clear-all-filter'}
                    textTransform={'none'}></Button>
                </div>
              )}

            {options?.length > 0 && isShowSelectAll && !isEmptyOptions && isMultiSelect && (
              <li
                className={`${styles.selectMenuItem} ${styles.selectAll}`}
                key={'selectAll' + '-opt-0'}
                value={'Select All'}
                tabIndex={-1}
                onClick={(e) => onSelectAll(e)}
                style={{
                  ...getMenuItemSizeStyle()
                }}>
                {isMultiSelect && (
                  <Checkbox
                    sx={{
                      strokeWidth: 1.2,
                      stroke: '#FFF',
                      borderRadius: '1px',
                      '& .MuiSvgIcon-root': { fontSize: 24 }
                    }}
                    id={'selectAll' + '-labelitem-0'}
                    key={'selectAll' + '-labelitem-0'}
                    name={'selectAll' + '-labelitem-0'}
                    checked={selectAll.isChecked}
                    onChange={onSelectAll}
                    indeterminate={selectAll.indeterminate}
                  />
                )}

                <p
                  className={`${styles.lineClamps2}`}
                  tabIndex={-1}
                  onClick={(e) => onSelectAll(e)}>
                  {selectAll.label}
                </p>
              </li>
            )}

            {((options?.length > 0 && isShowSelectAll) ||
              isSearchEnable ||
              (isShowClearSelection && !isEmptyOptions)) && (
              <div className={isShowSelectAll ? styles.selectAllDivider : styles.divider} />
            )}
          </div>

          <div>{getSelectOptionsUi()}</div>
        </div>
      )}
    </div>
  );
};

SearchableDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  helperMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool,
  isRequired: PropTypes.bool, // Handles whether or not to show a red required indicator next to the dropdown label.
  showRequiredLabel: PropTypes.bool, // will show the required text and will be placed to right end of the label.
  label: PropTypes.string, // Label to show next to the dropdown.
  placeholder: PropTypes.string, //Options are: top, left
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  size: PropTypes.oneOf(['lg', 'md', 'sm']).isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  clearFilterLabel: PropTypes.string,
  refineFilterMessage: PropTypes.array, //pass messages as array of string.
  width: PropTypes.string,
  isShowCheckbox: PropTypes.bool,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  isActionable: PropTypes.bool,
  menuActionIcon: PropTypes.any,
  menuActionClick: PropTypes.func,
  isSortEnable: PropTypes.bool,
  clearAllSelectedValues: PropTypes.func,
  recordsCountToEnableSearch: PropTypes.number,
  maxRecordsCountToShow: PropTypes.number,
  variant: PropTypes.oneOf([variantType.DEFAULT, variantType.ASYNC]),
  asyncHandleSearch: PropTypes.func,
  asyncRecordsFound: PropTypes.number,
  isSelectedShiftDisable: PropTypes.bool,
  isEndLabel: PropTypes.bool,
  optionContainerHeight: PropTypes.string,
  valueToMoveToLast: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  defaultSelectedLabel: PropTypes.string,
  valueToMoveToTop: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  emptyOptionMessage: PropTypes.string,
  isReadOnly: PropTypes.bool,
  optionContainerWidth: PropTypes.string,
  isShowSelectAll: PropTypes.bool,
  multiSelectDefaultLabel: PropTypes.string,
  isCustomVariant: PropTypes.bool
};

SearchableDropdown.defaultProps = {
  isRequired: false,
  isMultiSelect: true,
  placeholder: 'Select',
  searchPlaceholder: 'Search',
  showRequiredLabel: false,
  size: 'lg',
  variant: variantType.DEFAULT,
  isSuccess: false,
  refineFilterMessage: ['More records exist.', 'Search to refine.'],
  clearFilterLabel: 'Clear Selection',
  width: '100%',
  isClearable: true,
  isDisabled: false,
  isActionable: false,
  isSortEnable: true,
  recordsCountToEnableSearch: 10,
  maxRecordsCountToShow: 20,
  asyncRecordsFound: 20,
  isSelectedShiftDisable: false,
  isEndLabel: false,
  optionContainerHeight: 'auto',
  // optionContainerWidth: '180px',
  valueToMoveToLast: '',
  defaultSelectedLabel: '',
  valueToMoveToTop: '',
  emptyOptionMessage: 'No data to display',
  isReadOnly: false,
  eregVariant: false,
  tooltipText: '',
  noSelectedCountMessage: '',
  maxSelectableOptions: 20,
  showClear: false,
  isShowSelectAll: false,
  isModalDropdown: false,
  isCustomVariant: false
};
