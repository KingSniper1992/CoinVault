import { DashboardStats } from "@/components/DashboardStats";
import { QuincenaTable } from "@/components/QuincenaTable";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch real categories and saved quincenas
  const [
    { data: ingresos }, 
    { data: egresos },
    { data: quincenasData }
  ] = await Promise.all([
    supabase.from("tipos_ingreso").select("*").eq("estado", "activo"),
    supabase.from("tipos_egreso").select("*").eq("estado", "activo"),
    supabase.from("dashboard_quincenas").select("*")
  ]);

  const realCategories = [
    ...(ingresos || []).map((i: any) => ({
      id: `ing-${i.id}`,
      name: i.nombre,
      type: "income" as const,
      defaultAmount: i.monto
    })),
    ...(egresos || []).map((e: any) => ({
      id: `egr-${e.id}`,
      name: e.nombre,
      type: "expense" as const,
      defaultAmount: e.monto
    }))
  ];

  // Helper to safely get quincena data or defaults
  const getQuincenaData = (id: string, defaultTitle: string, defaultDate: string) => {
    const qData = quincenasData?.find((q: any) => q.id === id);
    if (qData) {
      return {
        title: qData.title || defaultTitle,
        dateText: qData.date_text || defaultDate,
        movements: qData.movements || [],
      };
    }
    return { title: defaultTitle, dateText: defaultDate, movements: [] };
  };

  const q1 = getQuincenaData("q1", "Quincena 1", "1 - 15 Enero");
  const q2 = getQuincenaData("q2", "Quincena 2", "16 - 31 Enero");
  const q3 = getQuincenaData("q3", "Quincena 3", "1 - 15 Febrero");
  const q4 = getQuincenaData("q4", "Quincena 4", "16 - 28 Febrero");

  return (
    <main className="max-w-[1480px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col justify-start relative z-10" data-purpose="dashboard-content">
      <DashboardStats />
      
      {/* Items start instead of stretch so boxes only take up needed height */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative items-start flex-1 min-h-[500px]" data-purpose="quincenas-grid">
        <QuincenaTable 
          quincenaId="q1"
          initialTitle={q1.title}
          initialDateText={q1.dateText}
          headerColor="bg-[#93c5fd]"
          subheaderColor="bg-[#dbeafe]"
          initialMovements={q1.movements}
          categories={realCategories}
        />
        <QuincenaTable 
          quincenaId="q2"
          initialTitle={q2.title}
          initialDateText={q2.dateText}
          headerColor="bg-[#86efac]"
          subheaderColor="bg-[#bbf7d0]"
          initialMovements={q2.movements}
          categories={realCategories}
        />
        <QuincenaTable 
          quincenaId="q3"
          initialTitle={q3.title}
          initialDateText={q3.dateText}
          headerColor="bg-[#fca5a5]"
          subheaderColor="bg-[#fecaca]"
          initialMovements={q3.movements}
          categories={realCategories}
        />
        <QuincenaTable 
          quincenaId="q4"
          initialTitle={q4.title}
          initialDateText={q4.dateText}
          headerColor="bg-[#c4b5fd]"
          subheaderColor="bg-[#ddd6fe]"
          initialMovements={q4.movements}
          categories={realCategories}
        />
      </section>
    </main>
  );
}
