import dayjs from 'dayjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const toCamelCase = (row: any) => {
  const newRow: any = {};
  for (const key in row) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newRow[camelKey] = row[key];
  }
  return newRow;
};

const toSnakeCase = (keys: string[]) => {
  return keys.map((key) => key.replace(/([A-Z])/g, '_$1').toLowerCase());
};

const convertDateStringToDate = (row: any) => {
  for (const [key, value] of Object.entries(row)) {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/g)) {
      row[key] = dayjs(value);
    }
  }

  return row;
};

export { toCamelCase, toSnakeCase, convertDateStringToDate };
