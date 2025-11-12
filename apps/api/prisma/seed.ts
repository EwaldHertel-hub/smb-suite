import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_OWNER_EMAIL ?? 'owner@example.com';
  const name  = process.env.SEED_OWNER_NAME  ?? 'Owner';
  const pass  = process.env.SEED_OWNER_PASS  ?? 'SuperSicher!123';
  const org   = process.env.SEED_ORG_NAME    ?? 'Musterfirma GmbH';

  let organization = await prisma.organization.findFirst({ where: { name: org }});
  if (!organization) organization = await prisma.organization.create({ data: { name: org }});

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) { console.log('User existiert bereits:', email); return; }

  const passwordHash = await bcrypt.hash(pass, 10);
  await prisma.user.create({
    data: {
      email, name, passwordHash,
      role: 'OWNER',
      organizationId: organization.id
    }
  });
  console.log('Owner angelegt:', email, '→ Org:', organization.name);
}

main().finally(() => prisma.$disconnect());