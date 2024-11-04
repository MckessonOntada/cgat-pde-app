import dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);
const convertMMYYYYdates = (date) => {
  let _date = null;
  try {
    const dateArr = date.split('/');
    // 08/2024 -> 2024/08
    // 01/08/2024 -> 2024/08
    if (dateArr && dateArr[0]?.length <= 2 && dateArr[1]?.length === 4) {
      _date = `${dateArr[1]}/${dateArr[0]}`;
    } else {
      _date = date;
    }
  } catch (error) {
    console.error(error);
  }
  return _date;
};

const checkFutureDates = (date) => {
  const todayDate = dayjs();
  let selectedDate = dayjs(date);
  if (date && date.split('/').length == 2) {
    selectedDate = dayjs(date, 'MM-YYYY');
  }

  return selectedDate.isAfter(todayDate);
};

const getValueFromLabel = (options, label) => {
  if (!options || !label) {
    return null;
  }
  return options.find((opt) => opt.label.toLowerCase() === label.toLowerCase());
};

const isDatePickerElement = (label) => {
  return /\bdate\b/i.test(label);
};

const isValidDate = (date, dateFormat) => {
  return dayjs(date, dateFormat, true).isValid();
};

const DatepickerUtil = Object.freeze({
  convertMMYYYYdates,
  checkFutureDates,
  getValueFromLabel,
  isDatePickerElement,
  isValidDate
});

export default DatepickerUtil;
