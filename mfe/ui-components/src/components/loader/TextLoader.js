import React from "react";
import { TYPE } from "./assets/constants/LoaderConstants";
import styles from "./assets/styles/Loader.module.scss";

export const Text = ({ loaderText, type }) => {
  if (type === TYPE.INLINE) {
    <div className={styles.inlineLoader}>
      <div className={styles.container_Loader}>
        <p className={styles.container_Loader__text}>{loaderText}</p>
        <div className={styles.wrap}>
          <div className={styles.loaderTwoDots}>
            <div className={`${styles.circle} ${styles.circle1}`}> </div>
          </div>
          <div className={styles.loader2}>
            <div className={`${styles.circle} ${styles.circle2}`}> </div>
          </div>
        </div>
      </div>
    </div>;
  }
  return (
    <div className={styles.container_Loader}>
      <p className={styles.container_Loader__text}>{loaderText}</p>
      <div className={styles.wrap}>
        <div className={styles.loaderTwoDots}>
          <div className={`${styles.circle} ${styles.circle1}`}> </div>
        </div>
        <div className={styles.loader2}>
          <div className={`${styles.circle} ${styles.circle2}`}> </div>
        </div>
      </div>
    </div>
  );
};
