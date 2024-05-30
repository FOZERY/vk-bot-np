const isValidDate = (userInput) => {
    const datePattern = /^(\d{2})\.(\d{2})\.(\d{4})$/;

    if (!datePattern.test(userInput)) {
        return false;
    }

    const [, day, month, year] = userInput.match(datePattern).map(Number);

    const dayInMonth = new Date(year, month, 0).getDate();

    return month >= 1 && month <= 12 && day >= 1 && day <= dayInMonth;
};

const splitTime = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return [hour, minute];
};

const checkTime = (time) => {
    const [hour, minutes] = splitTime(time);
    if (!(hour >= 0 && hour <= 23) || !(minutes >= 0 && minutes <= 59))
        return false;

    return true;
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
