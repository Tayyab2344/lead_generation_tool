const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Create Roles
  const roles = [
    { name: 'Administrator', description: 'Full system access, configuration, and security control.' },
    { name: 'Manager', description: 'Team, lead, campaign management, and analytics access.' },
    { name: 'Sales Representative', description: 'Lead generation, campaign handling, and profile access.' },
    { name: 'Analyst', description: 'Analytics dashboards, reporting, and read-only leads access.' }
  ];

  console.log('Seeding Roles...');
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

  // 2. Create Default Admin User
  const adminEmail = 'admin@leadpulse.com';
  const adminPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  console.log('Seeding Default Administrator...');
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
      status: 'VERIFIED',
      roleId: roleDbMap['Administrator']
    },
    create: {
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

  console.log(`- Default Administrator synced: ${adminEmail}`);

  // 3. Create Settings for Admin User if not exists
  const existingSettings = await prisma.settings.findUnique({
    where: { userId: adminUser.id }
  });

  if (!existingSettings) {
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
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
