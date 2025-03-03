/**
 * Formats a number as Nigerian Naira currency (₦)
 * Example: 10000 -> ₦10,000.00
 * 
 * @param value - The numerical value to format
 * @returns A string with the formatted currency value
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a number as Nigerian Naira currency (₦) without the decimal places
 * Example: 10000 -> ₦10,000
 * 
 * @param value - The numerical value to format
 * @returns A string with the formatted currency value without decimal places
 */
export const formatCurrencyNoDecimal = (value: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Parses a currency string (with or without the Naira symbol) to a number
 * Example: "₦10,000.00" -> 10000
 * 
 * @param value - The currency string to parse
 * @returns The parsed number value
 */
export const parseCurrency = (value: string): number => {
  // Remove the Naira symbol and any commas, then parse as a float
  return parseFloat(value.replace(/[₦,]/g, ''));
};
