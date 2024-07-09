import { Tables } from "../database.types";

export const categorizeItems = (items: Tables<"products">[]) => {
  if (!items.length) return;
  return items.reduce((acc, item) => {
    const { category_id } = item;
    if (category_id) {
      if (!acc[category_id]) {
        acc[category_id] = [];
      }
    }
    acc[category_id].push(item);

    return acc;
  }, {});
};
