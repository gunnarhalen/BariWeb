"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { IconTimeline, IconChartBar } from "@tabler/icons-react";

interface ChartCardProps {
  title: string;
  data: Array<{
    date: string;
    value?: number;
    meals?: number;
  }>;
  goal: number;
  color: string;
  goalColor?: string;
  unit?: string;
  icon?: React.ReactNode;
  gradientId: string;
  dataKey?: string;
  showGoal?: boolean;
  chartType?: "area" | "bar";
  actionButton?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  goal,
  color,
  goalColor = "#ef4444",
  unit = "",
  icon,
  gradientId,
  dataKey = "value",
  showGoal = true,
  chartType = "area",
  actionButton,
}) => {
  const [currentChartType, setCurrentChartType] = useState<"area" | "bar">(chartType);
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base">{title}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentChartType("area")}
                className={`h-6 w-6 p-0 cursor-pointer ${
                  currentChartType === "area" ? "bg-gray-100" : "hover:bg-gray-200"
                }`}
              >
                <IconTimeline className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentChartType("bar")}
                className={`h-6 w-6 p-0 cursor-pointer ${
                  currentChartType === "bar" ? "bg-gray-100" : "hover:bg-gray-200"
                }`}
              >
                <IconChartBar className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showGoal && (
              <Badge variant="secondary" className="text-xs">
                Meta: {goal} {unit}
              </Badge>
            )}
            {actionButton}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: title,
              color: color,
            },
          }}
          className="h-[200px] w-full"
        >
          {hasData ? (
            currentChartType === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={1.0} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) {
                        return value;
                      }
                      return date.toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        try {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) {
                            return value;
                          }
                          return date.toLocaleDateString("pt-BR", {
                            month: "short",
                            day: "numeric",
                          });
                        } catch {
                          return value;
                        }
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area dataKey={dataKey} type="monotone" fill={`url(#${gradientId})`} stroke={color} strokeWidth={2} />
                {showGoal && (
                  <ReferenceLine
                    y={Number(goal)}
                    stroke={goalColor}
                    strokeDasharray="8 8"
                    strokeWidth={1}
                    isFront={true}
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) {
                        return value;
                      }
                      return date.toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        try {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) {
                            return value;
                          }
                          return date.toLocaleDateString("pt-BR", {
                            month: "short",
                            day: "numeric",
                          });
                        } catch {
                          return value;
                        }
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 4, 4]} />
                {showGoal && (
                  <ReferenceLine
                    y={Number(goal)}
                    stroke={goalColor}
                    strokeDasharray="8 8"
                    strokeWidth={1}
                    isFront={true}
                  />
                )}
              </BarChart>
            )
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">Nenhum dado encontrado</p>
                <p className="text-xs">para o período selecionado</p>
              </div>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
