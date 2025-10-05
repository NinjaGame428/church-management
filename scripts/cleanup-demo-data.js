const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDemoData() {
  try {
    console.log('🧹 Starting cleanup of demo data...');
    
    // Delete in the correct order to respect foreign key constraints
    
    // 1. Delete service assignments first
    const assignmentsResult = await prisma.serviceAssignment.deleteMany({});
    console.log(`✅ Deleted ${assignmentsResult.count} service assignments`);

    // 2. Delete swap requests
    const swapRequestsResult = await prisma.swapRequest.deleteMany({});
    console.log(`✅ Deleted ${swapRequestsResult.count} swap requests`);

    // 3. Delete notifications
    const notificationsResult = await prisma.notification.deleteMany({});
    console.log(`✅ Deleted ${notificationsResult.count} notifications`);

    // 4. Delete services
    const servicesResult = await prisma.service.deleteMany({});
    console.log(`✅ Deleted ${servicesResult.count} services`);

    // 5. Delete service roles
    const rolesResult = await prisma.serviceRole.deleteMany({});
    console.log(`✅ Deleted ${rolesResult.count} service roles`);

    console.log('🎉 Demo data cleanup completed successfully!');
    console.log('✅ All service-related data removed');
    console.log('✅ Users and church data preserved');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDemoData();
