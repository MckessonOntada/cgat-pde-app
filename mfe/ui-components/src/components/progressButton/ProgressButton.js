import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  textStyles,
  buttonOverriddenStyles,
} from "./assets/constants/buttonStylesConstants";
import styles from "./assets/styles/ProgressButton.module.scss";

export const ProgressButton = (props) => {
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);

  const {
    id,
    size,
    isProcessing,
    isCompleted,
    processingText,
    completedText,
    children,
    onClickFn,
    completeIcon,
    minWidth,
  } = props;

  useEffect(() => {
    setIsAnimationCompleted(true);
  }, [isProcessing, isCompleted]);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationCompleted(false);
    }, 400);
  }, [isAnimationCompleted]);

  const getButtonBackground = () => {
    if (isProcessing || isCompleted) {
      return {
        backgroundColor: "#E7F4E4",
        color: "#48A463",
      };
    } else {
      return {
        backgroundColor: "#007cc1",
        color: "#fff",
      };
    }
  };

  const computeTextStyle = () => {
    let textStyle = {};

    switch (size) {
      case "lg":
        textStyle = textStyles.allCapsBoldLarge;
        break;
      case "md":
        textStyle = textStyles.allCapsBoldMedium;
        break;
      case "sm":
        textStyle = textStyles.allCapsBoldSmall;
        break;
      case "xs":
        textStyle = textStyles.allCapsBoldExtraSmall;
        break;
      default:
        textStyle = textStyles.allCapsBoldMedium;
        break;
    }

    return textStyle;
  };

  const getChildrenUi = () => {
    if (isProcessing) {
      return (
        <span
          className={`${styles.textMargin} ${styles.animationSpan}`}
          style={{
            ...buttonOverriddenStyles,
            ...computeTextStyle(),
          }}
        >
          {processingText}
        </span>
      );
    } else if (isCompleted) {
      if (isAnimationCompleted) {
        return (
          <span
            className={`${styles.textMargin} ${styles.animationSpan}`}
            style={{
              ...buttonOverriddenStyles,
              ...computeTextStyle(),
            }}
          >
            {processingText}
          </span>
        );
      } else {
        return (
          <span
            className={`${styles.slideTo} ${styles.animationSpan}`}
            style={{
              ...buttonOverriddenStyles,
              ...computeTextStyle(),
            }}
          >
            {completeIcon ? (
              completeIcon
            ) : (
              <svg
                className={styles.iconMargin}
                width="16"
                height="15.99"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5828 0.187287C15.3672 0.0327637 15.0991 -0.029814 14.8375 0.0133188C14.5758 0.0564517 14.342 0.201762 14.1874 0.417287L4.83075 13.4626L1.70742 10.3366C1.61457 10.2437 1.50434 10.17 1.38302 10.1198C1.26169 10.0695 1.13165 10.0436 1.00032 10.0435C0.868987 10.0435 0.738934 10.0693 0.617587 10.1196C0.496239 10.1698 0.385973 10.2434 0.293085 10.3363C0.200196 10.4291 0.126505 10.5394 0.0762171 10.6607C0.0259296 10.782 3.09789e-05 10.9121 2.77749e-08 11.0434C-3.09234e-05 11.1747 0.0258064 11.3048 0.0760368 11.4261C0.126267 11.5475 0.199907 11.6577 0.292751 11.7506L4.24942 15.7066C4.3533 15.8066 4.47725 15.8833 4.61304 15.9317C4.74884 15.9801 4.89337 15.9991 5.03706 15.9873C5.18074 15.9756 5.32029 15.9335 5.44644 15.8637C5.57259 15.7939 5.68246 15.6981 5.76875 15.5826L15.8128 1.58262C15.9673 1.36708 16.0299 1.09899 15.9867 0.837322C15.9436 0.575649 15.7983 0.341826 15.5828 0.187287Z"
                  fill="#48A463"
                />
              </svg>
            )}
            <span className={`${styles.textMargin}`}>{completedText}</span>
          </span>
        );
      }
    } else {
      return (
        <span
          className={`${styles.baseStyle} ${styles.animationSpan} ${styles.textMargin}`}
          style={{
            ...buttonOverriddenStyles,
            ...computeTextStyle(),
          }}
        >
          {children}
        </span>
      );
    }
  };

  return (
    <button
      id={"ProgressButton-" + id}
      data-testid={"ProgressButton-" + id}
      className={styles.base}
      style={{
        minWidth: minWidth,
        ...getButtonBackground(),
      }}
      disabled={isProcessing || isCompleted}
      onClick={() => onClickFn()}
    >
      {getChildrenUi()}
    </button>
  );
};

ProgressButton.propTypes = {
  id: PropTypes.string,
  size: PropTypes.oneOf[("lg", "md", "sm", "sx")],
  isProcessing: PropTypes.bool,
  isCompleted: PropTypes.bool,
  processingText: PropTypes.string,
  completedText: PropTypes.string,
  onClickFn: PropTypes.func,
  completeIcon: PropTypes.any,
  minWidth: PropTypes.string,
};

ProgressButton.defaultProps = {
  size: "lg",
  isProcessing: false,
  isCompleted: false,
  minWidth: "120px",
};
