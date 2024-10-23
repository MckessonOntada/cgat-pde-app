import React from "react";
import styles from "../assets/CustomDataTable.module.scss";

function DataTableEmptyView({ text, ...props }) {
  return (
    <div className={styles.emptyTableContainer}>
      <div className={styles.emptyTableDisplay}>{text}</div>
    </div>
  );
}

export default DataTableEmptyView;
