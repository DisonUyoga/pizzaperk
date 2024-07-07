import { Tables } from "../type";

export function getTimeDifferenceInSeconds(delivery: Tables<"delivery">[]) {
  const time = timeDiff(delivery);

  return time;
}

function timeDiff(delivery: Tables<"delivery">[]) {
  const created_at = new Date(delivery[0].created_at);

  const date1 = new Date();
  const date2 = new Date(delivery[0]?.countdown as any);
  const utcTime1 = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
    date1.getHours(),
    date1.getMinutes(),
    date1.getSeconds()
  );
  const utcTime2 = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
    created_at.getHours(),
    created_at.getMinutes(),
    created_at.getSeconds()
  );
  const timeDifferenceInMilliseconds = utcTime2 - utcTime1;
  const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;
  return timeDifferenceInSeconds;
}
