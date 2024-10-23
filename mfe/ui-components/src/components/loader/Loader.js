import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/Loader.module.scss";
import { Text } from "./TextLoader";
import { Circular } from "./Circular";
import { TYPE, VARIANT } from "./assets/constants/LoaderConstants";
import { CommonUtils } from "../../common/utils/CommonUtils";
import { CircularWithText } from "./CircularWithText"

export const Loader = (props) => {
  const { type, loaderText, variant, id, containerHeight, loaderSize } = props
  if (type === TYPE.SCREEN) {
    return (
      <>
        {variant === VARIANT.CIRCULAR_WITH_TEXT ? (
          <div
            className={styles.fullScreenLoaderContainer}
            data-testid="content-loader"
          >
            <CircularWithText loaderText={loaderText} loaderSize={loaderSize} />
          </div>
        ) : (
          <div
            className={styles.screenloaderfullScreen}
            data-testid="content-loader"
          >
            {variant === VARIANT.TEXT ? (
              <Text loaderText={loaderText} />
            ) : (
              <Circular />
            )}
          </div>
        )}
      </>
    );
  }
  return (
    <>
      {variant === VARIANT.TEXT ? (
        <Text loaderText={loaderText} type={TYPE.INLINE} />
      ) : (
        <Circular id={id} height={containerHeight} />
      )}
    </>
  );
};

Loader.propTypes = {
  type: PropTypes.oneOf(["inline", "screen"]),
  variant: PropTypes.oneOf(["circular", "text", "circularWithText"]),
  loaderText: PropTypes.string,
  id: PropTypes.any,
  containerHeight: PropTypes.any,
};

Loader.defaultProps = {
  type: "inline",
  loaderText: "We'll be right with you...",
  variant: "text",
  id: CommonUtils.generateId(4),
  containerHeight: "100px",
  loaderSize: "75px"
};
