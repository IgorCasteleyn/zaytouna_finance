const prisma = require("@lib/prisma");

async function main() {
  // Verwijder alle data uit de `transacties` tabel
  await prisma.transacties.deleteMany({});

  // Verwijder alle data uit de `configuratie` tabel
  await prisma.configuratie.deleteMany({});

  console.log("Alle gegevens zijn verwijderd.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
