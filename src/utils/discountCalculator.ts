export function calcDis(curr: number, prev: number) {
    const discount = (prev - curr) / prev;

    const percentageFormatter = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
    const formatedDisc = percentageFormatter.format(discount);
    return formatedDisc;
  }