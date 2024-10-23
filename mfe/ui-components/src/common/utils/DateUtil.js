import dayjs from "dayjs"; // require

const isValidDate = (date, dateFormat) => {
  return dayjs(date, dateFormat, true).isValid();
};

export const DateUtils = Object.freeze({
  isValidDate,
});
