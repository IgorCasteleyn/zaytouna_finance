"use client";

import { useEffect, useState } from "react";

const HuidigBedrag = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch("/api/budget", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Kon budget niet ophalen.");
        }
        const budgetData = await res.json();
        setData(budgetData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBudget();
  }, []);

  if (error) {
    return <div className="text-red-500">Fout: {error}</div>;
  }

  if (!data) {
    return <div>Budget wordt geladen...</div>;
  }

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold">Huidig Budget</h2>
      <p>
        <strong>Academiejaar:</strong> {data.academiejaar}
      </p>
      <p>
        <strong>Beginbedrag:</strong> €{data.beginBedrag.toFixed(2)}
      </p>
      <p>
        <strong>Som van Transacties:</strong> €{data.transactiesSom.toFixed(2)}
      </p>
      <p>
        <strong>Huidig Bedrag:</strong> €{data.huidigBedrag.toFixed(2)}
      </p>
    </div>
  );
};

export default HuidigBedrag;
