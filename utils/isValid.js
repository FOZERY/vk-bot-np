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

const isValidTime = (userInput) => {
  datePattern = /^(\d{2}:\d{2})(?:\s*-\s*(\d{2}:\d{2}))?$/;
  let isValid = false;
  if (datePattern.test(userInput)) {
    let [, startTime, endTime] = userInput.match(datePattern);
    [startHour, startMinutes] = startTime.split(':').map(Number);

    isValid = true;

    if (startHour < 0 || startHour > 23) {
      return (isValid = false);
    } else {
      if (startMinutes < 0 || startMinutes > 59) {
        return (isValid = false);
      }
    }

    if (endTime) {
      [endHour, endMinutes] = endTime.split(':').map(Number);

      if (endHour < 0 || endHour > 23) {
        return (isValid = false);
      } else {
        if (endMinutes < 0 || endMinutes > 60) {
          return (isValid = false);
        }
      }
    }
  }
  return isValid;
};

module.exports = {
  isValidDate,
  isValidTime,
};
