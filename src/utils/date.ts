/**
 * Returns the current date in the format: HH:mm - dd/mm/yyyy
 * @returns {string} The formatted date string
 */
export function getFormattedDate(): string {
  const currentDate = new Date();

  // Get hours, minutes, day, month, and year
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Months are 0-indexed
  const year = currentDate.getFullYear();

  // Construct the formatted date string
  const formattedDate = `${hours}:${minutes} - ${day}/${month}/${year}`;

  return formattedDate;
}
