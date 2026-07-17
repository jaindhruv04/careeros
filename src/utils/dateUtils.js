export function getDateAdded(date = "") {
  if (date.trim() !== "") return date;

  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}