import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo church
  const church = await prisma.church.upsert({
    where: { name: 'Église de la Paix' },
    update: {},
    create: {
      name: 'Église de la Paix',
      address: '123 Rue de la Paix, 75001 Paris'
    }
  })

  // Create demo admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@church.com' },
    update: {},
    create: {
      email: 'admin@church.com',
      password: adminPassword,
      firstName: 'Administrateur',
      lastName: 'Église',
      phone: '+33 1 23 45 67 89',
      role: 'ADMIN',
      churchId: church.id
    }
  })

  // Create demo user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@church.com' },
    update: {},
    create: {
      email: 'user@church.com',
      password: userPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+33 1 23 45 67 90',
      role: 'USER',
      churchId: church.id
    }
  })

  // Create demo services
  const nextSunday = new Date()
  nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()))
  nextSunday.setHours(10, 0, 0, 0)

  const nextWednesday = new Date()
  nextWednesday.setDate(nextWednesday.getDate() + (3 - nextWednesday.getDay()))
  nextWednesday.setHours(19, 0, 0, 0)

  const service1 = await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      title: 'Service du dimanche matin',
      description: 'Service principal de l\'église',
      date: nextSunday,
      time: '10:00',
      location: 'Salle principale',
      status: 'PUBLISHED',
      churchId: church.id
    }
  })

  const service2 = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      title: 'Réunion de prière',
      description: 'Réunion de prière du mercredi',
      date: nextWednesday,
      time: '19:00',
      location: 'Salle de prière',
      status: 'PUBLISHED',
      churchId: church.id
    }
  })

  // Create service assignments
  await prisma.serviceAssignment.upsert({
    where: { 
      serviceId_userId: {
        serviceId: service1.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      serviceId: service1.id,
      userId: user.id,
      role: 'Louange',
      status: 'CONFIRMED'
    }
  })

  await prisma.serviceAssignment.upsert({
    where: { 
      serviceId_userId: {
        serviceId: service2.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      serviceId: service2.id,
      userId: user.id,
      role: 'Son',
      status: 'PENDING'
    }
  })

  // Create availability
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.availability.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today
      }
    },
    update: {},
    create: {
      userId: user.id,
      date: today,
      status: 'AVAILABLE'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@church.com / admin123')
  console.log('👤 User: user@church.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
