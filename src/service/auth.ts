import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repository/auth";
import { User } from "../types/user";
import CustomError from "../util/customError";
import { EMAIL_REGEX, SALT_ROUNDS } from "../util/constant";

export const register = async (
  email: string,
  password: string,
): Promise<User & { accessToken: string; refreshToken: string }> => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new CustomError("User with this email already exists", 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new CustomError("Invalid email format", 400);
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userRepository.createUser(email, hashedPassword);

  const tokenPayload = { id: user.id, email: user.email };

  const accessToken = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    tokenPayload,
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );

  return {
    ...user,
    accessToken,
    refreshToken,
  };
};

const login = async (
  email: string,
  password: string,
): Promise<User & { accessToken: string; refreshToken: string }> => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new CustomError("Invalid credential", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    throw new CustomError("Invalid credential", 401);
  }

  const tokenPayload = { id: user.id, email: user.email };

  const accessToken = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" },
  );
  const refreshToken = jwt.sign(
    tokenPayload,
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" },
  );

  delete user.password;

  return {
    ...user,
    accessToken,
    refreshToken,
  };
};

export default { register, login };
