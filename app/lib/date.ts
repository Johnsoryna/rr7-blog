function parse(value: string) {
  return new Date(value.replace(" ", "T") + "Z");
}

export function formatDate(value: string) {
  return parse(value).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function toIsoDate(value: string) {
  return parse(value).toISOString();
}
