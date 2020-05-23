export const sum = (...numbers: number[]) =>
  numbers.filter(value => !isNaN(value)).reduce((acc, val) => acc + val, 0)
