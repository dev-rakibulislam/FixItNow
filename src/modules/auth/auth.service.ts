import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { UserRegisterPayload, userRegisterSchema } from "./auth.validator";
import config from "../../config";
import AppError from "../../errors/AppError";
import { generateAccessToken } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserInDb = async (payload: UserRegisterPayload) => {
  const { firstName, lastName, email, password } = payload;

  console.log("access_secret:", config.jwt_access_secret);
  console.log("access_secret type:", typeof config.jwt_access_secret);

  console.log("access_expires_in:", config.jwt_access_expires_in);
  console.log("access_expires_in type:", typeof config.jwt_access_expires_in);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
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
    },
    omit: { password: true },
  });
  const JwtPayload = {
    userId: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
  };
  const accessToken = await generateAccessToken(JwtPayload, {
    secret: config.jwt_access_secret,

    expiresIn: config.jwt_access_expires_in,
  });
  const refreshToken = await generateAccessToken(JwtPayload, {
    secret: config.jwt_refresh_secret,
    expiresIn: config.jwt_refresh_expires_in,
  });
  return {
    result,
    accessToken,
    refreshToken
  };

  // return transactionResult;
};
// const signInUserFromDb=async(req:Request, res:Response)=>{}

export const authService = {
  registerUserInDb,
  // signInUserFromDb
};
