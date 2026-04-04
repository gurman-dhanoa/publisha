export const formatCompactNumber = (num, maxDecimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: maxDecimals,
  });

  return formatter.format(num);
};