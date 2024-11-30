import dayjs from 'dayjs'; // require

const isValidDate = (date, dateFormat) => {
  return dayjs(date, dateFormat, true).isValid();
};

function formatDate(dateStr, format = 'MM/DD/YYYY') {
  if (!dateStr) {
    throw new Error('No date value');
  }

  const parts = dateStr.split('/');

  if (parts.length !== 3) {
    throw new Error('Not a valid date string');
  }

  let [part1, part2, part3] = parts.map(Number);

  let month, day, year;

  if (part1 > 12) {
    day = part1;
    month = part2;
    year = part3;
  } else if (part2 > 12) {
    day = part2;
    month = part1;
    year = part3;
  } else {
    month = part1;
    day = part2;
    year = part3;
  }

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) {
    throw new Error('Not a valid date string');
  }

  const pad = (value) => String(value).padStart(2, '0');

  const formattedDay = pad(date.getDate());
  const formattedMonth = pad(date.getMonth() + 1);
  const formattedYear = date.getFullYear();

  if (format.toUpperCase() === 'MM/DD/YYYY') {
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  } else if (format.toUpperCase() === 'DD/MM/YYYY') {
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  } else {
    throw new Error('Unsupported format');
  }
}

export const DateUtils = Object.freeze({
  isValidDate,
  formatDate
});
