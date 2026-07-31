import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserLoginPayload, UserRegisterPayload } from "./auth.validator";
import config from "../../config";
import AppError from "../../errors/AppError";
import { generateToken } from "../../utils/jwt";
import { existingUser } from "../../utils/checkUser";

const registerUserInDb = async (payload: UserRegisterPayload) => {
  const { firstName, lastName, role, email, password } = payload;

  const existingUserRecord = await existingUser(email);

  if (existingUserRecord) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    },
    omit: { password: true },
  });

  const JwtPayload = {
    userId: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
  };

  const accessToken = await generateToken(JwtPayload, {
    secret: config.jwt_access_secret,
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshToken = await generateToken(JwtPayload, {
    secret: config.jwt_refresh_secret,
    expiresIn: config.jwt_refresh_expires_in,
  });

  return {
    result,
    accessToken,
    refreshToken,
  };
};

const loginUserFromDb = async (payload: UserLoginPayload) => {
  const { email, password } = payload;

  const userRecord = await existingUser(email);

  if (!userRecord) {
    throw new AppError(404, "User not found");
  }

  const { password: passwordDB, ...existingUserRecord } = userRecord;

  const isPasswordMatch = await bcrypt.compare(password, passwordDB);

  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid credentials");
  }

  const JwtPayload = {
    userId: existingUserRecord.id,
    email: existingUserRecord.email,
    role: existingUserRecord.role,
    status: existingUserRecord.status,
  };

  const accessToken = await generateToken(JwtPayload, {
    secret: config.jwt_access_secret,
    expiresIn: config.jwt_access_expires_in,
  });

  const refreshToken = await generateToken(JwtPayload, {
    secret: config.jwt_refresh_secret,
    expiresIn: config.jwt_refresh_expires_in,
  });

  return {
    result: existingUserRecord,
    accessToken,
    refreshToken,
  };
};

const getMeFromDb = async (userId: string) => {

  const userRecord = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      technicianProfile: true,
    },
    omit: { password: true },
  });
  return userRecord;
};

export const authService = {
  registerUserInDb,
  loginUserFromDb,
  getMeFromDb,
};
