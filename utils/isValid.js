const isValidDate = (userInput) => {
    const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    let isValid = false;
    if (datePattern.test(userInput)) {
        let [, day, month, year] = userInput.match(datePattern);
        day = parseInt(day);
        month = parseInt(month);
        year = parseInt(year);

        if (month < 1 || month > 12) {
            isValid = false;
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

const splitTime = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return [hour, minute];
};

const checkTime = (time) => {
    const [hour, minutes] = splitTime(time);
    let isValid = true;
    if (!(hour >= 0 && hour <= 23) || !(minutes >= 0 && minutes <= 59))
        isValid = false;

    return isValid;
};

const isValidTime = (userInput) => {
    let isValid = false;

    const timePattern = /^(\d{2}:\d{2})(?:\s*-\s*(\d{2}:\d{2}))?$/;
    if (timePattern.test(userInput)) {
        let [, startTime, endTime] = userInput.match(timePattern);

        isValid = checkTime(startTime);

        if (endTime && isValid) {
            isValid = checkTime(endTime);
        }
    }

    return isValid;
};

module.exports = {
    isValidDate,
    isValidTime,
};
