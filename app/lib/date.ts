export function formatDate(value: string) {
  return new Date(value.replace(" ", "T") + "Z").toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
