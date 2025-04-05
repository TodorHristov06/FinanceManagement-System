import { useState } from "react";

export const useWorkCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [weeksPerMonth, setWeeksPerMonth] = useState<number>(4);

  const calculateMonthlyEarnings = () => {
    return hourlyRate * hoursPerDay * daysPerWeek * weeksPerMonth;
  };

  return {
    hourlyRate,
    setHourlyRate,
    hoursPerDay,
    setHoursPerDay,
    daysPerWeek,
    setDaysPerWeek,
    weeksPerMonth,
    setWeeksPerMonth,
    monthlyEarnings: calculateMonthlyEarnings(),
  };
};