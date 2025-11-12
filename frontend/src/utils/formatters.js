export function formatPrice(price) {
  return price.amount?.toLocaleString("pt-BR", {
    style: "currency",
    currency: price.currency || "BRL",
  });
}

export function formatListMapping(list, key) {
  return list?.map((item) => item[key]).join(", ") || "N/A";
}

export function formatDate(dateString) {
  if (!dateString) {
    return "";
  }
  const [year, month, day] = dateString.split("-");

  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
