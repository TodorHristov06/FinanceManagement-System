// app/(dashboard)/work-calculator/page.tsx
"use client";

import { WorkCalculatorForm } from "@/features/work-calculator/components/work-calculator-form";

export default function WorkCalculatorPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <WorkCalculatorForm />
    </div>
  );
}