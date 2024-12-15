import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const transacties = await prisma.transacties.findMany();
  return new Response(JSON.stringify(transacties), { status: 200 });
}
