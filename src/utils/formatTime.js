function formatTime(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${m}:${s}`;
}

export { formatTime };
