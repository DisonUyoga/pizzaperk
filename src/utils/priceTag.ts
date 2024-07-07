export function priceTag(price: number | undefined) {
  if (!price) return;
  return price.toLocaleString("en-KE", {
    style: "currency",
    currency: "KSH",
  });
}
