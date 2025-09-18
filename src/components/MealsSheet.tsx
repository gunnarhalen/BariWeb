"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconListDetails, IconBowl, IconCalendar, IconFlame } from "@tabler/icons-react";
import { getPatientIndividualMeals, type IndividualMeal } from "@/services/nutritionistService";

// Usar o tipo IndividualMeal do serviço
type MealData = IndividualMeal;

interface MealsSheetProps {
  patientId: string;
  maxDays?: number;
}

export const MealsSheet: React.FC<MealsSheetProps> = ({ patientId, maxDays = 30 }) => {
  const [sortBy, setSortBy] = useState<"date" | "calories">("date");
  const [meals, setMeals] = useState<MealData[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar dados reais das refeições
  useEffect(() => {
    const fetchMeals = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        const realMeals = await getPatientIndividualMeals(patientId, maxDays);

        setMeals(realMeals);
      } catch (error) {
        console.error("Erro ao buscar refeições:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [patientId, maxDays]);

  // Componente para exibir uma refeição individual
  const MealCard = ({ meal, showCalories = false }: { meal: MealData; showCalories?: boolean }) => (
    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">
          {showCalories ? (
            <div>
              {new Date(meal.date).toLocaleDateString("pt-BR")} - {meal.time}h
            </div>
          ) : (
            <div>{meal.time}h</div>
          )}
        </div>
      </div>
      <div className="text-sm mb-2">
        {meal.foods && meal.foods.length > 0 ? meal.foods.join(", ") : "Alimentos não especificados"}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>{meal.calories} kcal</span>
        {(meal.protein || 0) > 0 && <span>{(meal.protein || 0).toFixed(1)}g proteína</span>}
        {(meal.carb || 0) > 0 && <span>{(meal.carb || 0).toFixed(1)}g carboidratos</span>}
        {(meal.fat || 0) > 0 && <span>{(meal.fat || 0).toFixed(1)}g gordura</span>}
      </div>
    </div>
  );

  // Componente para exibir refeições agrupadas por data
  const TimelineView = ({ meals }: { meals: MealData[] }) => {
    const groupedMeals = meals.reduce((acc, meal) => {
      const date = meal.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {} as Record<string, MealData[]>);

    return (
      <div className="space-y-6">
        {Object.entries(groupedMeals)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, dayMeals]) => (
            <div key={date}>
              <div className="font-semibold text-sm text-muted-foreground mb-3">
                {new Date(date).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="space-y-2">
                {dayMeals.map((meal: MealData, index: number) => (
                  <MealCard key={`${date}-${index}`} meal={meal} />
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  // Componente para exibir refeições ordenadas por calorias
  const CaloriesView = ({ meals }: { meals: MealData[] }) => (
    <div className="space-y-2">
      {meals.map((meal, index) => (
        <MealCard key={index} meal={meal} showCalories={true} />
      ))}
    </div>
  );

  // Função para ordenar refeições
  const getSortedMeals = (): MealData[] => {
    const sorted = [...meals];

    // Ordenação
    if (sortBy === "calories") {
      sorted.sort((a, b) => b.calories - a.calories);
    } else {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return sorted;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer">
          <IconListDetails className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:max-w-none flex flex-col">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <IconBowl className="h-5 w-5" />
            Refeições
          </SheetTitle>
        </SheetHeader>

        {/* Controles */}
        <div className="flex items-center gap-3 mx-4">
          <span className="text-sm font-medium text-muted-foreground">Ordenar:</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("date")}
              className={`flex items-center gap-2 rounded-md cursor-pointer ${
                sortBy === "date" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <IconCalendar className="h-4 w-4" />
              Data
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy("calories")}
              className={`flex items-center gap-2 rounded-md cursor-pointer ${
                sortBy === "calories" ? "bg-gray-100 text-gray-900" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <IconFlame className="h-4 w-4" />
              Calorias
            </Button>
          </div>
        </div>

        {/* Timeline ou Lista */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-4 pb-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Carregando refeições...</div>
              </div>
            ) : getSortedMeals().length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Nenhuma refeição encontrada</div>
                  <div className="text-xs text-muted-foreground mt-1">para o período selecionado</div>
                </div>
              </div>
            ) : sortBy === "date" ? (
              <TimelineView meals={getSortedMeals()} />
            ) : (
              <CaloriesView meals={getSortedMeals()} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
