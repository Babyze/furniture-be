/* eslint-disable @typescript-eslint/no-explicit-any */
const toCamelCase = (row: any) => {
  const newRow: any = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newRow[camelKey] = row[key];
  }
  return newRow;
};

const toDateStringToDate = (row: any) => {
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/g)) {
      row[key] = new Date(value);
    }
  }

  return row;
};

export { toCamelCase, toDateStringToDate };
