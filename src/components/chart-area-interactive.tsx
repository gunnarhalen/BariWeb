"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Gráfico de acompanhamento nutricional";

const chartData = [
  { date: "2024-04-01", calories: 1850, protein: 120 },
  { date: "2024-04-02", calories: 2100, protein: 135 },
  { date: "2024-04-03", calories: 1950, protein: 125 },
  { date: "2024-04-04", calories: 2200, protein: 140 },
  { date: "2024-04-05", calories: 1800, protein: 115 },
  { date: "2024-04-06", calories: 2050, protein: 130 },
  { date: "2024-04-07", calories: 1900, protein: 120 },
  { date: "2024-04-08", calories: 2150, protein: 135 },
  { date: "2024-04-09", calories: 1750, protein: 110 },
  { date: "2024-04-10", calories: 2000, protein: 125 },
  { date: "2024-04-11", calories: 2250, protein: 145 },
  { date: "2024-04-12", calories: 1950, protein: 120 },
  { date: "2024-04-13", calories: 2100, protein: 135 },
  { date: "2024-04-14", calories: 1850, protein: 115 },
  { date: "2024-04-15", calories: 2000, protein: 125 },
  { date: "2024-04-16", calories: 2050, protein: 130 },
  { date: "2024-04-17", calories: 2200, protein: 140 },
  { date: "2024-04-18", calories: 1900, protein: 120 },
  { date: "2024-04-19", calories: 2150, protein: 135 },
  { date: "2024-04-20", calories: 1800, protein: 115 },
  { date: "2024-04-21", calories: 2000, protein: 125 },
  { date: "2024-04-22", calories: 1950, protein: 120 },
  { date: "2024-04-23", calories: 2100, protein: 135 },
  { date: "2024-04-24", calories: 2250, protein: 145 },
  { date: "2024-04-25", calories: 1900, protein: 120 },
  { date: "2024-04-26", calories: 2050, protein: 130 },
  { date: "2024-04-27", calories: 2000, protein: 125 },
  { date: "2024-04-28", calories: 1850, protein: 115 },
  { date: "2024-04-29", calories: 2150, protein: 135 },
  { date: "2024-04-30", calories: 1950, protein: 120 },
  { date: "2024-05-01", calories: 2000, protein: 125 },
  { date: "2024-05-02", calories: 2100, protein: 135 },
  { date: "2024-05-03", calories: 1850, protein: 115 },
  { date: "2024-05-04", calories: 2200, protein: 140 },
  { date: "2024-05-05", calories: 1950, protein: 120 },
  { date: "2024-05-06", calories: 2050, protein: 130 },
  { date: "2024-05-07", calories: 2000, protein: 125 },
  { date: "2024-05-08", calories: 1900, protein: 120 },
  { date: "2024-05-09", calories: 2150, protein: 135 },
  { date: "2024-05-10", calories: 1800, protein: 115 },
  { date: "2024-05-11", calories: 2000, protein: 125 },
  { date: "2024-05-12", calories: 1950, protein: 120 },
  { date: "2024-05-13", calories: 2100, protein: 135 },
  { date: "2024-05-14", calories: 2250, protein: 145 },
  { date: "2024-05-15", calories: 1900, protein: 120 },
  { date: "2024-05-16", calories: 2050, protein: 130 },
  { date: "2024-05-17", calories: 2000, protein: 125 },
  { date: "2024-05-18", calories: 1850, protein: 115 },
  { date: "2024-05-19", calories: 2150, protein: 135 },
  { date: "2024-05-20", calories: 1950, protein: 120 },
  { date: "2024-05-21", calories: 2000, protein: 125 },
  { date: "2024-05-22", calories: 2100, protein: 135 },
  { date: "2024-05-23", calories: 1800, protein: 115 },
  { date: "2024-05-24", calories: 2050, protein: 130 },
  { date: "2024-05-25", calories: 1950, protein: 120 },
  { date: "2024-05-26", calories: 2200, protein: 140 },
  { date: "2024-05-27", calories: 2000, protein: 125 },
  { date: "2024-05-28", calories: 1850, protein: 115 },
  { date: "2024-05-29", calories: 2100, protein: 135 },
  { date: "2024-05-30", calories: 1950, protein: 120 },
  { date: "2024-05-31", calories: 2000, protein: 125 },
  { date: "2024-06-01", calories: 2050, protein: 130 },
  { date: "2024-06-02", calories: 1900, protein: 120 },
  { date: "2024-06-03", calories: 2150, protein: 135 },
  { date: "2024-06-04", calories: 2000, protein: 125 },
  { date: "2024-06-05", calories: 1850, protein: 115 },
  { date: "2024-06-06", calories: 2100, protein: 135 },
  { date: "2024-06-07", calories: 1950, protein: 120 },
  { date: "2024-06-08", calories: 2200, protein: 140 },
  { date: "2024-06-09", calories: 2000, protein: 125 },
  { date: "2024-06-10", calories: 1850, protein: 115 },
  { date: "2024-06-11", calories: 2050, protein: 130 },
  { date: "2024-06-12", calories: 1950, protein: 120 },
  { date: "2024-06-13", calories: 2100, protein: 135 },
  { date: "2024-06-14", calories: 2000, protein: 125 },
  { date: "2024-06-15", calories: 1850, protein: 115 },
  { date: "2024-06-16", calories: 2150, protein: 135 },
  { date: "2024-06-17", calories: 1950, protein: 120 },
  { date: "2024-06-18", calories: 2000, protein: 125 },
  { date: "2024-06-19", calories: 2100, protein: 135 },
  { date: "2024-06-20", calories: 1900, protein: 120 },
  { date: "2024-06-21", calories: 2050, protein: 130 },
  { date: "2024-06-22", calories: 2000, protein: 125 },
  { date: "2024-06-23", calories: 1850, protein: 115 },
  { date: "2024-06-24", calories: 2150, protein: 135 },
  { date: "2024-06-25", calories: 1950, protein: 120 },
  { date: "2024-06-26", calories: 2000, protein: 125 },
  { date: "2024-06-27", calories: 2100, protein: 135 },
  { date: "2024-06-28", calories: 1900, protein: 120 },
  { date: "2024-06-29", calories: 2050, protein: 130 },
  { date: "2024-06-30", calories: 2000, protein: 125 },
];

const chartConfig = {
  nutrition: {
    label: "Acompanhamento Nutricional",
  },
  calories: {
    label: "Calorias",
    color: "hsl(var(--primary))",
  },
  protein: {
    label: "Proteína",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Acompanhamento Nutricional</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Consumo de calorias e proteína dos últimos 3 meses
          </span>
          <span className="@[540px]/card:hidden">Últimos 3 meses</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCalories" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-calories)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-calories)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillProtein" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-protein)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-protein)"
                  stopOpacity={0.1}
                />
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="protein"
              type="natural"
              fill="url(#fillProtein)"
              stroke="var(--color-protein)"
              stackId="a"
            />
            <Area
              dataKey="calories"
              type="natural"
              fill="url(#fillCalories)"
              stroke="var(--color-calories)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
