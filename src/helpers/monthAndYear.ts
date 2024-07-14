export const getMonthAndYear = (dateStr: Date) => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return { month, year };
};
