import React from 'react';
import styles from './assets/styles/TreeDropDown.module.scss';
import { useState, useEffect, useRef } from 'react';
import { ReactComponent as DropdownArrow } from './assets/svgs/DropdownArrowDown.svg';
import { ReactComponent as AddSVG } from '../../assets/svg/add-circle.svg';
import { VARIANTTYPE } from './assets/constant/TreeDropDownConstants';

export default function TreeDropDown({
  id,
  label,
  optionsData,
  onSelectData,
  variant,
  onSearchData,
  onClickOfNode,
  asyncRecordsFound,
  maxRecordsCountToShow,
  isRefineFilter,
  refineFilterMessage,
  selectedLabel
}) {
  const {
    buttonStyles,
    selectOptionsContainer,
    inputEle,
    result,
    container,
    dropDownValueContent,
    dropDownArrow,
    expandableOption,
    dropDownArrowOpen,
    active,
    listItem
  } = styles;
  const [searchData, setSearchData] = useState('');
  const [optionsToDisplay, setOptionsToDisplay] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedValue, setselectedValue] = useState('Select data');
  const clickTimeoutRef = useRef(null);
  const [data, setData] = useState([]);
  const [throttleTimer, setThrottleTimer] = useState(null);

  useEffect(() => {
    if (optionsData?.length > 0) {
      setData([...optionsData]);
      selectedLabel && setselectedValue(selectedLabel);
    }
  }, [optionsData]);

  const onSearch = () => {
    clearTimeout(throttleTimer);
    setThrottleTimer(null);
    onSearchData(searchData);
  };

  useEffect(() => {
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      setThrottleTimer(null);
    }
    const timeout = setTimeout(() => {
      onSearch();
    }, 500);

    setThrottleTimer(timeout);
  }, [searchData]);

  const onDblclick = (e, selectedLabel, selectedVal) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    setselectedValue(selectedLabel);
    setOpenDropdown(false);
    onSelectData({ value: selectedVal + '', label: selectedLabel });
  };

  const handleExpanded = (_data, parentdata) => {
    if (parentdata?.labelId == _data.labelId) {
      parentdata.isExpanded = !parentdata.isExpanded;
    } else {
      parentdata.children?.forEach((element) => {
        handleExpanded(_data, element);
      });
    }

    return parentdata;
  };

  const onClickHandler = (e, _data, parentIndex) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const timeout = setTimeout(() => {
      //if (_data.isExpanded) {
      if (!_data.isExpanded && _data.hasChild) {
        onClickOfNode(_data.labelId, parentIndex);
        const tempData = [...data];
        tempData[parentIndex] = handleExpanded(_data, tempData[parentIndex]);
      } else {
        const tempData = [...data];
        tempData[parentIndex] = handleExpanded(_data, tempData[parentIndex]);
        setData(tempData);
      }

      //}
      // if (_data.children.length > 0) {
      //   getDropDownOptions('', _data.id);
      // }
      clickTimeoutRef.current = null;
    }, 250);

    clickTimeoutRef.current = timeout;
  };

  const getRefineFilterUi = () => {
    const refineUi = refineFilterMessage?.map((message) => {
      return <span className={styles.refineMessage}>{message}</span>;
    });
    if (variant === VARIANTTYPE.DEFAULT) {
      if (isRefineFilter && asyncRecordsFound > 0) {
        return (
          <li tabIndex={-1} className={styles.refineBox}>
            {refineUi}
          </li>
        );
      }
    } else if (variant === VARIANTTYPE.ASYNC) {
      if (asyncRecordsFound > maxRecordsCountToShow) {
        return (
          <li tabIndex={-1} className={styles.refineBox}>
            {refineUi}
          </li>
        );
      }
    }
  };

  //INTENTIONALLY COMMENTED FOR FUTURE USE
  // const getDropDownOptionsHelper = (data, searchText, found, id) => {
  //   //console.log(data);
  //   let _label = (
  //     <div>
  //       <span>{data.stdValue}</span>
  //     </div>
  //   );
  //   if (searchText.length > 0) {
  //     let matchedCharacterArray = data.stdValue.split(new RegExp(`(${searchText})`, 'i'));

  //     if (matchedCharacterArray.length > 1) {
  //       _label = (
  //         <div>
  //           {matchedCharacterArray[0] && <span>{matchedCharacterArray[0]}</span>}
  //           <span className={active}>{matchedCharacterArray[1]}</span>
  //           {matchedCharacterArray[2] && <span>{matchedCharacterArray[2]}</span>}
  //         </div>
  //       );
  //     }
  //   }
  //   const element = (
  //     <li
  //       key={data.id}
  //       onClick={(e) => onClickHandler(e, data)}
  //       onDoubleClick={(e) => onDblclick(e, data.stdValue)}>
  //       {
  //         <div className={expandableOption}>
  //           {data.children.length > 0 && (
  //             <DropdownArrow className={data.isActive ? dropDownArrowOpen : dropDownArrow} />
  //           )}
  //           <span>{_label}</span>
  //         </div>
  //       }
  //       <ul>
  //         {data.children.map((item) => {
  //           if (data.parent != id || searchText.length > 0) {
  //             let result = getDropDownOptionsHelper(item, searchText, false, id);
  //             if (result?.tempfound) {
  //               found = true;
  //               return result?.ele;
  //             }
  //           } else {
  //             return null;
  //           }
  //         })}
  //       </ul>
  //     </li>
  //   );
  //   if (found) {
  //     if (searchText.length == 0 && data.parent == id && data.isActive) {
  //       data.isActive = false;
  //       return { ele: null, tempfound: found };
  //     }
  //     data.isActive = true;
  //     return { ele: element, tempfound: found };
  //   }
  //   if (
  //     (searchText.length > 0 && data.stdValue.toLowerCase().includes(searchText.toLowerCase())) ||
  //     (searchText.length == 0 &&
  //       ((data.parent == id && !data.isActive) ||
  //         (data.parent != id && data.isActive) ||
  //         id == 'initial'))
  //   ) {
  //     data.isActive = true;
  //     return {
  //       ele: (
  //         <li
  //           key={data.id}
  //           onClick={(e) => onClickHandler(e, data)}
  //           onDoubleClick={(e) => onDblclick(e, data.stdValue)}>
  //           <div className={expandableOption}>
  //             {data.children.length > 0 && <DropdownArrow className={dropDownArrow} />}
  //             {_label}
  //           </div>
  //         </li>
  //       ),
  //       tempfound: true
  //     };
  //   } else {
  //     data.isActive = false;
  //     return { ele: null, tempfound: false };
  //   }
  // };

  const getDropDownOptionsHelperNew = (_data, parentIndex) => {
    let _label = (
      <div>
        <span>{_data.displayLabel || _data.stdDisplay || _data.label}</span>
      </div>
    );
    let hasChild = (_data.children && _data.children?.length > 0) || _data.hasChild;
    if (!_data.hasOwnProperty('isExpanded')) {
      if (_data.children && hasChild) {
        _data.isExpanded = true;
      } else {
        _data.isExpanded = false;
      }
    }
    const element = (
      <li
        key={_data.id}
        className={listItem}
        onClick={(e) => onClickHandler(e, _data, parentIndex)}
        onDoubleClick={(e) =>
          onDblclick(e, _data.displayLabel || _data.stdDisplay || _data.label, _data.labelId)
        }>
        {
          <div className={expandableOption}>
            <span style={{ paddingRight: '5px' }}>{_label}</span>
            {hasChild && <AddSVG style={{ fill: `var(--chakra-colors-themeColors-blue1)` }} />}
          </div>
        }
        {hasChild && _data.isExpanded && (
          <ul>
            {_data.children?.map((element) => {
              return getDropDownOptionsHelperNew(element, parentIndex);
            })}
          </ul>
        )}
      </li>
    );

    return element;
  };

  const getDropDownOptions = () => {
    let _optionsToDisplay = (
      <ul>
        {data
          .map((_data, index) => {
            return getDropDownOptionsHelperNew(_data, index);
          })
          .filter((_data) => _data != null)}

        {getRefineFilterUi()}
      </ul>
    );
    setOptionsToDisplay(_optionsToDisplay);
  };

  useEffect(() => {
    getDropDownOptions();
  }, [data]);
  return (
    <div className={container} id={id} style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontSize: '12px' }}>{label}</label>
        <button
          className={buttonStyles}
          onClick={(e) => {
            e.preventDefault();
            setOpenDropdown(!openDropdown);
          }}>
          {
            <div className={dropDownValueContent}>
              <span>{selectedValue}</span>
              <DropdownArrow className={dropDownArrow} />
            </div>
          }
        </button>
      </div>

      {openDropdown && (
        <div className={selectOptionsContainer}>
          <div>
            <input
              className={inputEle}
              type="text"
              placeholder="Search item"
              id="myInput"
              onChange={(e) => setSearchData((prev) => e.target.value)}
            />
          </div>
          <div className={result}> {optionsToDisplay} </div>
        </div>
      )}
    </div>
  );
}
