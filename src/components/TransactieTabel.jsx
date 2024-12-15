"use client";

import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import DataTable from "react-data-table-component";

const TransactieTabel = () => {
  const [transacties, setTransacties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransacties() {
      try {
        const response = await fetch("api/transacties");
        const data = await response.json();
        setTransacties(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchTransacties();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Bedrag",
      selector: (row) => row.bedrag,
      sortable: true,
    },
    {
      name: "Datum",
      selector: (row) => row.datum,
      sortable: true,
    },
    {
      name: "Omschrijving",
      selector: (row) => row.omschrijving,
      sortable: true,
    },
  ];

  return (
    <section className="container mx-auto px-6 py-6">
      {loading && <Spinner />}
      {error && <p className="text-red-500">Er is een fout opgetreden: {error.message}</p>}

      {!loading && !error && transacties.length > 0 && (
        <div id="recipients" className="p-8 mt-6 lg:mt-0 rounded shadow">
          <DataTable
            title="Transacties"
            columns={columns}
            data={transacties}
            pagination
            responsive
            highlightOnHover
            pointerOnHover
          />
        </div>
      )}

      {!loading && !error && transacties.length === 0 && (
        <p className="mt-4">Er zijn geen transacties gevonden.</p>
      )}
    </section>
  );
};

export default TransactieTabel;
