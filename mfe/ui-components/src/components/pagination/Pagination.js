import React from "react";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../../assets/theme/MuiTheme";
import useWindowSize from "../../common/hook/UseWindowSize";

export const Paginate = (props) => {
  const { onPageChange, totalCount, currentPage, siblingBreakpoint } = props;
  let windowSize = useWindowSize();
  let boundaryCount;
  let siblingCount;
  let siblingBreakpointLocal = siblingBreakpoint ? siblingBreakpoint : 'lg';

  const style = {
    "& .MuiPaginationItem-root": {
      color: "var(--brand-color-primary)",
      fontWeight: "var(--brand-font-weight-600)",
      fontSize: "var(--brand-font-size--default)",
      lineHeight: "2rem",
    },
    "& .MuiPaginationItem-root:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiPaginationItem-page.Mui-selected": {
      backgroundColor: "var(--brand-color-secondary-active-yellow-3)",
      border: "1px solid var(--brand-color-secondary)",
      color: "var(--brand-color-background-dark-slate)",
      fontWeight: "var(--brand-font-weight-700)",
    },
    "& .MuiPaginationItem-page.Mui-selected:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiPaginationItem-icon": { width: "3.2rem", height: "3.8rem" },
    "@media (max-width: 600px)": {
      "& .MuiPagination-ul li:first-child": {
        "& button": {
          margin: 0,
          padding: "0 10px 0 0",
          minWidth: 0,
        },
      },
    },
    "@media (max-width: 323px)": {
      "& .MuiPagination-ul li:last-child": {
        "& button": {
          margin: 0,
        },
      },
    },
  };
  if (windowSize.width <= muiTheme.breakpoints.values[siblingBreakpointLocal]) {
    boundaryCount = 1;
    siblingCount = 0;
  } else {
    boundaryCount = 1;
    siblingCount = 2;
  }
 
  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <Pagination
          sx={style}
          onChange={onPageChange}
          count={totalCount}
          page={currentPage}
          //rowsPerPage={pageSize}
          boundaryCount={boundaryCount}
          siblingCount={siblingCount}
        />
      </ThemeProvider>
    </>
  );
};
Paginate.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  siblingBreakpoint: PropTypes.string,
};
