/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await createDummyUser();
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

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
