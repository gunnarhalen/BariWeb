"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  selectedRange: "7" | "15" | "30";
  onRangeChange: (range: "7" | "15" | "30") => void;
  className?: string;
}

const ranges = [
  { value: "7" as const, label: "7 dias" },
  { value: "15" as const, label: "15 dias" },
  { value: "30" as const, label: "30 dias" },
];

export function DateRangeSelector({
  selectedRange,
  onRangeChange,
  className,
}: DateRangeSelectorProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onRangeChange(range.value)}
          className="text-xs"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
