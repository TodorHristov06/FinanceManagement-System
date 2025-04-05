// features/work-calculator/components/work-calculator-form.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkCalculator } from "../hooks/use-work-calculator";
import { formatCurrency } from "@/lib/utils";

export const WorkCalculatorForm = () => {
  const {
    hourlyRate,
    setHourlyRate,
    hoursPerDay,
    setHoursPerDay,
    daysPerWeek,
    setDaysPerWeek,
    weeksPerMonth,
    setWeeksPerMonth,
    monthlyEarnings,
  } = useWorkCalculator();

  const handleInputChange = (setter: (value: number) => void, value: string) => {
    // If input is empty, set to 0 but display empty string
    if (value === "") {
      setter(0);
    } else {
      const numValue = Number(value);
      // Only update if it's a positive number
      if (!isNaN(numValue) && numValue >= 0) {
        setter(numValue);
      }
    }
  };

  const formatInputValue = (value: number) => {
    // Display empty string for 0 values
    return value === 0 ? "" : value.toString();
  };

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1">
          Work Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate (€)</Label>
          <Input
            id="hourlyRate"
            type="number"
            value={formatInputValue(hourlyRate)}
            onChange={(e) => handleInputChange(setHourlyRate, e.target.value)}
            placeholder="Enter your hourly rate"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hoursPerDay">Hours per day</Label>
          <Input
            id="hoursPerDay"
            type="number"
            value={formatInputValue(hoursPerDay)}
            onChange={(e) => handleInputChange(setHoursPerDay, e.target.value)}
            placeholder="8"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="daysPerWeek">Days per week</Label>
          <Input
            id="daysPerWeek"
            type="number"
            value={formatInputValue(daysPerWeek)}
            onChange={(e) => handleInputChange(setDaysPerWeek, e.target.value)}
            placeholder="5"
            min="0"
            max="7"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weeksPerMonth">Weeks per month</Label>
          <Input
            id="weeksPerMonth"
            type="number"
            value={formatInputValue(weeksPerMonth)}
            onChange={(e) => handleInputChange(setWeeksPerMonth, e.target.value)}
            placeholder="4"
            min="0"
            max="6"
          />
        </div>

        <div className="pt-4">
          <h3 className="font-medium">Monthly Earnings:</h3>
          <p className="text-2xl font-bold">
            {monthlyEarnings > 0 ? formatCurrency(monthlyEarnings) : "€0.00"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};