import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type TJwtPayload = JwtPayload & {
  userId: string;
  email: string;
};
type TJwtData = {
  secret: string;
  expiresIn: string;
};
export const generateAccessToken = async (
  payload: TJwtPayload,
  data: TJwtData,
) => {
  return jwt.sign(payload, data.secret, {
    expiresIn: data.expiresIn as SignOptions["expiresIn"],
  });
};
