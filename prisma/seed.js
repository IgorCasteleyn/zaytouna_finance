const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Voeg configuratie toe
  await prisma.configuratie.createMany({
    data: [{ value: 641.55, academiejaar: "2024-2025" }],
  });

  console.log("Initieel beginbedrag is toegevoegd.");

  // Voeg transacties toe
  await prisma.transacties.createMany({
    data: [
      {
        omschrijving: "Lidgeld betaling",
        type: "Inkomst",
        bedrag: 120.0,
        datum: new Date("2024-04-12"),
        door: "Lisa Vermeulen",
        betaald: true,
        categorie: "Lidgeld",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Aankoop kantoorbenodigdheden",
        type: "Uitgave",
        bedrag: 30.0,
        datum: new Date("2024-05-05"),
        door: "Kantoor Supplies",
        betaald: true,
        categorie: "Materiaal",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Vergoeding voor spreker",
        type: "Uitgave",
        bedrag: 150.0,
        datum: new Date("2024-06-01"),
        door: "Spreker Z",
        betaald: false,
        categorie: "Spreker",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Sponsoring lokale sportclub",
        type: "Inkomst",
        bedrag: 500.0,
        datum: new Date("2024-07-15"),
        door: "Bedrijf Y",
        betaald: true,
        categorie: "Sponsoring",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Kantoorhuur betaling",
        type: "Uitgave",
        bedrag: 200.0,
        datum: new Date("2024-08-22"),
        door: "Kantoorverhuur BV",
        betaald: true,
        categorie: "Huur",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Inkomsten lidgeld",
        type: "Inkomst",
        bedrag: 100.0,
        datum: new Date("2024-01-15"),
        door: "Jan Jansen",
        betaald: true,
        categorie: "Lidgeld",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Aankoop schoonmaakmateriaal",
        type: "Uitgave",
        bedrag: 45.0,
        datum: new Date("2024-02-10"),
        door: "Marie De Vries",
        betaald: true,
        categorie: "Materiaal",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Sponsoring evenement",
        type: "Inkomst",
        bedrag: 250.0,
        datum: new Date("2024-03-05"),
        door: "Bedrijf X",
        betaald: true,
        categorie: "Sponsoring",
        naamFoto: "/",
        fotoUrl: "/",
      },
      {
        omschrijving: "Huur vergaderruimte",
        type: "Uitgave",
        bedrag: 75.0,
        datum: new Date("2024-03-20"),
        door: "Vergaderzaal Y",
        betaald: false,
        categorie: "Huur",
        naamFoto: "/",
        fotoUrl: "/",
      },
    ],
  });

  console.log("Transacties zijn toegevoegd.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
