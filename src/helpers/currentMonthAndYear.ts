export const getCurrentMonthAndYear = (dateStr: string) =>{
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return { year, month };
  }