export default function formatMoneyWithDot(str) {
  str = `${str}`;
  const temp = str
    .split('')
    .reverse()
    .reduce((prev, next, index) => (index % 3 ? next : `${next}.`) + prev);

  return `${temp}đ`;
}
