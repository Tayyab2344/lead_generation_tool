const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database wipe and reset...');

  // Delete transactional and related data first due to foreign key constraints
  console.log('Clearing Sessions...');
  await prisma.session.deleteMany();

  console.log('Clearing Login History...');
  await prisma.loginHistory.deleteMany();

  console.log('Clearing Notifications...');
  await prisma.notification.deleteMany();

  console.log('Clearing Settings...');
  await prisma.settings.deleteMany();

  console.log('Clearing Sent Emails...');
  await prisma.sentEmail.deleteMany();

  console.log('Clearing Verification Tokens...');
  await prisma.verificationToken.deleteMany();

  console.log('Clearing Users...');
  await prisma.user.deleteMany();

  console.log('Clearing Roles...');
  await prisma.role.deleteMany();

  console.log('Database wiped successfully!');

  // Seed default roles
  const roles = [
    { name: 'Administrator', description: 'Full system access, configuration, and security control.' },
    { name: 'Manager', description: 'Team, lead, campaign management, and analytics access.' },
    { name: 'Sales Representative', description: 'Lead generation, campaign handling, and profile access.' },
    { name: 'Analyst', description: 'Analytics dashboards, reporting, and read-only leads access.' }
  ];

  console.log('Re-seeding Roles...');
  const roleDbMap = {};
  for (const role of roles) {
    const upsertedRole = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role
    });
    roleDbMap[role.name] = upsertedRole.id;
    console.log(`- Role synced: ${role.name} (${upsertedRole.id})`);
  }

  // Seed default Admin User
  const adminEmail = 'admin@leadpulse.com';
  const adminPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('Re-seeding Default Administrator...');
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'LeadPulse',
      lastName: 'Administrator',
      email: adminEmail,
      passwordHash: hashedPassword,
      status: 'VERIFIED',
      roleId: roleDbMap['Administrator'],
      companyName: 'LeadPulse Inc.',
      phoneNumber: '+15550199'
    }
  });

  console.log(`- Default Administrator created: ${adminEmail}`);

  // Create Settings for Admin User
  await prisma.settings.create({
    data: {
      userId: adminUser.id,
      language: 'en',
      timeZone: 'EST',
      dateFormat: 'YYYY-MM-DD',
      theme: 'dark',
      emailNotifications: true,
      systemNotifications: true,
      campaignAlerts: true,
      leadAlerts: true,
      dataSharing: true,
      accountVisibility: 'public',
      communicationPreferences: 'email'
    }
  });
  console.log(`- Default settings created for Administrator`);

  console.log('Database reset process finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error resetting database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
