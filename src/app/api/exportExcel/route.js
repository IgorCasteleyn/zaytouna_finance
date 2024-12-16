import prisma from '@/lib/prisma';
import { generateExcel } from '@/services/exportService';

export const GET = async (req) => {
  try {
    // Query data uit de database
    const data = await prisma.transacties.findMany({
      orderBy: { datum: 'asc' },
    });

    // Genereer Excel-bestand
    const excelBuffer = await generateExcel(data,'2024-2025');

    // Stel headers in en retourneer het Excel-bestand
    return new Response(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=Overzicht.xlsx',
      },
    });
  } catch (error) {
    console.error('Fout bij het genereren van Excel-bestand:', error);
    return new Response('Er is een fout opgetreden.', { status: 500 });
  }
};
