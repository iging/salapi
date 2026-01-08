import moment from "moment";

export const getLast7Days = () => {
  const result = [];

  // Map day numbers to short labels (0 = Sunday)
  const dayLabels: { [key: number]: string } = {
    0: "S",
    1: "M",
    2: "T",
    3: "W",
    4: "TH",
    5: "F",
    6: "S",
  };

  for (let i = 6; i >= 0; i--) {
    const date = moment().subtract(i, "days");
    result.push({
      day: dayLabels[date.day()],
      date: date.format("MM-DD-YYYY"),
      income: 0,
      expense: 0,
    });
  }
  return result;
  // returns an array of all the previous 7 days
};

export const getLast12Months = () => {
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = moment().subtract(i, "months");

    result.push({
      month: date.format("MMM"), // Display label: Jan, Feb, etc.
      monthKey: date.format("MMM YY"), // Matching key: Jan 25, Feb 25, etc.
      fullDate: date.format("MM-DD-YYYY"),
      income: 0,
      expense: 0,
    });
  }

  return result;
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
  return result;
};
