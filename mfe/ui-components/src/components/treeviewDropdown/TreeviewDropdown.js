import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/TreeviewDropdown.module.scss";
import { ReactComponent as NoResult } from "./assets/svg/NoResult_copy.svg";
import { Button } from "../button";
import { Tooltip } from "@mui/material";
import { Required } from "../required";
import { Label } from "../label";
import { TextError } from "../textError";
import InfoIcon from "./assets/svg/info.svg";
import { KEY_CODE } from "./assets/constants/keycodeConstants";
import { styled } from "@mui/material/styles";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    display: "none !important",
  },
  "& .root": {
    maxHeight: "456px",
  },
  "& .MuiTreeItem-content": {
    padding: `9px 16px`,
    borderBottom: `1px solid var(--comp-context-menu-item-divider, #BAC5CC)`,
    borderRadius: "0",
  },
  " & .MuiTreeItem-content:hover": {
    backgroundColor: "var(--brand-color-secondary-active-yellow-3) !important",
  },
  " & .Mui-focused": {
    backgroundColor: "transparent !important",
  },
  "& .MuiTreeItem-label": {
    color: `var(--global-fonts-color-body-primary, #181818)`,
    fontSize: "14px !important",
    fontWeight: "600 !important",
    lineHeight: "18px !important",
  },
  "& .MuiCollapse-vertical": {
    paddingInlineStart: "0",
  },
  "& .MuiCollapse-wrapperInner .MuiTreeItem-content": {
    paddingLeft: "42px !important",
  },
}));

