import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <TopBar />
      <main className="md:ml-64 pt-16 pb-24 md:pb-4 min-h-screen">
        <div
          className="px-4 md:px-6 py-3"
          style={{ zoom: "0.9" }}
        >
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}