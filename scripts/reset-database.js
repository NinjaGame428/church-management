const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🧹 Starting complete database reset...');
    
    // Delete service assignments first (they reference roles)
    const assignmentsResult = await prisma.serviceAssignment.deleteMany({});
    console.log(`✅ Deleted ${assignmentsResult.count} service assignments`);

    // Delete service roles
    const rolesResult = await prisma.serviceRole.deleteMany({});
    console.log(`✅ Deleted ${rolesResult.count} service roles`);

    // Delete services
    const servicesResult = await prisma.service.deleteMany({});
    console.log(`✅ Deleted ${servicesResult.count} services`);

    // Delete notifications
    const notificationsResult = await prisma.notification.deleteMany({});
    console.log(`✅ Deleted ${notificationsResult.count} notifications`);

    // Keep users and church data intact
    console.log('📊 Database reset completed!');
    console.log('✅ Users and church data preserved');
    console.log('✅ All demo service data removed');
    
  } catch (error) {
    console.error('❌ Error during database reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
