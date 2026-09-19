import { LlavesCard } from "./LlavesCard";
import { InversionCard } from "./InversionCard";
import { NotesCard } from "./NotesCard";
import { ImagesCard } from "./ImagesCard";

export function DashboardStats() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-purpose="stats-cards-bar">
      {/* Card 1: Llaves Interactive Component */}
      <LlavesCard />

      {/* Card 2: Inversión Interactive Component */}
      <InversionCard />

      {/* Card 3: Notes and Reminders */}
      <NotesCard />

      {/* Card 4: Image Access */}
      <ImagesCard />
    </section>
  );
}
