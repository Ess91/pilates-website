const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const dayShort = (d) => DAYS[d.getDay()];
export const formatDay = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const formatDayMonth = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const formatTime = (d) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

export const addMinutes = (d, mins) => new Date(d.getTime() + mins * 60000);

export const relativeDay = (dayIndex, date) =>
  dayIndex === 0 ? "Today" : dayIndex === 1 ? "Tomorrow" : formatDay(date);

export const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

export const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
