const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupRoles() {
  try {
    console.log('🧹 Starting cleanup of demo service roles...');
    
    // First, let's see what roles exist
    const existingRoles = await prisma.serviceRole.findMany();
    console.log(`📊 Found ${existingRoles.length} existing roles:`);
    existingRoles.forEach(role => {
      console.log(`  - ${role.name} (${role.isActive ? 'Active' : 'Inactive'})`);
    });

    // Delete all service roles
    const deleteResult = await prisma.serviceRole.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} service roles`);

    // Verify deletion
    const remainingRoles = await prisma.serviceRole.findMany();
    console.log(`📊 Remaining roles: ${remainingRoles.length}`);

    console.log('🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupRoles();
