import { DashboardStats } from "@/components/DashboardStats";
import { QuincenaTable } from "@/components/QuincenaTable";

export default function DashboardPage() {
  const q1Movements = [
    { id: 1, concept: "Casa", amount: 100000 },
    { id: 2, concept: "Cadena", amount: 150000 },
    { id: 3, concept: "Movistar", amount: 50000 },
  ];

  const q2Movements = [
    { id: 1, concept: "Tarjeta RAPPI", amount: 800000 },
    { id: 2, concept: "Tarjeta NU", amount: 160000 },
    { id: 3, concept: "Bananza", amount: 50000 },
  ];

  return (
    <main className="max-w-[1480px] mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col justify-start relative z-10" data-purpose="dashboard-content">
      <DashboardStats />
      
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 relative" data-purpose="quincenas-grid">
        <QuincenaTable 
          title="Quincena 1"
          dateRange="1 - 15 Enero"
          headerColor="bg-[#93c5fd]"
          subheaderColor="bg-[#dbeafe]"
          movements={q1Movements}
          total={300000}
        />
        <QuincenaTable 
          title="Quincena 2"
          dateRange="16 - 31 Enero"
          headerColor="bg-[#86efac]"
          subheaderColor="bg-[#bbf7d0]"
          movements={q2Movements}
          total={1010000}
        />
        <QuincenaTable 
          title="Quincena 3"
          dateRange="1 - 15 Febrero"
          headerColor="bg-[#fca5a5]"
          subheaderColor="bg-[#fecaca]"
          movements={[]}
          total={0}
        />
        <QuincenaTable 
          title="Quincena 4"
          dateRange="16 - 28 Febrero"
          headerColor="bg-[#c4b5fd]"
          subheaderColor="bg-[#ddd6fe]"
          movements={[]}
          total={0}
        />
      </section>
    </main>
  );
}
