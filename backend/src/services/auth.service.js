const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { AppError } = require('../utils/appError');

const userSelect = {
  id: true,
  name: true,
  email: true,
  bio: true,
  location: true,
  profilePhoto: true,
  availability: true,
  isPublic: true,
  isBanned: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  skills: {
    select: {
      id: true,
      skillId: true,
      type: true,
      skill: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

const parseSaltRounds = () => {
  const parsed = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

  if (Number.isNaN(parsed) || parsed < 4) {
    return 12;
  }

  return parsed;
};

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT secret is not configured.', 500);
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });
};

const normalizeSkillInput = (skills) => {
  const groupedSkills = {
    OFFERED: [],
    WANTED: [],
  };

  const pushSkill = (type, rawSkill) => {
    const normalizedType = type === 'WANTED' ? 'WANTED' : 'OFFERED';

    if (typeof rawSkill === 'string') {
      const name = rawSkill.trim();
      if (name) {
        groupedSkills[normalizedType].push({ name });
      }
      return;
    }

    if (rawSkill && typeof rawSkill === 'object') {
      const name = typeof rawSkill.name === 'string' ? rawSkill.name.trim() : '';
      const skillId = rawSkill.skillId ?? rawSkill.id;
      const itemType = rawSkill.type === 'WANTED' ? 'WANTED' : normalizedType;

      if (skillId || name) {
        groupedSkills[itemType].push({
          skillId: typeof skillId === 'number' ? skillId : undefined,
          name: name || undefined,
        });
      }
    }
  };

  if (Array.isArray(skills)) {
    for (const skill of skills) {
      pushSkill(typeof skill === 'object' && skill?.type === 'WANTED' ? 'WANTED' : 'OFFERED', skill);
    }
    return groupedSkills;
  }

  if (skills && typeof skills === 'object') {
    if (Array.isArray(skills.offered)) {
      for (const skill of skills.offered) {
        pushSkill('OFFERED', skill);
      }
    }

    if (Array.isArray(skills.wanted)) {
      for (const skill of skills.wanted) {
        pushSkill('WANTED', skill);
      }
    }
  }

  return groupedSkills;
};

const syncUserSkills = async (tx, userId, skillsInput) => {
  const groupedSkills = normalizeSkillInput(skillsInput);

  for (const [type, skills] of Object.entries(groupedSkills)) {
    if (!skills.length) {
      continue;
    }

    await tx.userSkill.deleteMany({
      where: {
        userId,
        type,
      },
    });

    const seenSkills = new Set();

    for (const entry of skills) {
      const skill = entry.skillId
        ? await tx.skill.findUnique({ where: { id: entry.skillId } })
        : await tx.skill.upsert({
            where: { name: entry.name },
            update: {},
            create: { name: entry.name },
          });

      if (!skill) {
        throw new AppError('One or more skills were not found.', 404);
      }

      const dedupeKey = `${skill.id}:${type}`;
      if (seenSkills.has(dedupeKey)) {
        continue;
      }

      seenSkills.add(dedupeKey);

      await tx.userSkill.create({
        data: {
          userId,
          skillId: skill.id,
          type,
        },
      });
    }
  }
};

const register = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError('Email is already in use.', 409, [{ field: 'email', message: 'Email is already in use.' }]);
  }

  const passwordHash = await bcrypt.hash(password, parseSaltRounds());

  let createdUser;

  try {
    createdUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
      },
      select: userSelect,
    });
  } catch (error) {
    if (error?.code === 'P2002') {
      throw new AppError('Email is already in use.', 409, [{ field: 'email', message: 'Email is already in use.' }]);
    }

    throw error;
  }

  return {
    user: createdUser,
    token: signToken(createdUser),
  };
};

const login = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      ...userSelect,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.isBanned) {
    throw new AppError('Your account has been suspended.', 403);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401);
  }

  const safeUser = {
    ...user,
  };
  delete safeUser.passwordHash;

  return {
    user: safeUser,
    token: signToken(safeUser),
  };
};

const getCurrentUser = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const updateProfile = async (userId, payload) => {
  const { name, profilePhoto, bio, location, availability, visibility, skills } = payload;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const data = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (profilePhoto !== undefined) {
      data.profilePhoto = profilePhoto;
    }

    if (bio !== undefined) {
      data.bio = bio;
    }

    if (location !== undefined) {
      data.location = location;
    }

    if (availability !== undefined) {
      data.availability = availability;
    }

    if (visibility !== undefined) {
      data.isPublic = visibility;
    }

    let updated = user;

    if (Object.keys(data).length > 0) {
      updated = await tx.user.update({
        where: { id: userId },
        data,
        select: userSelect,
      });
    }

    if (skills !== undefined) {
      await syncUserSkills(tx, userId, skills);

      return tx.user.findUnique({
        where: { id: userId },
        select: userSelect,
      });
    }

    return updated;
  });

  return updatedUser;
};

const logout = async () => {
  return {
    loggedOut: true,
  };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
};