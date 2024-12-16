'use client';

import { useState } from 'react';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/exportExcel', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Fout bij het ophalen van het Excel-bestand.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Overzicht.xlsx'; // Bestandsnaam
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Vrijgeven van de URL
    } catch (error) {
      console.error('Fout tijdens exporteren:', error);
      alert('Er is een fout opgetreden bij het exporteren.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {loading ? 'Exporteren...' : 'Exporteren naar Excel'}
    </button>
  );
}
