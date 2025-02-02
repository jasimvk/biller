export const formatINR = (amount) => {
  // Format number to Indian currency format with comma separators
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return formatter.format(amount);
};

// Format large numbers with Indian numbering system (e.g., 1,23,456.00)
export const formatIndianNumber = (num) => {
  const numStr = num.toString();
  const parts = numStr.split('.');
  const wholePart = parts[0];
  const decimalPart = parts[1] || '00';

  // Add commas for Indian number system
  let formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (formattedWholePart.length > 3) {
    formattedWholePart = formattedWholePart.replace(/,/g, function(match, offset) {
      return offset > 0 ? ',' : '';
    });
  }

  return `${formattedWholePart}.${decimalPart.padEnd(2, '0')}`;
}; 