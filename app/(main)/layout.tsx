import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-900 font-pixel-body flex flex-col justify-between select-none relative overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
