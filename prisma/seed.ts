/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createDummyUser();
  await createDummyCompany();
  await createDefaultBalanceTypes();
  await createDefaultMccs();
  await createDefaultMerchants();
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
  await prisma.balanceType.upsert({
    where: { slug: 'FOOD' },
    update: {},
    create: {
      name: 'Vale Refeição',
      slug: 'FOOD',
    },
  });

  await prisma.balanceType.upsert({
    where: { slug: 'MEAL' },
    update: {},
    create: {
      name: 'Vale Alimentação',
      slug: 'MEAL',
    },
  });

  await prisma.balanceType.upsert({
    where: { slug: 'CASH' },
    update: {},
    create: {
      name: 'Saldo Livre',
      slug: 'CASH',
    },
  });
}

async function createDefaultMccs() {
  const foodBalanceType = await prisma.balanceType.findUnique({
    where: { slug: 'FOOD' },
  });
  const mealBalanceType = await prisma.balanceType.findUnique({
    where: { slug: 'MEAL' },
  });

  await prisma.mcc.upsert({
    where: { code: '5411' },
    update: {},
    create: {
      code: '5411',
      balanceTypeId: foodBalanceType!.balanceTypeId,
    },
  });

  await prisma.mcc.upsert({
    where: { code: '5412' },
    update: {},
    create: {
      code: '5412',
      balanceTypeId: foodBalanceType!.balanceTypeId,
    },
  });

  await prisma.mcc.upsert({
    where: { code: '5812' },
    update: {},
    create: {
      code: '5812',
      balanceTypeId: mealBalanceType!.balanceTypeId,
    },
  });
}

const createDefaultMerchants = async () => {
  const foodMcc = await prisma.mcc.findUnique({
    where: { code: '5411' },
  });

  await prisma.merchant.upsert({
    where: { name: 'UBER EATS                   SAO PAULO BR' },
    update: {},
    create: {
      name: 'UBER EATS                   SAO PAULO BR',
      mccId: foodMcc!.mccId,
    },
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
