import React, { useState, useEffect } from "react";
import styles from "./assets/styles/AutoSuggestSearch.module.scss";
import PropTypes from "prop-types";
import { useRef } from "react";
import NORESULTFOUND from "./constants/AutoSuggestSearchConstant.js";
import { ReactComponent as CloseIcon } from "./assets/svg/removeCircle.svg";
import { ReactComponent as SearchIcon } from "./assets/svg/search.svg";
import { ReactComponent as InfoIcon } from "./assets/svg/info.svg";
import { CommonUtils } from "../../common/utils/CommonUtils";
import { Tooltip } from "../tooltip";
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

export const AutoSuggestSearch = (props) => {
  const [autoSuggestionList, setautoSuggestionList] = useState([]);
  const [isFreeTextSelected, setIsFreeTextSelected] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = React.useState(false);

  const [searchBoxContainerActive, setSearchBoxContainerActive] =
    useState(false);
  const {
    suggestionList,
    onChangeInput,
    chLength,
    refineFilterMessage,
    placeHolder,
    suggestionListContainerWidth,
    isShowRefineQueryMessage,
    id,
    label,
    isRequired,
    tooltipText,
    extSearchText,
    jestTestData,
    addFreeText,
    onInputFocus,
    clearSearchOnBlur,
    helperText,
    labelTemplate,
    responsiveContainer,
    enableKeyDownEvent,
    handleKeyDownEvent,
    errorMessage,
    error,
    removeListSpacing,
    showError,
    checkSearchInputFocusedState,
    getSearchText,
    showListOnFocus,
    maxLength,
  } = props;

  useEffect(() => {
    if (jestTestData?.searchText) {
      setSearchText(jestTestData?.searchText);
    }
    if (jestTestData?.autoSuggestionList) {
      setautoSuggestionList(jestTestData?.autoSuggestionList);
    }
  }, [jestTestData]);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  useEffect(() => {
    if (extSearchText !== null && extSearchText?.length === 0) {
      setSearchText("");
      setautoSuggestionList([]);
    } else if (addFreeText) {
      if (CommonUtils.isNonEmptyString(extSearchText)) {
        let finalString = "";
        let fixString = "EXXACT";
        if (extSearchText.startsWith(fixString)) {
          setIsFreeTextSelected(true);
          finalString = extSearchText.substring(fixString.length);
          setSearchText("" + finalString);
        }
      }
    }
  }, [extSearchText]);

  useEffect(() => {
    if (searchText.length >= chLength || showListOnFocus) {
      let filterval = props.suggestionList;
      let dupfilterval = [];
      if (filterval && filterval.length > 0) {
        filterval.forEach((element) => {
          if (element) {
            dupfilterval.push(element);
          }
        });
      } else {
        if (!addFreeText) {
          dupfilterval.push({
            label: NORESULTFOUND,
            value: "noResultUi",
          });
        }
      }
      setautoSuggestionList(dupfilterval);
    } else {
      setautoSuggestionList([]);
    }
  }, [suggestionList]);

  const onInputChange = (event) => {
    if (CommonUtils.isNonEmptyString(event)) {
      let searchText = event;
      setSearchText(searchText);
      if (searchText.length >= props.chLength ? props.chLength : 1) {
        onChangeInput(searchText);
      }
      setIsFreeTextSelected(false);
    } else {
      setSearchText(event);
      onChangeInput(event);
    }
  };

  const getSelectedValueData = (value) => {
    checkSearchInputFocusedState && onBlur();
    if (value && value.value != "noResultUi") {
      let selectedText = value.label;
      props.getSelectedValueData(value);
      setSearchText(selectedText);
    }
    setautoSuggestionList([]);
    setIsFreeTextSelected(true);
  };

  let eleRef = onClickOutside(() => {
    setautoSuggestionList([]);
    checkSearchInputFocusedState && onBlur();
    if (!isFreeTextSelected) {
      setIsFreeTextSelected(false);
      if (clearSearchOnBlur) {
        setSearchText("");
      }
    }
  });
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
        autoSuggestionList &&
        autoSuggestionList.length > 0 &&
        autoSuggestionList.length > active &&
        event.keyCode == 13
      ) {
        getSelectedValueData(autoSuggestionList[active]);
      }
      if (active != -1) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  const computeSize = () => {
    let inputSize = styles.sizeLg;
    switch (props.size) {
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

  const renderLabel = (value) => {
    //  TODO: Highlight search text in option is not working. Commenting this code for now

    // let label = value.label;
    // let label2 = value.label;
    // let newText = label.split(searchText);

    return <>{value.label}</>;
    // if (typeof searchText === 'string') {
    //       let searchValue = searchText.replace(
    //         /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
    //         '\\$&',
    //       );
    //
    //     return label.replace(
    //       new RegExp(searchValue, 'gim'),
    //       `<mark class="text-highlight">$&</mark>`,
    //     );
    //   }
    // }

    //   if (CommonUtils.isNonEmptyString(searchText) && searchText.length >= chLength) {
    //     if (label.toLowerCase().includes(searchText)) {
    //       return (
    //         <>
    //           {newText[0]}
    //           <span style={{ fontWeight: 700 }}>{searchText}</span>
    //           {newText[1]}
    //         </>
    //       );
    //     }
    //     return <>{value.label}</>;
    //   } else {
    //     return <>{value.label}</>;
    //   }
  };

  const onCloseIconClick = () => {
    onInputChange("");
    setautoSuggestionList([]);
  };

  const getSuggestionListUI = () => {
    if (
      getSearchInputFocusState() &&
      ((autoSuggestionList &&
        autoSuggestionList.length > 0 &&
        (searchText.length >= chLength || showListOnFocus)) ||
        (searchText.length >= chLength && addFreeText && !isFreeTextSelected))
    ) {
      return (
        <ul
          id={"suggestionListContainer"}
          className={`${styles.suggestionListContainer} ${
            label ? styles.modifiedsuggestionListContainer : ""
          } ${addFreeText ? styles.addFreeText : ""} ${
            removeListSpacing && styles.suggestionListContainerAdd
          }`}
          style={{
            width: suggestionListContainerWidth,
          }}
        >
          {getFreeTextUi()}
          {autoSuggestionList.map((value, i) => {
            return (
              <li
                className={`${styles.suggestionList}`}
                id={"suggestionListContainer-item" + i}
                tabIndex={i}
                onClick={() => {
                  getSelectedValueData(value);
                }}
                data-testid={"suggestion-list-item"}
              >
                <div>{renderLabel(value)}</div>
              </li>
            );
          })}
          {getRefineFilterUi()}
        </ul>
      );
    }
  };

  const getSearchInputFocusState = () => {
    return checkSearchInputFocusedState ? focused : true;
  };

  const getRefineFilterUi = () => {
    if (addFreeText) {
      return null;
    }
    if (
      CommonUtils.isNonEmptyArray(suggestionList) &&
      isShowRefineQueryMessage
    ) {
      return (
        <li className={`${styles.refineMessage}`}>
          <span>{refineFilterMessage}</span>
        </li>
      );
    }
  };

  const getFreeTextUi = () => {
    if (!addFreeText || !getSearchInputFocusState()) {
      return null;
    }

    if (searchText.length < 2) {
      return null;
    }

    return (
      <li
        className={`${styles.suggestionList} ${styles.freeTextBorder} `}
        id={"suggestionListContainer-item-free-text"}
        onClick={() => {
          getSelectedValueData({
            label: searchText,
            value: searchText,
            isFreeText: true,
          });
        }}
        data-testid={"suggestion-list-item"}
      >
        <span className={styles.freeTextContainer}>
          <span className={styles.addOther}>Add Other</span>
          <span className={styles.addValue}>"{searchText}"</span>
        </span>
      </li>
    );
  };

  let tooltipUI = null;
  if (tooltipText) {
    tooltipUI = (
      <Tooltip
        body={tooltipText}
        key={"autoSuggestSearch-tooltip-" + id}
        placement="top"
      >
        <span aria-label="information" className={styles.tooltip}>
          <InfoIcon />
        </span>
      </Tooltip>
    );
  }

  return (
    <div>
      {label && (
        <div
          className={styles.labelContainer}
          style={{ justifyContent: addFreeText ? "space-between" : "start" }}
        >
          <Label
            htmlFor={"autoSuggestSearch-" + id}
            data-testid={"label-testid-" + id}
            labelTemplate={labelTemplate}
          >
            {label}
            {isRequired && <Required id={id} />}
            {addFreeText && tooltipUI}
          </Label>
        </div>
      )}
      {helperText && (
        <p
          id={"helpertext-" + id}
          data-testid={"label-testid-" + id}
          className={styles.helperTextLabel}
        >
          {helperText}
        </p>
      )}

      <div ref={eleRef} onKeyDown={handleKeyUpDown}>
        <div
          className={`${styles.autoSuggestSearchContainer} ${
            label ? `${styles.modifiedContainer}` : ""
          }`}
          data-testid={"autoSuggestSearchContainer"}
        >
          <div
            className={`${styles.searchBoxContainer} ${
              responsiveContainer ? styles.responsiveContainer : ""
            } ${label ? styles.modifiedsearchBoxContainer : ""} ${
              props.outline ? styles.searchBoxContainerOutlined : ""
            } ${
              props.activateFocus && searchBoxContainerActive
                ? props.outline
                  ? styles.outlinedSearchBoxActive
                  : styles.searchBoxContainerActive
                : ""
            } ${computeSize()} ${
              !CommonUtils.isNonEmptyString(searchText) &&
              `${!label ? `${styles.searchBoxBgColor}` : ""}`
            }  ${error && styles.hasError}`}
            onFocus={() => {
              setSearchBoxContainerActive(true);
            }}
            onBlur={() => {
              setSearchBoxContainerActive(false);
            }}
            data-testid={"searchBoxContainer"}
          >
            <div className={`${styles.iconStyle}`}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={placeHolder}
              id={"autoSuggestSearch-" + id}
              value={searchText}
              aria-describedby={"helpertext-" + id}
              onChange={(e) => onInputChange(e.target.value)}
              className={`${styles.searchBox}`}
              data-testid={"search-input"}
              onFocus={(e) => {
                if (onInputFocus) {
                  if (addFreeText) {
                    setTimeout(() => {
                      setIsFreeTextSelected(false);
                    }, 500);
                  }
                  if (getSearchText) {
                    onInputFocus(e.target.value);
                  } else {
                    onInputFocus();
                  }
                  checkSearchInputFocusedState && onFocus();
                }
              }}
              onKeyDown={(e) => {
                if (enableKeyDownEvent) {
                  handleKeyDownEvent(e);
                  setautoSuggestionList([]);
                }
              }}
              maxLength={maxLength ? maxLength.toString() : ""}
            />
            {CommonUtils.isNonEmptyString(searchText) && (
              <div
                className={`${styles.closeIcon}`}
                onClick={() => onCloseIconClick()}
                data-testid={"close-icon"}
              >
                <CloseIcon />
              </div>
            )}
          </div>
          <div
            className={`${styles.suggestionListCParentontainer} ${
              removeListSpacing && styles.removeListSpacing
            }`}
          >
            {getSuggestionListUI()}
          </div>
        </div>
      </div>
      {errorMessage && showError && (
        <TextError
          errorMessage={errorMessage}
          showErrorIcon
          id={"autosuggestsearch"}
        />
      )}
    </div>
  );
};

AutoSuggestSearch.propTypes = {
  placeHolder: PropTypes.string,
  getSelectedValueData: PropTypes.func.isRequired,
  activateFocus: PropTypes.bool,
  outline: PropTypes.bool,
  size: PropTypes.string,
  refineFilterMessage: PropTypes.string,
  suggestionListContainerWidth: PropTypes.string,
  isShowRefineQueryMessage: PropTypes.bool,
  addFreeText: PropTypes.bool,
  onInputFocus: PropTypes.func,
  clearSearchOnBlur: PropTypes.bool,
  enableKeyDownEvent: PropTypes.bool,
  label: PropTypes.string,
  helperText: PropTypes.string,
  labelTemplate: PropTypes.string,
  tooltipText: PropTypes.string,
  errorMessage: PropTypes.string,
  error: PropTypes.bool,
  removeListSpacing: PropTypes.bool,
  showError: PropTypes.bool,
  checkSearchInputFocusedState: PropTypes.bool,
  getSearchText: PropTypes.bool,
  showListOnFocus: PropTypes.bool,
  maxLength: PropTypes.any,
};

AutoSuggestSearch.defaultProps = {
  activateFocus: true,
  outline: false,
  size: "md",
  chLength: 1,
  refineFilterMessage: "More records exist. Please refine your query.",
  suggestionListContainerWidth: "360px",
  addFreeText: false,
  onInputFocus: (e) => {},
  clearSearchOnBlur: true,
  helperText: "",
  labelTemplate: "default",
  enableKeyDownEvent: false,
  tooltipText: "",
  showError: true,
  checkSearchInputFocusedState: false,
  getSearchText: false,
  showListOnFocus: false,
  maxLength: "",
};
