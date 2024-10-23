import React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CommonUtils } from "../../common/utils";
import styles from "./assets/Stepper.module.scss";

export const Stepper = (props) => {
  const {
    stepHeaders,
    activeIndex,
    isCompleted,
    isShowDefaultIcon,
    labelPosition,
    mobileLabel,
    dividerText,
    mobileView,
    mobileViewCount,
  } = props;

  const [localActiveIndex, setLocalActiveIndex] = useState(activeIndex);

  useEffect(() => {
    if (isCompleted) {
      setLocalActiveIndex(stepHeaders.length);
    }
  }, []);

  useEffect(() => {
    setLocalActiveIndex(activeIndex);
  }, [activeIndex]);

  const renderStepperIndicator = (index) => {
    if (isShowDefaultIcon) {
      return (
        <div
          className={`${
            isCompleted || index < localActiveIndex
              ? styles.step_indicator_defaultCompletedIcon
              : index === localActiveIndex
              ? styles.step_indicator_defaultActiveIcon
              : styles.step_indicator_defaultIcon
          }`}
          style={{
            margin: labelPosition === "right" ? "0px 8px 0px 0px" : "0px",
          }}
        />
      );
    }

    if (typeof stepHeaders[index - 1].icon !== "undefined") {
      return (
        <div
          className={styles.step_indicator_defaultIcon}
          style={{ backgroundColor: "transparent" }}
        >
          {stepHeaders[index - 1].icon}
        </div>
      );
    }

    return (
      <div
        style={{
          width: "16px",
          height: "16px",
          borderBottomWidth: "3px",
          borderBottomColor: "transparent",
        }}
      />
    );
  };

  const renderStepperMenu = () => {
    if (!CommonUtils.isNonEmptyArray(stepHeaders)) {
      return null;
    }

    return stepHeaders.map((step, index) => {
      if (labelPosition !== "right") {
        return (
          <li
            key={"stepperMenu" + index}
            className={`${styles.stepItem} ${
              index === stepHeaders.length - 1 ? styles.stepItemLast : ""
            }`}
          >
            <div className={styles.stepsItemContainer} data-testid="step">
              <span className="sr-only">
                {index === activeIndex - 1
                  ? "Current"
                  : index < localActiveIndex
                  ? "Completed"
                  : ""}
              </span>
              {index !== stepHeaders.length - 1 && (
                <div
                  className={`${styles.stepsItemTail}`}
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--brand-color-primary-background)"
                      : index < localActiveIndex - 1
                      ? "var(--brand-color-primary-background)"
                      : "var(--brand-color-grey-scale-cool-1)",
                  }}
                ></div>
              )}
              <div className={styles.stepsItemIcon}>
                <div className={styles.step_indicator_container}>
                  {renderStepperIndicator(index + 1)}
                </div>
              </div>
              <div className={styles.stepsItemContent}>
                <div
                  className={styles.stepsItemTitle}
                  data-testid={"stepper-item-" + step.label}
                >
                  {step.label}
                </div>
              </div>
            </div>
          </li>
        );
      } else {
        return (
          <li
            key={"stepperMenu" + index}
            className={`${styles.stepItem} ${
              index === stepHeaders.length - 1 ? styles.stepItemLast : ""
            }`}
          >
            <div
              className={styles.stepsItemContainer}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span className="sr-only">
                {index === activeIndex - 1
                  ? "Current"
                  : index < localActiveIndex
                  ? "Completed"
                  : ""}
              </span>
              <div
                className={styles.stepsItemIcon}
                style={{ marginLeft: index === 0 ? "0px" : "8px" }}
              >
                <div className={styles.step_indicator_container}>
                  {renderStepperIndicator(index + 1)}
                </div>
              </div>
              <div
                className={styles.stepsItemContent}
                style={{ marginTop: "0px" }}
              >
                <div
                  className={styles.stepsItemTitle}
                  data-testid={"stepper-item-" + step.label}
                >
                  {step.label}
                </div>
              </div>
              {index !== stepHeaders.length - 1 && (
                <div
                  className={`${styles.stepsItemTail}`}
                  style={{
                    display: "flex",
                    position: "unset",
                    marginLeft: "8px",
                    backgroundColor: isCompleted
                      ? "var(--brand-color-primary-background)"
                      : index < localActiveIndex - 1
                      ? "var(--brand-color-primary-background)"
                      : "var(--brand-color-grey-scale-cool-1)",
                  }}
                ></div>
              )}
            </div>
          </li>
        );
      }
    });
  };

  const renderMobileUi = () => {
    let steps = stepHeaders.length;
    return (
      <div className={styles.xsview} data-testid="stepper-mobile-ui">
        <div>
          <span
            className={styles.xsviewHeader}
          >{`${mobileLabel} - ${localActiveIndex} ${dividerText} ${steps}`}</span>
        </div>
        {mobileViewCount ? (
          <div className={styles.xsviewLabel}>{`${
            stepHeaders[localActiveIndex - 1]?.label
          }`}</div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <>
      {mobileView ? (
        <div>{renderMobileUi()}</div>
      ) : (
        <>
          <div className="d-none d-md-block" data-testid="stepper-menu">
            <nav aria-label="step">
              <ol className={styles.stepContainer}>{renderStepperMenu()}</ol>
            </nav>
          </div>
          <div className="d-md-none">{renderMobileUi()}</div>
        </>
      )}
    </>
  );
};

Stepper.propTypes = {
  stepHeaders: PropTypes.any.isRequired, // it should be array of objects with 'label' as a key
  activeIndex: PropTypes.number.isRequired,
  isCompleted: PropTypes.bool,
  isShowDefaultIcon: PropTypes.bool, // is should be false if you want use custom indicator icon, and add 'icon' key and element as a value with 'label' in stepHeadres array
  labelPosition: PropTypes.oneOf(["default", "right"]),
  mobileLabel: PropTypes.string,
  dividerText: PropTypes.string,
  mobileView: PropTypes.bool, //force enable mobile view
  mobileViewCount: PropTypes.bool, //Enable/Disable the step count in mobile view
};

Stepper.defaultProps = {
  isCompleted: false,
  isShowDefaultIcon: true,
  labelPosition: "default",
  mobileView: false,
  mobileViewCount: true,
};
