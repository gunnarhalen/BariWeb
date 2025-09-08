import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { PatientsTable } from "@/components/patients-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";

import patientsData from "./patients-data.json";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <PatientsTable data={patientsData} />
          </div>
        </div>
      </div>
    </>
  );
}
