export const getDay = (dateStr: string): number => {
  const date = new Date(dateStr);
  const day = date.getDate();
  return day;
};