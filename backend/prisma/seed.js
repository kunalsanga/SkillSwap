/* eslint-disable */
require('dotenv').config();
const prisma = require('../src/config/db');

// A standard bcrypt hash of "password123"
const PASSWORD_HASH = '$2a$12$R9h/lIPzMRgGMs1y3KN.DOZ.n.5K2.T7c5zJUX3b4jM6fG4a0/r2.';

async function main() {
  console.log('Clearing database...');
  await prisma.rating.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.banHistory.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding skills...');
  const react = await prisma.skill.create({ data: { name: 'React' } });
  const photoshop = await prisma.skill.create({ data: { name: 'Photoshop' } });
  const excel = await prisma.skill.create({ data: { name: 'Excel' } });
  const nodejs = await prisma.skill.create({ data: { name: 'Node.js' } });
  const figma = await prisma.skill.create({ data: { name: 'Figma' } });
  const python = await prisma.skill.create({ data: { name: 'Python' } });
  const docker = await prisma.skill.create({ data: { name: 'Docker' } });

  console.log('Seeding users...');
  
  // Admin User
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'System Office',
      availability: '24/7',
      isPublic: true,
      role: 'ADMIN',
    },
  });

  // User 1: Alice (Offers React & Node.js, Wants Photoshop)
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'Bhubaneswar',
      availability: 'Weekends',
      isPublic: true,
      role: 'USER',
      skills: {
        create: [
          { skillId: react.id, type: 'OFFERED' },
          { skillId: nodejs.id, type: 'OFFERED' },
          { skillId: photoshop.id, type: 'WANTED' },
        ],
      },
    },
  });

  // User 2: Bob (Offers Photoshop, Wants React)
  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'Bhubaneswar',
      availability: 'Weekdays',
      isPublic: true,
      role: 'USER',
      skills: {
        create: [
          { skillId: photoshop.id, type: 'OFFERED' },
          { skillId: react.id, type: 'WANTED' },
        ],
      },
    },
  });

  // User 3: Charlie (Offers Excel, Wants Figma)
  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'Mumbai',
      availability: 'Weekends',
      isPublic: true,
      role: 'USER',
      skills: {
        create: [
          { skillId: excel.id, type: 'OFFERED' },
          { skillId: figma.id, type: 'WANTED' },
        ],
      },
    },
  });

  // User 4: David (Banned)
  const david = await prisma.user.create({
    data: {
      name: 'David',
      email: 'david@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'Delhi',
      availability: 'Weekends',
      isPublic: true,
      isBanned: true,
      role: 'USER',
      skills: {
        create: [
          { skillId: python.id, type: 'OFFERED' },
          { skillId: docker.id, type: 'WANTED' },
        ],
      },
      banHistory: {
        create: {
          reason: 'Violated platform policy',
        },
      },
    },
  });

  // User 5: Eve (Private Profile)
  const eve = await prisma.user.create({
    data: {
      name: 'Eve',
      email: 'eve@skillswap.com',
      passwordHash: PASSWORD_HASH,
      location: 'Bangalore',
      availability: 'Weekdays',
      isPublic: false,
      role: 'USER',
      skills: {
        create: [
          { skillId: docker.id, type: 'OFFERED' },
          { skillId: python.id, type: 'WANTED' },
        ],
      },
    },
  });

  console.log('Seeding swap requests...');
  
  // Swap 1: Alice -> Bob (Completed)
  const swapCompleted = await prisma.swapRequest.create({
    data: {
      senderId: alice.id,
      receiverId: bob.id,
      offeredSkillId: react.id,
      wantedSkillId: photoshop.id,
      status: 'COMPLETED',
      message: 'Hey Bob, would love to swap React for Photoshop!',
    },
  });

  // Swap 2: Bob -> Alice (Accepted)
  const swapAccepted = await prisma.swapRequest.create({
    data: {
      senderId: bob.id,
      receiverId: alice.id,
      offeredSkillId: photoshop.id,
      wantedSkillId: react.id,
      status: 'ACCEPTED',
      message: 'Let us do another swap Alice!',
    },
  });

  // Swap 3: Charlie -> Bob (Pending)
  const swapPending = await prisma.swapRequest.create({
    data: {
      senderId: charlie.id,
      receiverId: bob.id,
      offeredSkillId: excel.id,
      wantedSkillId: photoshop.id,
      status: 'PENDING',
      message: 'Need help with Photoshop, can teach you Excel!',
    },
  });

  console.log('Seeding ratings...');
  await prisma.rating.create({
    data: {
      swapRequestId: swapCompleted.id,
      giverId: alice.id,
      receiverId: bob.id,
      rating: 5,
      feedback: 'Great session, Bob is a master of Photoshop!',
    },
  });

  console.log('Seeding announcements...');
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Skill Swap!',
      message: 'Start swapping skills with other developers and designers globally.',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
