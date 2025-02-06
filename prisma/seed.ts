/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createDummyUser();
  await createDummyCompany();
  await createDefaultBalanceTypes();
}

async function createDummyUser() {
  await prisma.user.upsert({
    where: { cpf: '00000000000' },
    update: {},
    create: {
      fullname: 'Yuri',
      cpf: '00000000000',
    },
  });
}

async function createDummyCompany() {
  await prisma.company.upsert({
    where: { cnpj: '00000000000001' },
    update: {},
    create: {
      name: 'Caju',
      cnpj: '00000000000001',
    },
  });
}

async function createDefaultBalanceTypes() {
  await prisma.balanceType.createMany({
    data: [
      { name: 'Vale Refeição', slug: 'FOOD' },
      { name: 'Vale Alimentação', slug: 'MEAL' },
      { name: 'Saldo Livre', slug: 'CASH' },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
