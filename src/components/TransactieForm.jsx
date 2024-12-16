"use client";
import { useState } from "react";

const TransactieForm = () => {
  const [formData, setFormData] = useState({
    omschrijving: "",
    type: "",
    bedrag: "",
    datum: "",
    door: "",
    betaald: false,
    categorie: "",
  });
  const [file, setFile] = useState(null); // Bestand voor uploaden
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Post transactie zonder foto
      const transactieResponse = await fetch("/api/transacties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!transactieResponse.ok) {
        throw new Error("Fout bij het toevoegen van transactie.");
      }

      const transactie = await transactieResponse.json();

      // 2. Als er een foto is, upload deze
      if (file) {
        const fileData = new FormData();
        const fileName = `${formData.omschrijving}-${Date.now()}.${file.name.split('.').pop()}`; // Dynamische naam
        fileData.append("file", file, fileName);
        fileData.append("transactieId", transactie.id);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Fout bij het uploaden van de afbeelding.");
        }
      }

      setSuccess(true);
      setFormData({
        omschrijving: "",
        type: "",
        bedrag: "",
        datum: "",
        door: "",
        betaald: false,
        categorie: "",
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500">
      <div className="bg-gray-100 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Nieuwe Transactie</h1>
        {success && (
          <p className="text-green-500 text-center mb-4">
            Transactie succesvol toegevoegd!
          </p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Omschrijving */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Omschrijving
            </label>
            <input
              type="text"
              name="omschrijving"
              value={formData.omschrijving}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select name="type"
              value={formData.type}
              required
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="inkomst">Inkomst</option>
              <option value="uitgave">Uitgave</option>
            </select>
          </div>
          {/* Bedrag */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrag
            </label>
            <input
              type="number"
              name="bedrag"
              step="0.01"
              value={formData.bedrag}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Datum */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Datum
            </label>
            <input
              type="date"
              name="datum"
              value={formData.datum}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Door */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Door
            </label>
            <input
              type="text"
              name="door"
              value={formData.door}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Betaald */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="betaald"
              checked={formData.betaald}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">Betaald</label>
          </div>
          {/* Categorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categorie
            </label>
            <input
              type="text"
              name="categorie"
              value={formData.categorie}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {/* Foto Upload */}
          <div>
            <label>Foto (optioneel)</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Toevoegen..." : "Toevoegen"}
          </button>
        </form>
      </div>
    </div>
  );
};


export default TransactieForm;
