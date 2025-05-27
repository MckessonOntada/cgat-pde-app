import dayjs from 'dayjs'; // require

const isValidDate = (date, dateFormat) => {
  return dayjs(date, dateFormat, true).isValid();
};

function formatDate(dateStr, format = 'MM/DD/YYYY') {
  if (!dateStr) {
    //throw new Error('No date value');
    return dateStr;
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


// Helper to calculate "time ago"
export const getTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2629800; // average month (30.44 days)
  const secondsInYear = 31557600; // average year (365.25 days)

  if (diffInSeconds < secondsInMinute) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < secondsInHour) return `${Math.floor(diffInSeconds / secondsInMinute)} minutes ago`;
  if (diffInSeconds < secondsInDay) return `${Math.floor(diffInSeconds / secondsInHour)} hours ago`;

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateCopy = new Date(date);
  dateCopy.setHours(0, 0, 0, 0);

  if (dateCopy.getTime() === yesterday.getTime()) return 'yesterday';

  if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }

  if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }

  if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(diffInSeconds / secondsInYear);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};
