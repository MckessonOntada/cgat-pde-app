import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CommonUtils } from "../../common/utils/CommonUtils";
import styles from "./assets/styles/AutoSelectDropdown.module.scss";
import { ReactComponent as DropdownIcon } from "./assets/svg/dropdown_arrow_down.svg";
import { ReactComponent as WarningIcon } from "../../../src/assets/svg/warningIcon.svg";
import { usePopper } from "react-popper";
import { Required } from "../required";
import { Label } from "../label";
import {TextError } from "../textError";

const onClickOutside = (handler) => {
  let autoSuggestRef = useRef();
  useEffect(() => {
    let callback = (event) => {
      if (!autoSuggestRef.current.contains(event.target)) {
        handler([]);
      }
    };
    document.addEventListener("mousedown", callback);

    return () => {
      document.removeEventListener("mousedown", callback);
    };
  });
  return autoSuggestRef;
};

export const AutoSuggestDropdown = (props) => {
  const [searchText, setSearchText] = useState();
  const [searchBoxContainerActive, setSearchBoxContainerActive] =
    useState(false);

  const [isShowSuggestionList, setIsShowSuggestionList] = useState(false);
  const [isEditingStarted, setIsEditingStarted] = useState(false);

  const [referenceEl, setReferenceEl] = useState(null);
  const [popperEl, setPopperEl] = useState(null);

  const { styles: popperStyle, attributes } = usePopper(referenceEl, popperEl, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  const {
    selectedVal,
    size,
    suggestionList,
    onChangeInput,
    refineFilterMessage,
    placeHolder,
    suggestionListContainerWidth,
    suggestionListContainerHeight,
    outline,
    activateFocus,
    getselectedValue,
    disableInput,
    isDisabled,
    optionPosition,
    isShowRefineQueryMessage,
    jestTestData,
    isSortEnable,
    valueToMoveToLast,
    valueToMoveToTop,
    eregVariant,
    label,
    isRequired,
    helperText,
    labelTemplate,
    errorMessage,
    error,
    showError
  } = props;

  useEffect(() => {
    setSearchText(selectedVal);
    if (jestTestData?.searchText) {
      setSearchText(jestTestData?.searchText);
      setIsShowSuggestionList(true);
    }
  }, []);

  useEffect(() => {
    if (isShowSuggestionList) {
      showTooltip();
    } else {
      hideTooltip();
    }
  }, [isShowSuggestionList]);

  const showTooltip = () => {
    if (popperEl) {
      popperEl.setAttribute("data-show", true);
    }
  };

  const hideTooltip = () => {
    if (popperEl) {
      popperEl.removeAttribute("data-show");
    }
  };

  const computeSize = () => {
    let inputSize = styles.sizeLg;
    switch (size) {
      case "lg":
        inputSize = styles.sizeLg;
        break;
      case "md":
        inputSize = styles.sizeMd;
        break;
      case "sm":
        inputSize = styles.sizeSm;
        break;
      default:
        break;
    }
    return inputSize;
  };

  const getSelectedValueData = (option) => {
    setSearchText(() => "");
    onInputChange(eregVariant ? option.value : "");
    getselectedValue(option);
    setIsShowSuggestionList((isShowSuggestionList) => !isShowSuggestionList);
    setSearchBoxContainerActive(false);
  };

  let eleRef = onClickOutside(() => {
    setIsShowSuggestionList(false);
    setSearchBoxContainerActive(false);
    setIsEditingStarted(false);
  });

  const filteredOptions = (options) => {
    if (CommonUtils.isNonEmptyArray(options)) {
      if (suggestionList.length > 10 && isEditingStarted) {
        return getSortedOptions(
          options,
          valueToMoveToLast,
          valueToMoveToTop
        ).filter((option) =>
          option.label?.toLowerCase().includes(searchText?.toLowerCase())
        );
      }

      return getSortedOptions(options, valueToMoveToLast, valueToMoveToTop);
    }

    return [];
  };

  const getSortedOptions = (
    toSortOptions,
    valueToMoveToLast,
    valueToMoveToTop
  ) => {
    if (!isSortEnable) {
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
      const nameA = a.label?.toUpperCase(); // ignore upper and lowercase
      const nameB = b.label?.toUpperCase(); // ignore upper and lowercase

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

  const getListUI = (value, i) => {
    return (
      <li
        key={"key" + i}
        className={`${styles.suggestionList} ${
          getDisplayValue() &&
          getDisplayValue().toLowerCase() === value.label.toLowerCase()
            ? styles.dropdownColor
            : ""
        } `}
        id={"suggestionListContainer-item" + i}
        tabIndex={i}
        onClick={() => {
          getSelectedValueData(value);
        }}
        data-testid={"suggestion-list-item"}
      >
        {value.label}
      </li>
    );
  };

  const getSuggestionListUI = () => {
    if (isShowSuggestionList) {
      return (
        <ul
          id={"suggestionListContainer"}
          className={`${styles.suggestionListContainer} ${
            optionPosition === "top" && styles.shiftOptions
          }`}
          style={{
            ...popperStyle.popper,
            width: suggestionListContainerWidth,
            height: suggestionListContainerHeight,
            left: "10px",
          }}
          data-testid="suggestionListContainer"
          ref={setPopperEl}
          {...attributes.popper}
        >
          {CommonUtils.isNonEmptyArray(filteredOptions(suggestionList)) ? (
            eregVariant ? (
              filteredOptions(suggestionList).map((value, i) => {
                return getListUI(value, i);
              })
            ) : (
              filteredOptions(suggestionList)
                .slice(0, 20)
                .map((value, i) => {
                  return getListUI(value, i);
                })
            )
          ) : (
            <li className={`${styles.suggestionList}`}>No Result Found!</li>
          )}
          {isShowRefineQueryMessage && getRefineFilterUi()}
        </ul>
      );
    }
  };

  const onDropDownClick = () => {
    setSearchBoxContainerActive(true);
    setIsShowSuggestionList(!isShowSuggestionList);
    setIsEditingStarted(false);
  };

  const getAutoSuggestionStyles = () => {
    let autoSuggestStyle;

    if (outline && !isDisabled) {
      autoSuggestStyle = `${autoSuggestStyle} ${
        styles.searchBoxContainerOutlined
      } 
       ${eregVariant ? styles.searchBoxContainerOutlineEregBorder : ""}`;
    }

    if (activateFocus && searchBoxContainerActive) {
      autoSuggestStyle = `${autoSuggestStyle} ${styles.outlinedSearchBoxActive}`;
    }

    return autoSuggestStyle;
  };

  const onInputChange = (event) => {
    setSearchText(event);
    onChangeInput(event);
    setIsShowSuggestionList(true);
  };

  const getRefineFilterUi = () => {
    return (
      <li className={`${styles.refineMessage}`}>
        <span>{refineFilterMessage}</span>
      </li>
    );
  };

  const getDisplayValue = () => {
    if (searchText) return searchText;
    return "";
  };

  let active = -1;

  const handleKeyUpDown = (event) => {
    let autoSuggestDrpDwn = document.getElementById("suggestionListContainer");
    if (autoSuggestDrpDwn) {
      let autoSuggestDrpDwnItems = autoSuggestDrpDwn.children;
      if (event.keyCode == 40) {
        if (active <= autoSuggestDrpDwnItems.length - 1) {
          if (active == autoSuggestDrpDwnItems.length - 1) {
            active = -1;
          }
          active++;
          autoSuggestDrpDwnItems[active].focus();
        }
      } else if (event.keyCode == 38) {
        if (active > 0) {
          active--;
          autoSuggestDrpDwnItems[active].focus();
        }
      } else if (
        active != -1 &&
        suggestionList &&
        suggestionList.length > 0 &&
        suggestionList.length > active &&
        event.keyCode == 13
      ) {
        getSelectedValueData(suggestionList[active]);
      }
      if (active != -1) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };
  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `helpertext `;
    }
    if (errorMessage) {
      describedBy += `autosuggestdropdown-error`;
    }
    return describedBy.trim();
  };

  return (
    <div
      ref={eleRef}
      onKeyDown={handleKeyUpDown}
      data-testid="dropdown-container"
    >
      {label && (
        <Label
          className={`${styles.label}`}
          labelTemplate={labelTemplate}
          htmlFor={"autosuggestInput"}
        >
          {label}
          {isRequired && <Required />}
        </Label>
      )}

      {helperText && (
        <p className={styles.helperTextLabel} id={"helpertext"}>
          {helperText}
        </p>
      )}
      <div
        className={`${getAutoSuggestionStyles()} ${error && styles.hasError} ${
          styles.searchBoxContainer
        } ${computeSize()}`}
        onFocus={() => {
          setSearchBoxContainerActive(true);
        }}
        onBlur={() => {
          setSearchBoxContainerActive(false);
        }}
        onClick={() => {
          isDisabled ? null : onDropDownClick();
        }}
      >
        <input
          id="autosuggestInput"
          ref={setReferenceEl}
          type="text"
          aria-describedby={getAriaDescribedBy()}
          placeholder={placeHolder}
          value={getDisplayValue()}
          name="searchTerm"
          onChange={(e) => {
            onInputChange(e.target.value);
            setIsEditingStarted(true);
          }}
          autoComplete="off"
          readOnly={disableInput}
          className={`${styles.searchBox} ${
            eregVariant ? styles.dropDownPaddingEreg : styles.dropDownPadding
          }
          ${eregVariant ? styles.searchBoxEregFont : ""}`}
          disabled={isDisabled}
          data-testid={"search-input"}
        />

        <div
          className={`${styles.dropDownIcon} ${
            isDisabled && styles.disableIcon
          }`}
        >
          <DropdownIcon
            className={`${isShowSuggestionList ? styles.dropdownLight : ""} ${
              isDisabled ? styles.dropdownDisabled : ""
            } ${styles.dropDownSvg}  ${
              eregVariant ? styles.dropDownSvgAlign : ""
            }`}
          />
        </div>
      </div>

      <div className={`${styles.suggestionListCParentontainer}`}>
        {getSuggestionListUI()}
      </div>

      {errorMessage && showError && (
        <TextError
          errorMessage={errorMessage}
          showErrorIcon
          id={"autosuggestdropdown"}
        />
      )}
    </div>
  );
};

AutoSuggestDropdown.propTypes = {
  placeHolder: PropTypes.string,
  getSelectedValueData: PropTypes.func.isRequired,
  activateFocus: PropTypes.bool,
  outline: PropTypes.bool,
  size: PropTypes.string,
  refineFilterMessage: PropTypes.string,
  suggestionListContainerWidth: PropTypes.string,
  suggestionListContainerHeight: PropTypes.string,
  isShowRefineQueryMessage: PropTypes.bool,
  getselectedValue: PropTypes.bool,
  disableInput: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSortEnable: PropTypes.bool,
  valueToMoveToLast: PropTypes.string,
  valueToMoveToTop: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  labelTemplate: PropTypes.string,
  errorMessage: PropTypes.string,
  error: PropTypes.bool,
  showError: PropTypes.bool
};

AutoSuggestDropdown.defaultProps = {
  activateFocus: true,
  size: "md",
  chLength: 1,
  outline: true,
  refineFilterMessage: "More records exist. Please refine your query.",
  suggestionListContainerWidth: "360px",
  suggestionListContainerHeight: "auto",
  disbledInput: false,
  isDisabled: false,
  isSortEnable: true,
  valueToMoveToTop: "",
  valueToMoveToLast: "",
  eregVariant: false,
  label: "",
  isRequired: false,
  helperText: "",
  labelTemplate: "default",
  error: false,
  showError: true
};
