const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.cancha.deleteMany(); // Limpiar tabla antes de poblar

    await prisma.cancha.createMany({
    data: [
        { nombre: 'Cancha Estelar 1 - Fútbol 7', tipo: 'Gras Sintético', precioHora: 80.00 },
        { nombre: 'Cancha Estelar 2 - Fútbol 7', tipo: 'Gras Sintético', precioHora: 80.00 },
        { nombre: 'Losa Polideportiva', tipo: 'Losa Multifuncional', precioHora: 50.00 }
    ]
    });
    console.log('Seed ejecutado con éxito');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });