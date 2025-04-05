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
  } = useWorkCalculator();

  const handleInputChange = (setter: (value: number) => void, value: string) => {
    if (value === "") {
      setter(0);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setter(Math.max(0, numValue)); // Ensure value is not negative
      }
    }
  };

  const formatInputValue = (value: number) => {
    return value === 0 ? "" : value.toString();
  };

  return (
    <Card className="border-none drop-shadow-sm max-w-md mx-auto">
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
            placeholder="0"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workHours">Daily Hours</Label>
          <Input
            id="workHours"
            type="number"
            value={formatInputValue(workHours)}
            onChange={(e) => handleInputChange(setWorkHours, e.target.value)}
            placeholder="8"
            min="0"
            max="24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workDays">Days per Week</Label>
          <Input
            id="workDays"
            type="number"
            value={formatInputValue(workDays)}
            onChange={(e) => handleInputChange(setWorkDays, e.target.value)}
            placeholder="5"
            min="0"
            max="7"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
          <Input
            id="taxPercentage"
            type="number"
            value={formatInputValue(taxPercentage)}
            onChange={(e) => handleInputChange(setTaxPercentage, e.target.value)}
            placeholder="30"
            min="0"
            max="100"
          />
        </div>

        <div className="pt-6 space-y-4">
          <div>
            <h3 className="font-medium">Monthly Earnings:</h3>
            <p className="text-xl font-bold">
              {formatCurrency(monthlyEarnings)}
            </p>
            <p className="text-sm text-muted-foreground">
              After tax: {formatCurrency(afterTaxMonthly)}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Yearly Earnings:</h3>
            <p className="text-xl font-bold">
              {formatCurrency(yearlyEarnings)}
            </p>
            <p className="text-sm text-muted-foreground">
              After tax: {formatCurrency(afterTaxYearly)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};