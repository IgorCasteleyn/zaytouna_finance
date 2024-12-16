import HuidigBedrag from "@/components/HuidigBedrag";
import Export from "@/components/Export";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Export />
      <HuidigBedrag />
    </div>
  );
}
