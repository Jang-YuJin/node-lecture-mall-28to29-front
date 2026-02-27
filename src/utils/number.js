export const currencyFormat = (value) => {
  const number = value !== undefined ? value : 0;
  return number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const cc_expires_format = (string) => {
  return string
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1/$2" // To handle 113 > 11/3
    );
};

export const phone_format = (value) => {
  if (!value) return '';

  // 숫자만 남기기
  const number = value.replace(/[^0-9]/g, '');

  if (number.length < 4) return number;
  if (number.length < 8) {
    return number.replace(/(\d{3})(\d+)/, '$1-$2');
  }
  if (number.length === 8) {
    return number.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  if (number.startsWith('02')) {
    return number.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};