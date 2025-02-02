const hsnGSTRates = {
  // Food and Beverages
  '2106': 18,  // Food preparations
  '2202': 28,  // Beverages
  
  // Textiles
  '5007': 5,   // Silk fabrics
  '5208': 5,   // Cotton fabrics
  
  // Electronics
  '8517': 18,  // Telephones
  '8471': 18,  // Computers
  
  // Furniture
  '9403': 18,  // Other furniture
  
  // Services
  '9983': 18,  // Professional services
  '9984': 18,  // Telecommunications
  '9985': 18,  // Support services
};

export const validateHSNCode = (hsnCode) => {
  if (!hsnCode) return false;
  return /^\d{4,8}$/.test(hsnCode);
};

export const getDefaultGSTRate = (hsnCode) => {
  const firstFourDigits = hsnCode.substring(0, 4);
  return hsnGSTRates[firstFourDigits] || null;
};

export const validateGSTRateForHSN = (hsnCode, gstRate) => {
  const defaultRate = getDefaultGSTRate(hsnCode);
  if (!defaultRate) return true; // If no specific rate is defined, accept any valid rate
  return defaultRate === gstRate;
}; 