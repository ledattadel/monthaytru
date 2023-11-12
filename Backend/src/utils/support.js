const Decimal = require('decimal.js');

export function parseDateStringToDate(dateString) {
    const parts = dateString.split("-");
  
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1] - 1, 10); 
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }

export function spitDateFromString(dateString){

    const parts = dateString.split(' ');
    const date = parts[0];
    
    return date;
}

export function compareDateStrings(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
  
    if (date1 < date2) {
      return -1;
    } else if (date1 > date2) {
      return 1;
    } else {
      return 0;
    }
  }
  

  export function compare2DateBetweenStrings(dateStr1, parameter, dateStr2) {
    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);
    const parameterDate = parseDate(parameter);
    // return [dateStr1,date1 ,parameter, parameterDate,dateStr2, date2]

    if (date1 <= parameterDate && parameterDate <= date2) {
      return true;
    } else {
      return false;
    }
  }
  
  function parseDate(dateString) {
    const parts = dateString.split('-'); // Tách chuỗi theo dấu '-'
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Giảm đi 1 vì tháng trong JavaScript bắt đầu từ 0
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null; // Trả về null nếu không thể phân tích chuỗi thành ngày
  }
   

  export function addDecimals(decimal1, decimal2) {
    // Tạo đối tượng Decimal cho cả hai số đầu vào
    const num1 = new Decimal(decimal1);
    const num2 = new Decimal(decimal2);
  
    // Thực hiện phép cộng và trả về kết quả
    return num1.plus(num2);
  }


  export function sumDecimalArray(decimalArray) {
    const total = new Decimal(0);
    decimalArray.forEach(decimal => {
      total.add(decimal);
    });
    return total;
  }
  