export const TreeviewDropdown = (props) => {
  const refDropdown = useRef(null);
  const listDropdown = useRef(null);
  const listContainerRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(null);
  const [storedOptions, setStoredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isEmptyOptions, setIsEmptyOptions] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isShowClearSelection, setIsShowClearSelection] = useState(false);
  const [defaultExpanded, setDefaultExpanded] = useState([]);
  const {
    id,
    width,
    label,
    onChange,
    options,
    isRequired,
    showRequiredLabel,
    size,
    errorMessage,
    error,
    clearFilterLabel,
    isSortEnable,
    emptyOptionMessage,
    tooltipText,
    noSelectedCountMessage,
    helperText,
    hidePlaceHolder,
    labelTemplate,
    isDisabled,
    isReadOnly,
    showError,
  } = props;

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    if (!optionsVisible) {
      setStoredOptions(selectedOptions);
    }
  }, [optionsVisible]);

  useEffect(() => {
    if (Array.isArray(options)) {
      let ids = options.map((e) => e.id).filter((e) => e);
      setDefaultExpanded(ids);
      setStoredOptions(getSortedOptions(options));
      setSelectedOptions(getSortedOptions(options));
      setIsShowClearSelection(!!getSelectedCount(options));
    } else {
      setIsEmptyOptions(true);
    }
  }, [options]);

  useEffect(() => {
    if (onChange) {
      onChange(selectedOptions);
    }
  }, [selectedOptions]);

  useEffect(() => {
    setDropdownWidth(
      refDropdown.current
        ? refDropdown.current.getBoundingClientRect().width
        : 0
    );
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
      setIsShowClearSelection(!!getSelectedCount(selectedOptions));

      setStoredOptions(JSON.parse(JSON.stringify(selectedOptions)));
    }

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [optionsVisible, selectedOptions]);

  const handleResize = () => {
    setDropdownWidth(
      refDropdown.current
        ? refDropdown.current.getBoundingClientRect().width
        : 0
    );
    return () => window.removeEventListener("resize", handleResize);
  };

  const getSizeStyle = () => {
    let style = {};

    switch (size) {
      case "sm":
        style = {
          padding: "5px 26px 5px 8px",
          fontSize: "var(--brand-font-size--extra-small)",
          lineHeight: "var(--brand-line-height--medium)",
          letterSpacing: "0.001em",
        };
        break;
      case "md":
        style = {
          padding: "7px 28px 7px 10px",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-line-height--large)",
        };
        break;
      case "lg":
        style = {
          padding: "9px 30px 9px 12px",
          fontSize: "var(--brand-font-size--default)",
          lineHeight: "var(--brand-line-height--m-large)",
          letterSpacing: "-0.001em",
        };
    }
    return {
      ...style,
      color: error
        ? "var(--brand-color-warning-orange-4)"
        : "var(--brand-color-text-light-slate)",
    };
  };

  const getSortedOptions = (toSortOptions) => {
    if (!isSortEnable) {
      return toSortOptions;
    }
    const sortedData = toSortOptions.sort((a, b) =>
      a.label.toUpperCase().localeCompare(b.label.toUpperCase())
    );

    // Sorting subChild if exists
    sortedData.forEach((item) => {
      if (item.subChild) {
        item?.subChild?.sort((a, b) =>
          a.label.toUpperCase().localeCompare(b.label.toUpperCase())
        );
      }
    });
    sortedData.sort((a, b) => {
      const hasChildA = a.subChild?.length ? 1 : 0;
      const hasChildB = b.subChild?.length ? 1 : 0;
      return hasChildA - hasChildB;
    });
    return sortedData;
  };

  const getSelectedCount = (dataOptions) => {
    let count = 0;
    dataOptions.forEach((e) => {
      if (e?.isChecked) {
        count++;
        if (e?.subChild?.length) {
          count = count + e.subChild.length - 1;
        }
      } else if (e?.subChild?.length) {
        count += e.subChild.filter((e) => e.isChecked).length;
      }
    });
    return count;
  };

  const getSelectValue = () => {
    if (options.length === 0) {
      return "No options available";
    }

    if (getSelectedCount(selectedOptions) === 0) {
      return hidePlaceHolder
        ? ""
        : noSelectedCountMessage
        ? noSelectedCountMessage
        : "All";
    } else {
      return getSelectedCount(selectedOptions) + " Selected";
    }
  };

  const toggleCheckStatus = (item, newCheckStatus) => ({
    ...item,
    isChecked: newCheckStatus,
    subChild:
      item.subChild?.map((subItem) => ({
        ...subItem,
        isChecked: newCheckStatus,
      })) || item.subChild,
  });

  const checkBoxEvent = (id, parentId) => {
    let selected = [...selectedOptions]; // Shallow copy to maintain immutability

    if (parentId) {
      const parentIndex = selected.findIndex((e) => e.id === parentId);
      if (parentIndex !== -1) {
        const parentOption = selected[parentIndex];
        const subChildIndex = parentOption.subChild.findIndex(
          (e) => e.id === id
        );

        if (subChildIndex !== -1) {
          // Toggle the sub-child's checked status
          parentOption.subChild[subChildIndex].isChecked =
            !parentOption.subChild[subChildIndex].isChecked;

          // Check if all sub-items are selected
          const allSubItemsChecked = parentOption.subChild.every(
            (e) => e.isChecked
          );
          parentOption.isChecked = allSubItemsChecked;
        }
      }
    } else {
      const optionIndex = selected.findIndex((e) => e.id === id);
      if (optionIndex !== -1) {
        const currentOption = selected[optionIndex];
        const newCheckStatus = !currentOption.isChecked;

        // Toggle the main option and its sub-items
        selected[optionIndex] = toggleCheckStatus(
          currentOption,
          newCheckStatus
        );
      }
    }

    setSelectedOptions(selected);
  };

  const getSelectOptionsUi = () => {
    return (
      <SimpleTreeView
        multiSelect
        disableSelection
        defaultExpandedItems={defaultExpanded}
        expansionTrigger={"iconContainer"}
        sx={{ overflowX: "hidden", flexGrow: 1, maxHeight: 456 }}
      >
        {selectedOptions.map((item) => (
          <CustomTreeItem
            itemId={item.id}
            label={
              <span
                style={{ display: "flex" }}
                onClick={(e) => {
                  checkBoxEvent(item.id);
                }}
              >
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.isChecked}
                  data-testid={`option-testid-${item.id}`}
                />
                {item.label}
              </span>
            }
          >
            {item?.subChild?.length &&
              item.subChild.map((sub) => (
                <CustomTreeItem
                  itemId={sub.id}
                  label={
                    <span style={{ display: "flex" }}>
                      <input
                        type="checkbox"
                        id={sub.label}
                        onChange={(e) => {
                          checkBoxEvent(sub.id, item.id);
                        }}
                        checked={sub.isChecked}
                        data-testid={`subOption-testid-${sub.id}`}
                      />
                      {sub.label}
                    </span>
                  }
                />
              ))}
          </CustomTreeItem>
        ))}
      </SimpleTreeView>
    );
  };

  const getDropdownHeight = () => {
    let style = {};

    switch (size) {
      case "sm":
        style = {
          height: "2.6rem",
        };
        break;
      case "md":
        style = {
          height: "3.2rem",
        };
        break;
      case "lg":
        style = {
          height: "3.8rem",
        };
    }
    return style;
  };
  const getMenuItemSizeStyle = () => {
    let style = {};

    switch (size) {
      case "sm":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--extra-small)",
          lineHeight: "var(--brand-line-height--medium)",
          letterSpacing: " 0.001em",
        };
        break;
      case "md":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-line-height--large)",
        };
        break;
      case "lg":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--default)",
          lineHeight: "var(--brand-line-height--m-large)",
        };
    }
    return {
      ...style,
    };
  };
  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `helpertext-${id} `;
    }
    if (errorMessage) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  const getEmptyOptionsUi = () => {
    return (
      <ul className={styles.emptyMenuContainer}>
        <li
          className={styles.emptyMenuItem}
          tabIndex={0}
          key={id + "-opt-empty"}
          style={{
            ...getMenuItemSizeStyle(),
          }}
          onClick={() => setOptionsVisible(false)}
        >
          <NoResult className={styles.emptyMenuIcon} />
          <span className={styles.emptyMenuItemMessage}>
            {emptyOptionMessage}
          </span>
        </li>
      </ul>
    );
  };

  const clearAll = () => {
    let selected = JSON.parse(JSON.stringify(selectedOptions));
    selected.forEach((e, i) => {
      selected[i].isChecked = false;
      e?.subChild?.forEach((ele, j) => {
        selected[i].subChild[j].isChecked = false;
      });
    });
    setSelectedOptions(selected);
  };

  return (
    <div ref={refDropdown} style={{ position: "relative" }}>
      {label && (
        <Label
          id={"dropdown-label-" + id}
          htmlFor={"dropdown-" + id}
          labelTemplate={labelTemplate}
          data-testid={"dropdown-label-testid-" + id}
          className={`${styles.label}  ${styles["size-" + size]} ${
            showRequiredLabel ? styles.dFlex : ""
          }`}
        >
          {label}

          {isRequired && <Required isLegend={showRequiredLabel} />}

          {tooltipText && (
            <Tooltip body={tooltipText} placement="top">
              <span aria-label="information" className={`${styles.ml4}`}>
                <InfoIcon />
              </span>
            </Tooltip>
          )}
        </Label>
      )}
      {helperText && (
        <p
          id={"helpertext-" + id}
          data-testid={"dropdown-label-testid-" + id}
          className={styles.helperTextLabel}
        >
          {helperText}
        </p>
      )}

      <div
        className={`${styles.customMuiSelect} ${
          optionsVisible ? styles.active : ""
        } ${styles.hasValue} ${!error ? "" : styles.hasError} ${
          isEmptyOptions ? styles.emptyOptions : ""
        } ${optionsVisible ? styles.selectLabelBlack : ""}
        ${isDisabled ? styles.disabled : ""}
        ${
          options?.length
            ? styles.hasValueEregSelectedOptions
            : styles.hasValueEreg
        }`}
        tabIndex={0}
        role={isDisabled || isReadOnly ? "" : "button"}
        style={{
          width: width,
          ...getDropdownHeight(),
        }}
        onClick={() =>
          isDisabled || isReadOnly ? null : setOptionsVisible(!optionsVisible)
        }
        data-testid={"dropdown-testid-" + id}
        aria-labelledby={"dropdown-label-" + id}
        aria-describedby={getAriaDescribedBy()}
        aria-invalid={!!errorMessage}
        onKeyDown={(e) => {
          if (!isDisabled && !isReadOnly && e.key === KEY_CODE.SPACE)
            e.preventDefault();
          if (
            !isDisabled &&
            !isReadOnly &&
            (e.key === KEY_CODE.ENTER || e.key === KEY_CODE.SPACE)
          ) {
            setOptionsVisible(!optionsVisible);
          }
        }}
        ref={listContainerRef}
      >
        <div
          className={`${styles.selectLabel}`}
          style={{ ...getSizeStyle() }}
          id={
            getSelectedCount(selectedOptions) + label
              ? label
              : `${"label-" + id}`
          }
        >
          {getSelectValue()}
        </div>
        <div className={`${styles.selectSvgIcon}`}>
          {optionsVisible ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M9.76548 7.917L5.71298 1.22117C5.63875 1.09852 5.53413 0.997103 5.40924 0.926711C5.28435 0.856319 5.14342 0.819336 5.00006 0.819336C4.8567 0.819336 4.71577 0.856319 4.59088 0.926711C4.46599 0.997103 4.36138 1.09852 4.28714 1.22117L0.234644 7.917C0.158207 8.04339 0.116736 8.18782 0.114477 8.33551C0.112219 8.48319 0.149254 8.62883 0.22179 8.75749C0.294327 8.88616 0.399757 8.99324 0.527286 9.06775C0.654814 9.14227 0.799857 9.18156 0.94756 9.18158H9.05256C9.20026 9.18156 9.34531 9.14227 9.47284 9.06775C9.60036 8.99324 9.70579 8.88616 9.77833 8.75749C9.85087 8.62883 9.8879 8.48319 9.88564 8.33551C9.88338 8.18782 9.84191 8.04339 9.76548 7.917Z"
                  fill={
                    isDisabled ? "#CBCED2" : isReadOnly ? "#627386" : "#181818"
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
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.77833 1.24338C9.70579 1.11469 9.60036 1.00759 9.47282 0.933061C9.34527 0.858528 9.20021 0.819237 9.05249 0.819214H0.947492C0.799851 0.819286 0.654879 0.85858 0.527411 0.933078C0.399942 1.00758 0.294555 1.1146 0.222031 1.2432C0.149507 1.3718 0.112452 1.51736 0.114656 1.66499C0.11686 1.81261 0.158245 1.957 0.234575 2.08338L4.28707 8.77921C4.36131 8.90186 4.46592 9.00328 4.59081 9.07367C4.7157 9.14406 4.85663 9.18105 4.99999 9.18105C5.14335 9.18105 5.28429 9.14406 5.40917 9.07367C5.53406 9.00328 5.63868 8.90186 5.71291 8.77921L9.76541 2.08338C9.84176 1.95706 9.88319 1.81272 9.88546 1.66513C9.88773 1.51754 9.85076 1.37199 9.77833 1.24338Z"
                fill={
                  isDisabled
                    ? "#CBCED2"
                    : isReadOnly || isEmptyOptions
                    ? "#627386"
                    : "#181818"
                }
              />
            </svg>
          )}
        </div>
      </div>

      {errorMessage && showError && (
        <TextError
          errorMessage={errorMessage}
          size={size}
          id={id}
          data-testid={"error-testid-" + id}
        />
      )}

      {optionsVisible && (
        <div
          ref={listDropdown}
          className={`${styles.selectOptionsContainer}`}
          style={{
            minWidth: isEmptyOptions || options.length === 0 ? "auto" : "180px",
            width:
              isEmptyOptions || options.length === 0
                ? "100%"
                : dropdownWidth
                ? "none"
                : "",
            width: isEmptyOptions
              ? "none"
              : options.length === 0
              ? "100%"
              : "244px",
            maxHeight: isEmptyOptions
              ? "none"
              : options.length === 0
              ? "fit-content"
              : "",
          }}
          data-testid={"options-testid-" + id}
        >
          {options.length === 0 && getEmptyOptionsUi()}

          <div>
            {isShowClearSelection &&
              !isEmptyOptions &&
              getSelectedCount(storedOptions) > 0 && (
                <div
                  data-testid={"clearAll-testid-" + id}
                  className={styles.clearButton}
                  style={{
                    marginTop: "0px",
                  }}
                >
                  <Button
                    textButton={true}
                    size={"md"}
                    onClick={clearAll}
                    label={clearFilterLabel}
                    dataTestId={"clear-all-filter"}
                    textTransform={"none"}
                  ></Button>
                </div>
              )}

            {isShowClearSelection && !isEmptyOptions && (
              <div className={styles.divider} />
            )}
          </div>

          <div>{getSelectOptionsUi()}</div>
        </div>
      )}
    </div>
  );
};

TreeviewDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  showRequiredLabel: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  size: PropTypes.oneOf(["lg", "md", "sm"]).isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  clearFilterLabel: PropTypes.string,
  width: PropTypes.string,
  emptyOptionMessage: PropTypes.string,
  helperText: PropTypes.string,
  noSelectedCountMessage: PropTypes.string,
  hidePlaceHolder: PropTypes.bool,
  labelTemplate: PropTypes.string,
  tooltipText: PropTypes.any,
  showError: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
};

TreeviewDropdown.defaultProps = {
  isRequired: false,
  showRequiredLabel: false,
  size: "lg",
  clearFilterLabel: "Clear Selection",
  width: "100%",
  isSortEnable: true,
  emptyOptionMessage: "No data to display",
  tooltipText: "",
  noSelectedCountMessage: "",
  helperText: "",
  hidePlaceHolder: false,
  labelTemplate: "default",
  showError: true,
  isDisabled: false,
  isReadOnly: false,
};
