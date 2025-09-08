"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BarChartProps {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  color: string;
  className?: string;
}

export function BarChartComponent({
  title,
  data,
  dataKey,
  color,
  className,
}: BarChartProps) {
  return (
    <Card className={cn("focus:outline-none", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-48 focus:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 2)}
              />
              <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
