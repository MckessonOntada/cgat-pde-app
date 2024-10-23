/**
 * @description - Debounce a function to prevent spam
 * @param {function} callback - Callback function to execute after delay.
 * @param {number} delay - Milliseconds to delay/debounce function by.
 *
 * @example:
 * const message = (text) => alert(text);
 * const debounceMessage = debounce(message, 500);
 * debounceMessage('alert text');
 */
const debounce = (callback, delay) => {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

/**
 * Converts a string of mixed casing into camelCased words.
 * This method strips away any spaces or additional characters
 * that are not letters of the alphabet or a number.
 */

const camelizeWords = (phrase) => {
  if (!phrase) return "";

  let camelizedList = [];

  phrase.split(" ").forEach((word, index) => {
    let modifiedWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    if (index && modifiedWord)
      modifiedWord = modifiedWord[0]
        .toUpperCase()
        .concat(modifiedWord.slice(1));
    camelizedList = [...camelizedList, modifiedWord];
  });

  return camelizedList.join("");
};

const isNumber = function (num) {
  return (typeof num === "number" || num instanceof Number) && !isNaN(num);
};

const isString = function (str) {
  return typeof str === "string" || str instanceof String;
};

const isNonEmptyArray = function (arr) {
  return Array.isArray(arr) && arr.length > 0;
};

const isNonEmptyObject = function (obj) {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj !== "undefined" &&
    Object.keys(obj).length > 0
  );
};
const capToDecapFirstLetterCap = function (sentence) {
  let words = sentence.split(" ").map((word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
  return words.join(" ");
};

const isNonEmptyString = function (str) {
  return (typeof str === "string" || str instanceof String) && str.length > 0;
};

const isNonNullObject = function (obj) {
  return typeof obj === "object" && obj !== null;
};

const truncate = function (str, n) {
  return str?.length > n ? `${str.substr(0, n - 1)}...` : str;
};

const flatten2dArray = function (arr = []) {
  return arr.reduce((accumArr, val) => accumArr.concat(val), []);
};

const strToSentenceCase = (str = "") => {
  let removeUnderscore = str.replaceAll("_", " ");
  return removeUnderscore
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

const arrayToString = (arr) => {
  return Array.isArray(arr) ? arr.join(",") : arr;
};

const arrayToStringWithSpace = (arr) => {
  return Array.isArray(arr) ? arr.join(", ") : arr;
};

const areSameElementsInArray = (arr1, arr2) => {
  if (!(Array.isArray(arr1) && Array.isArray(arr2))) {
    return false;
  }
  let N = arr1.length;
  let M = arr2.length;

  // If lengths of array are not equal means
  // array are not equal
  if (N !== M) return false;

  // Sort both arrays
  arr1.sort();
  arr2.sort();

  // Linearly compare elements
  for (let i = 0; i < N; i++) if (arr1[i] !== arr2[i]) return false;

  // If all elements were same.
  return true;
};

const hasChildren = (item) => {
  const { childs: children } = item;

  if (children === undefined || children === null) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
};
const googleMapsSearchQuery = (
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  state,
  zip
) => {
  let fullAddress =
    addressLine1 +
    " " +
    addressLine2 +
    " " +
    addressLine3 +
    " " +
    city +
    " " +
    state +
    " " +
    zip;
  return fullAddress.replaceAll(" ", "%20");
};
const generateId = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const formattedPhoneNumber = (phoneNumber) => {
  
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.length === 10) {
    return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(3, 6)}-${cleanedNumber.slice(6)}`;
  } else {
    return phoneNumber;
  }
};

const formatSupportNumber = (value) => {
  if (!isNonEmptyString(value)) {
    return "";
  }

  let temp1 = value.slice(0, 1);
  let temp2 = value.slice(1, 4);
  let temp3 = value.slice(4, 7);
  let temp4 = value.slice(7);

  let formattedPhoneNo = "";

  if (CommonUtils.isNonEmptyString(temp1)) {
    formattedPhoneNo = formattedPhoneNo + temp1;
  }

  if (CommonUtils.isNonEmptyString(temp2)) {
    formattedPhoneNo = formattedPhoneNo + "-" + temp2;
  }

  if (CommonUtils.isNonEmptyString(temp3)) {
    formattedPhoneNo = formattedPhoneNo + "-" + temp3;
  }

  if (CommonUtils.isNonEmptyString(temp4)) {
    formattedPhoneNo = formattedPhoneNo + "-" + temp4;
  }

  return formattedPhoneNo;
};

export const CommonUtils = Object.freeze({
  arrayToString,
  debounce,
  isNonEmptyArray,
  isNonEmptyObject,
  isNonEmptyString,
  isNonNullObject,
  isNumber,
  isString,
  camelizeWords,
  truncate,
  flatten2dArray,
  strToSentenceCase,
  capToDecapFirstLetterCap,
  arrayToStringWithSpace,
  areSameElementsInArray,
  googleMapsSearchQuery,
  hasChildren,
  generateId,
  formattedPhoneNumber,
  formatSupportNumber,
});
