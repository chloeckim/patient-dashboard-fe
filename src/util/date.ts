export const formatDateToString = (date: Date): string => {
  const day: number = date.getDate()
  const month: number = date.getMonth() + 1
  const year: number = date.getFullYear()
  const formatted: string =
    (month < 10 ? "0" + month + "/" : month + "/") +
    (day < 10 ? "0" + day + "/" : day + "/") +
    year
  return formatted
}
