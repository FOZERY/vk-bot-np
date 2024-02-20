const isValidDate = (userInput) => {
  datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  let isValid = false;
  if (datePattern.test(userInput)) {
    console.log(userInput.match(datePattern));
    let [, day, month, year] = userInput.match(datePattern);
    day = parseInt(day);
    month = parseInt(month);
    year = parseInt(year);

    isValid = true;

    if (month < 1 || month > 12) {
      return (isValid = false);
    } else {
      let dayInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > dayInMonth) {
        return (isValid = false);
      }
    }
  }

  return isValid;
};

module.exports = {
  isValidDate,
};
