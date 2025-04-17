import dayjs from 'dayjs';

export const getDateRangeFromSelection = (selection) => {
  const today = dayjs();
  let startDate;
  let endDate;
  switch (selection) {
    case 'currentMonth':
      startDate = today.startOf('month');
      endDate = today;
      break;

    case 'lastMonth':
      startDate = today.subtract(1, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'last3Months':
      startDate = today.subtract(3, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'last6Months':
      startDate = today.subtract(6, 'month').startOf('month');
      endDate = today.subtract(1, 'month').endOf('month');
      break;

    case 'customRange':
    default:
      return null;
  }

  return {
    startDate: startDate.format('DD/MM/YYYY'),
    endDate: endDate.format('DD/MM/YYYY') || today.format('DD/MM/YYYY')
  };
};
