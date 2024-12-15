const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.configuratie.createMany({
    data: [{ value: 641.55, academiejaar: "2024-2025" }],
  });

  console.log("Initiele beginbedrag is toegevoegd.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
