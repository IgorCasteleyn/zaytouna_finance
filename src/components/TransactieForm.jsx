"use client";
import { useState, useEffect } from "react";

const TransactieForm = () => {
  const [formData, setFormData] = useState({
    omschrijving: "",
    type: "",
    bedrag: "",
    datum: "",
    door: "",
    betaald: false,
    categorie: "",
    naamFoto: "",
    fotoUrl: "/"
  });
  const [file, setFile] = useState(null); // State for the file
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories
  const [newCategory, setNewCategory] = useState(''); // State for new category input

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categorien"); // Corrected to /api/categorien
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Simple file validation (optional)
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(selectedFile.type)) {
        alert("Alleen JPG, JPEG of PNG bestanden zijn toegestaan.");
        return;
      }
      if (selectedFile.size > maxSize) {
        alert("Bestand te groot. Maximaal 5MB.");
        return;
      }
      setFile(selectedFile);
    }
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
        const fileName = formData.naamFoto || file.name; // Dynamische naam (use file name if no naamFoto)
        fileData.append("file", file, fileName);
        fileData.append("transactieId", transactie.id);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Fout bij het uploaden van de afbeelding.");
        }

        // Reset file after successful upload
        setFile(null);
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
        naamFoto: "",
        fotoUrl: "/"
      });
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
            <select
              name="type"
              value={formData.type}
              required
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>Kies een type</option>
              <option value="Inkomst">Inkomst</option>
              <option value="Uitgave">Uitgave</option>
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
              min={0}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Terug betaald?
            </label>
            <select
              name="betaald"
              value={formData.betaald}
              required
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={true}>Ja</option>
              <option value={false}>Nee</option>
            </select>
          </div>
          {/* Categorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categorie
            </label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>Selecteer een categorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">Nieuwe categorie...</option>
            </select>
            {formData.categorie === 'new' && (
              <input
                type="text"
                name="categorie"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Typ een nieuwe categorie"
                className="mt-1 block w-full border-gray-300 h-8 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
          {/* Naam Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Naam Foto
            </label>
            <input
              type="text"
              name="naamFoto"
              value={formData.naamFoto}
              onChange={handleInputChange}
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
