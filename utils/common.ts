import moment from "moment";

export const getLast7Days = () => {
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = moment().subtract(i, "days");
    result.push({
      day: date.format("ddd"),
      date: date.format("MM-DD-YYYY"),
      income: 0,
      expense: 0,
    });
  }
  return result.reverse();
  // returns an array of all the previous 7 days
};

export const getLast12Months = () => {
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = moment().subtract(i, "months");

    const formattedMonthYear = date.format("MMM YY"); // Jan 00
    const formattedDate = date.format("MM-DD-YYYY");

    result.push({
      month: formattedMonthYear,
      fullDate: formattedDate,
      income: 0,
      expense: 0,
    });
  }

  // return result;
  return result.reverse();
};

interface YearData {
  year: string;
  fullDate: string;
  income: number;
  expense: number;
}

export const getYearsRange = (
  startYear: number,
  endYear: number
): YearData[] => {
  const result = [];
  for (let year = startYear; year <= endYear; year++) {
    result.push({
      year: year.toString(),
      fullDate: moment(`${year}-01-01`).format("MM-DD-YYYY"),
      income: 0,
      expense: 0,
    });
  }
  // return result;
  return result.reverse();
};
