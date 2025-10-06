import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';

export interface ServiceReminder {
  serviceId: string;
  userId: string;
  serviceTitle: string;
  date: string;
  time: string;
  location: string;
  role: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
}

// Send reminders for services happening tomorrow
export async function sendServiceReminders(): Promise<void> {
  try {
    console.log('🔔 Starting service reminder process...');
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    
    // Find all services happening tomorrow
    const services = await prisma.service.findMany({
      where: {
        date: tomorrowDateString,
        status: 'PUBLISHED'
      },
      include: {
        assignments: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log(`📅 Found ${services.length} services for tomorrow`);

    // Send reminders for each service
    for (const service of services) {
      for (const assignment of service.assignments) {
        try {
          await emailService.sendServiceReminderEmail(
            {
              id: assignment.user.id,
              firstName: assignment.user.firstName,
              lastName: assignment.user.lastName,
              email: assignment.user.email
            },
            {
              id: service.id,
              title: service.title,
              description: service.description,
              date: service.date,
              time: service.time,
              location: service.location,
              status: service.status
            },
            assignment.role
          );
          
          console.log(`✅ Reminder sent to ${assignment.user.email} for service "${service.title}"`);
        } catch (error) {
          console.error(`❌ Failed to send reminder to ${assignment.user.email}:`, error);
        }
      }
    }

    console.log('🎉 Service reminder process completed');
  } catch (error) {
    console.error('❌ Service reminder process failed:', error);
  }
}

// Send reminders for services happening in 3 days (weekly planning)
export async function sendWeeklyServiceReminders(): Promise<void> {
  try {
    console.log('📅 Starting weekly service reminder process...');
    
    // Get date 3 days from now
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysDateString = threeDaysFromNow.toISOString().split('T')[0];
    
    // Find all services happening in 3 days
    const services = await prisma.service.findMany({
      where: {
        date: threeDaysDateString,
        status: 'PUBLISHED'
      },
      include: {
        assignments: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log(`📅 Found ${services.length} services for ${threeDaysDateString}`);

    // Send weekly reminders for each service
    for (const service of services) {
      for (const assignment of service.assignments) {
        try {
          await emailService.sendServiceReminderEmail(
            {
              id: assignment.user.id,
              firstName: assignment.user.firstName,
              lastName: assignment.user.lastName,
              email: assignment.user.email
            },
            {
              id: service.id,
              title: service.title,
              description: service.description,
              date: service.date,
              time: service.time,
              location: service.location,
              status: service.status
            },
            assignment.role
          );
          
          console.log(`✅ Weekly reminder sent to ${assignment.user.email} for service "${service.title}"`);
        } catch (error) {
          console.error(`❌ Failed to send weekly reminder to ${assignment.user.email}:`, error);
        }
      }
    }

    console.log('🎉 Weekly service reminder process completed');
  } catch (error) {
    console.error('❌ Weekly service reminder process failed:', error);
  }
}

// Manual reminder trigger (can be called from API)
export async function triggerServiceReminders(): Promise<{ success: boolean; message: string; remindersSent: number }> {
  try {
    let remindersSent = 0;
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    
    // Find all services happening tomorrow
    const services = await prisma.service.findMany({
      where: {
        date: tomorrowDateString,
        status: 'PUBLISHED'
      },
      include: {
        assignments: {
          where: {
            status: 'CONFIRMED'
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Send reminders for each service
    for (const service of services) {
      for (const assignment of service.assignments) {
        try {
          await emailService.sendServiceReminderEmail(
            {
              id: assignment.user.id,
              firstName: assignment.user.firstName,
              lastName: assignment.user.lastName,
              email: assignment.user.email
            },
            {
              id: service.id,
              title: service.title,
              description: service.description,
              date: service.date,
              time: service.time,
              location: service.location,
              status: service.status
            },
            assignment.role
          );
          
          remindersSent++;
        } catch (error) {
          console.error(`Failed to send reminder to ${assignment.user.email}:`, error);
        }
      }
    }

    return {
      success: true,
      message: `Reminders sent successfully`,
      remindersSent
    };
  } catch (error) {
    console.error('Failed to trigger service reminders:', error);
    return {
      success: false,
      message: 'Failed to send reminders',
      remindersSent: 0
    };
  }
}
