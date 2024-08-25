export const convertDate = (date: string | null) =>
  typeof date == "string" ? date.split("-").reverse().join("/") : null;
