import React from 'react'

function useDate() {
    const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Hours = new Date().getHours();
    const Minutes = new Date().getMinutes();
    const TimeFormat = Hours > 12 ? "PM" : "AM";

    const Day = Weekdays[new Date().getDay()];

    const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
    const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

    return { Day, HoursFormat, MinutesFormat, TimeFormat };
}

export default useDate