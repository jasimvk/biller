const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

const scales = ['', 'Thousand', 'Lakh', 'Crore'];

function convertToWords(num) {
  if (num === 0) return 'Zero';
  
  // Handle numbers up to 99
  function handleUnderHundred(n) {
    if (n < 20) return ones[n];
    const digit1 = Math.floor(n / 10);
    const digit2 = n % 10;
    return tens[digit1] + (digit2 ? ' ' + ones[digit2] : '');
  }
  
  // Handle numbers up to 999
  function handleUnderThousand(n) {
    if (n < 100) return handleUnderHundred(n);
    const digit1 = Math.floor(n / 100);
    const remainder = n % 100;
    return ones[digit1] + ' Hundred' + (remainder ? ' and ' + handleUnderHundred(remainder) : '');
  }

  // Convert decimal part to words
  function handleDecimal(decimal) {
    if (!decimal) return '';
    const paise = Math.round(decimal * 100);
    if (paise === 0) return '';
    return ' and ' + handleUnderHundred(paise) + ' Paise';
  }

  // Main conversion logic for Indian number system
  function convertWholeNumber(n) {
    if (n === 0) return '';
    
    const parts = [];
    let scaleIndex = 0;
    
    // First handle the last 3 digits
    if (n % 1000 > 0) {
      parts.unshift(handleUnderThousand(n % 1000) + ' ' + scales[scaleIndex]);
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
    
    // Then handle two digits at a time for Indian system
    while (n > 0) {
      if (n % 100 > 0) {
        parts.unshift(handleUnderHundred(n % 100) + ' ' + scales[scaleIndex]);
      }
      n = Math.floor(n / 100);
      scaleIndex++;
    }
    
    return parts.join(' ');
  }

  // Split number into whole and decimal parts
  const [whole, decimal] = num.toFixed(2).split('.');
  const wholeNumber = parseInt(whole);
  const decimalNumber = parseInt(decimal) / 100;

  const wholeWords = convertWholeNumber(wholeNumber);
  const decimalWords = handleDecimal(decimalNumber);

  return (wholeWords + ' Rupees' + decimalWords).trim();
}

export function numberToWords(amount) {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Invalid Amount';
    }
    
    if (amount === 0) {
      return 'Zero Rupees Only';
    }

    // Handle negative numbers
    if (amount < 0) {
      return 'Minus ' + convertToWords(Math.abs(amount)) + ' Only';
    }

    return convertToWords(amount) + ' Only';
  } catch (error) {
    console.error('Error converting number to words:', error);
    return 'Error Converting Amount';
  }
}

// Examples of usage:
// console.log(numberToWords(1234.56));
// Output: "One Thousand Two Hundred and Thirty Four Rupees and Fifty Six Paise Only"
// console.log(numberToWords(100000));
// Output: "One Lakh Rupees Only"
// console.log(numberToWords(1234567.89));
// Output: "Twelve Lakh Thirty Four Thousand Five Hundred and Sixty Seven Rupees and Eighty Nine Paise Only" 