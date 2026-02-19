import { PrismaService } from '../src/prisma/prisma.service'
import { Role } from '@prisma/client'
import { hashPassword } from '../src/auth/password.util'

import * as dotenv from 'dotenv'
dotenv.config()
const prisma = new PrismaService()
async function main() {
const name = "Admin"
  const email = 'admin@admin.com'
  const plainPassword = 'Admin123!'

  const hashedPassword = hashPassword(plainPassword)

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: name,
      email,
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('✅ Utilisateur admin crée.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
