import ExcelJS from "exceljs";
import prisma from "@/lib/prisma"; // Zorg ervoor dat je prisma importeert

// Functie om het beginbedrag op te halen, inclusief academiejaar als parameter
const getBeginsaldo = async (academiejaar) => {
  const configuratie = await prisma.configuratie.findFirst({
    where: { academiejaar },
  });

  if (!configuratie) {
    throw new Error("Fout bij ophalen beginbedrag");
  }

  return configuratie.value;
};

/**
 * Verwerkt de data en maakt een Excel-bestand.
 * @param {Array} data - Array van transacties uit de database.
 * @param {String} academiejaar - Academiejaar.
 * @returns {Buffer} - Excel-bestand als buffer.
 */
export async function generateExcel(data, academiejaar) {
  const beginBedrag = await getBeginsaldo(academiejaar); // Haal het beginbedrag op via de database

  // Groepeer data per maand en categorie
  const groupedData = {};
  data.forEach((item) => {
    const maand = new Date(item.datum).toLocaleString("nl-NL", {
      month: "long",
    });
    const categorie = item.categorie;

    if (!groupedData[maand]) groupedData[maand] = {};
    if (!groupedData[maand][categorie]) groupedData[maand][categorie] = [];
    groupedData[maand][categorie].push(item);
  });

  // Maak een nieuwe Excel-workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Overzicht");

  // Voeg kolommen toe voor transacties
  sheet.columns = [
    { width: 15 },
    { header: "Datum", key: "datum", width: 15 },
    { header: "Beschrijving", key: "omschrijving", width: 30 },
    { header: "Bedrag (€)", key: "bedrag", width: 15 },
    { header: "Door Wie", key: "door", width: 20 },
    { header: "Tussenstand Saldo (€)", key: "saldo", width: 20 },
  ];

  // Voeg gegroepeerde data toe aan het werkblad
  Object.entries(groupedData).forEach(([maand, categorieën]) => {
    // Maand header in groot formaat
    sheet.addRow([maand]).font = { size: 16, bold: true };
    sheet.addRow([]); // Lege rij na maand header

    let maandTotaal = beginBedrag; // Begin saldo voor deze maand

    // Itereer door de categorieën voor deze maand
    Object.entries(categorieën).forEach(([categorie, transacties]) => {
      // Voeg categorie als header toe
      sheet.addRow([categorie]).font = { bold: true };

      // Voeg transacties voor deze categorie toe
      transacties.forEach((transactie) => {
        // Stel het teken en de kleur in afhankelijk van het type
        let bedragOpmaak = {
          value: transactie.bedrag.toFixed(2),
          style: {},
        };

        // Stel kleur en symbool in afhankelijk van het type
        if (transactie.type === "Inkomst") {
          bedragOpmaak.value = "+" + bedragOpmaak.value; // Voeg plus toe voor inkomsten
          bedragOpmaak.style = { font: { color: { argb: "FF00FF00" } } }; // Groen
          maandTotaal += transactie.bedrag; // Voeg bedrag toe aan maandtotaal
        } else if (transactie.type === "Uitgave") {
          bedragOpmaak.value = "-" + bedragOpmaak.value; // Voeg min toe voor uitgaven
          bedragOpmaak.style = { font: { color: { argb: "FFFF0000" } } }; // Rood
          maandTotaal -= transactie.bedrag; // Trek bedrag af van maandtotaal
        }

        // Voeg de rij toe met de juiste waarden en het saldo
        const newRow = sheet.addRow({
          datum: new Date(transactie.datum).toLocaleDateString("nl-NL"),
          omschrijving: transactie.omschrijving,
          bedrag: bedragOpmaak.value,
          door: transactie.door,
          saldo: "", // Laat de saldo leeg voor individuele transacties
        });

        // Pas de stijl toe op de "bedrag" kolom (index 3, omdat het de 4e kolom is)
        newRow.getCell(3).style = bedragOpmaak.style; // Pas de opmaak van de 'bedrag' kolom aan
      });

      // Lege rij na elke categorie
      sheet.addRow([]);
    });

    // Voeg een rij toe met de tussenstand van het saldo, in het midden van de rij
    sheet.addRow(["", "", "", "", "", `€ ${maandTotaal.toFixed(2)}`]).font = {
      bold: true,
      size: 10,
    };

    // Lege rij na elke maand
    sheet.addRow([]);
  });

  // Schrijf naar een buffer en retourneer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
