// IMPORTS
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import useSnackbar from '@src/hooks/useSnackbar';
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * @description - Check if an input is a non-empty array.
 * @param {any} arr - The input to check.
 * @returns {boolean} - True if the input is a non-empty array, false otherwise.
 *
 * @example:
 * const myArray = [1, 2, 3];
 * isNonEmptyArray(myArray); // Returns true
 *
 * const emptyArray = [];
 * isNonEmptyArray(emptyArray); // Returns false
 */
const isNonEmptyArray = function (arr) {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * @description - Check if an input is a non-object array
 * @param {any} obj - The input to check.
 * @returns {boolean} - True if the input is a non-empty object, false otherwise.
 *
 * @example:
 * const obj = {a,b,c};
 * isNonEmptyObject(obj); // Returns true
 *
 * const obj = {arr:[], str: "abc"} || {arr:[1,2,3], str: ""}
 * isNonEmptyObject(obj); // Returns true
 *
 * const obj = {}
 * isNonEmptyObject(obj); // Returns false
 *
 * const obj = {arr:[], str: ""}
 * isNonEmptyObject(obj); // Returns false
 */
const isNonEmptyObject = (obj) => {
  if (obj === null || obj === undefined) {
    return false;
  }
  return Object.values(obj).some((value) => {
    if (value === null || value === undefined) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    } else if (typeof value === 'string') {
      return value.trim() !== '';
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).length > 0;
    }
    return true;
  });
};

/**
 * @description - Check if an input is a non-empty string.
 * @param {any} str - The input to check.
 * @returns {boolean} - True if the input is a non-empty string, false otherwise.
 *
 * @example:
 * const str = "string";
 * isNonEmptyString(str); // Returns true
 *
 * const str = "";
 * isNonEmptyString(str); // Returns false
 */
const isNonEmptyString = function (str) {
  return (typeof str === 'string' || str instanceof String) && str.length > 0;
};

const convertDate = function (date) {
  if (date) {
    return dayjs(date).format('MM/DD/YYYY');
  }
  return null;
};

const getCurrentDate = () => new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });

const objectToQueryString = function (obj) {
  return objectToQueryStringWithCustomSeparator(obj, ',');
};

const objectToQueryStringWithCustomSeparator = function (obj, customSeparator) {
  const keyValuePairs = [];
  for (const key in obj) {
    const value = obj[key];
    if (value !== '' && (!Array.isArray(value) || value.length > 0)) {
      keyValuePairs.push(`${key}=${Array.isArray(value) ? value.join(customSeparator) : value}`);
    }
  }

  return keyValuePairs.join('&');
};

const excludeKeyFromObject = function (obj, keyToExclude) {
  const filteredObject = { ...obj };
  delete filteredObject[keyToExclude];
  return filteredObject;
};

const filterObjectByKey = function (obj, key) {
  if (obj.hasOwnProperty(key)) {
    return { [key]: obj[key] };
  } else {
    return {};
  }
};

const isNonNullObject = function (obj) {
  return typeof obj === 'object' && obj !== null;
};

const queryValidator = function (query) {
  const pattern = /^[a-zA-Z0-9@._\s-]*$/;
  return pattern.test(query);
};

const toggleCheck = function (items, isChecked = false) {
  return items.map((e) => {
    return {
      value: e?.value || e,
      label: e?.label || e,
      isChecked: isChecked
    };
  });
};

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

const getContainerWidth = (size) => {
  let style = {};

  switch (size) {
    case 'xs':
      style = {
        width: '20%'
      };
      break;
    case 'sm':
      style = {
        width: '30%'
      };
      break;
    case 'md':
      style = {
        width: '50%'
      };
      break;
    case 'lg':
      style = {
        width: '70%'
      };
      break;
  }
  return {
    ...style
  };
};

const getTooltipPosition = (height, width, event) => {
  const margin = 12;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const isRightSpaceAvailable = event.clientX + width + margin <= screenWidth;
  const isBottomSpaceAvailable = event.clientY + height + margin <= screenHeight;
  const isTopSpaceAvailable = event.clientY - height - margin >= 0;

  let position = {};

  if (isRightSpaceAvailable) {
    position.left = event.clientX;
    position.right = 'unset';
  } else {
    position.right = window.innerWidth - event.clientX;
    position.left = 'unset';
  }

  if (isBottomSpaceAvailable) {
    position.top = event.clientY;
    position.bottom = 'unset';
  } else if (isTopSpaceAvailable) {
    position.top = 'unset';
    position.bottom = screenHeight - event.clientY;
  } else {
    position.top = screenHeight - height - margin; // Default to bottom edge if no space on either side
    position.bottom = 'unset';
  }

  return position;
};

