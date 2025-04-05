// features/work-calculator/hooks/use-work-calculator.ts
import { useState } from "react";

export const useWorkCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [workHours, setWorkHours] = useState<number>(8);
  const [workDays, setWorkDays] = useState<number>(5);
  const [taxPercentage, setTaxPercentage] = useState<number>(30);

  const monthlyEarnings = hourlyRate * workHours * workDays * 4; // 4 weeks per month
  const yearlyEarnings = monthlyEarnings * 12;
  
  const afterTaxMonthly = monthlyEarnings * (1 - taxPercentage / 100);
  const afterTaxYearly = yearlyEarnings * (1 - taxPercentage / 100);

  return {
    hourlyRate,
    setHourlyRate,
    workHours,
    setWorkHours,
    workDays,
    setWorkDays,
    taxPercentage,
    setTaxPercentage,
    monthlyEarnings,
    yearlyEarnings,
    afterTaxMonthly,
    afterTaxYearly,
  };
};