const debounce = (callback, delay) => {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

const timezoneAbbreviations = {
  '+00:00': 'GMT',
  '+05:30': 'IST',
  '-08:00': 'PST'
  // Add more mappings as needed
};

const convertDateStringToUserTimezone = (dateString) => {
  if (!dateString) {
    return dateString;
  }

  let formattedDate = dayjs.utc(dateString).tz();
  const timeZoneOffset = formattedDate.format('Z');
  const timezone = timezoneAbbreviations[timeZoneOffset] || timeZoneOffset;

  formattedDate = formattedDate.format(`MM-DD-YYYY HH:mm [${timezone}]`);

  return formattedDate;
};

const convertDateStringFormat = (dateString, format) => {
  if (!dateString) {
    return dateString;
  }

  const formattedDate = dayjs(dateString).format(format);

  return formattedDate;
};

const sortByDate = (dateString1, dateString2, sortOrder, fieldId = null) => {
  let tempDateString1 = dateString1;
  let tempDateString2 = dateString2;
  if (fieldId) {
    tempDateString1 = tempDateString1?.[fieldId];
    tempDateString2 = tempDateString2?.[fieldId];
  }
  const date1 = dayjs(tempDateString1).utc();
  const date2 = dayjs(tempDateString2).utc();
  if (sortOrder == 'asc') {
    return date1 - date2;
  } else {
    return date2 - date1;
  }
};

const parseHtml = (htmlString, styles) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString, { USE_PROFILES: { html: true } });
  const html = parse(cleanHtmlString);
  if (!isNonEmptyObject(html)) {
    return null;
  }
  return html;
};

const sanitizeContent = (content) => {
  return DOMPurify.sanitize(content);
};

// const searchAndRankOnPrefixFirst = (data, searchText) => {
//   const containsData = [];

//   data.forEach((string) => {
//     if (string.label.toLowerCase().includes(searchText)) {
//       let index = string.label.toLowerCase().indexOf(searchText);
//       let containsDataObj = { startsAt: index, data: string };
//       containsData.push(containsDataObj);
//     }
//   });

//   return containsData
//     .sort((a, b) => {
//       if (a.startsAt < b.startsAt) {
//         return -1;
//       } else {
//         return 1;
//       }
//     })
//     .map((item) => item.data);
// };

function searchAndRankOnPrefixFirst(data, searchText) {
  searchText = searchText.toLowerCase();
  const filteredList = data.filter((string) => string.label.toLowerCase().includes(searchText));
  filteredList.sort((a, b) => {
    const aStartsWith = a.label.toLowerCase().startsWith(searchText);
    const bStartsWith = b.label.toLowerCase().startsWith(searchText);
    if (aStartsWith && !bStartsWith) {
      return -1;
    } else if (!aStartsWith && bStartsWith) {
      return 1;
    } else {
      if (a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1;
      } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  return filteredList;
}

function areArraysEqual(arr1, arr2) {
  // If arrays are equal --> compare on keys
  // If array1.length > array2.length --> return false

  if (arr1.length > arr2.length) {
    return false;
  }

  if (arr1.length < arr2.length) {
    return true;
  }

  return !arr1.every((value, index) => value === arr2[index]);
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

function getDateRange(gapYear) {
  const date = new Date();
  const intYear = date.getFullYear() - gapYear;
  const prevDate = new Date(new Date().setFullYear(intYear));

  return [convertDate(prevDate), convertDate(date)];
}

function truncateString(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber;
};

export const getFullName = (name) => {
  if (!name || typeof name !== 'object') return '';
  //defaults to an empty string ('') when firstnam,middlename,lastname is notavailable
  const { firstName = '', middleName = '', lastName = '' } = name;
  return [lastName, firstName, middleName]
    .filter((part) => part.trim()) // Remove empty or whitespace-only parts
    .join(', ')
    .trim();
};

function generateUniqueCode(str) {
  let hash = 5381;
  str = str.trim();
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

export const downloadFile = (blob, fileName) => {
  let result = { status: '' };
  try {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    result.status = 'success';
  } catch (error) {
    result = { ...result, status: 'error', error: error };
    console.log('error while downloading file', error);
  }
  return result;
};

export const enableReviewAndPay = (selectedAccount) => {
  let ignorableSalesOrgIds = ['5040'];
  if (selectedAccount) {
    let hide = ignorableSalesOrgIds.some((ele) => ele == selectedAccount.salesOrg);
    return !hide;
  } else {
    return false;
  }
};

const cleanObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanObject)
      .filter((item) => item !== undefined && item !== null && !(typeof item === 'object' && Object.keys(item).length === 0));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = cleanObject(value);
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        cleanedValue !== '' &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
        !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)
      ) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {});
  }
  return obj;
};

const CommonUtils = Object.freeze({
  isNonEmptyArray,
  isNonEmptyObject,
  isNonEmptyString,
  convertDate,
  getCurrentDate,
  objectToQueryString,
  objectToQueryStringWithCustomSeparator,
  isNonNullObject,
  queryValidator,
  toggleCheck,
  excludeKeyFromObject,
  filterObjectByKey,
  isFirefox,
  getContainerWidth,
  getTooltipPosition,
  debounce,
  convertDateStringToUserTimezone,
  sortByDate,
  convertDateStringFormat,
  parseHtml,
  sanitizeContent,
  searchAndRankOnPrefixFirst,
  areArraysEqual,
  deepEqual,
  getDateRange,
  truncateString,
  formatPhoneNumber,
  getFullName,
  downloadFile,
  enableReviewAndPay,
  generateUniqueCode,
  cleanObject
});

export default CommonUtils;
