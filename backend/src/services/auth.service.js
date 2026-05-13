const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async ({ name, email, password }) => {
  if (!email || !EMAIL_VALIDATION_REGEX.test(email)) {
    throw new BadRequestError("Invalid Email format!");
  }

  const existing = await User.findOne({ email });
  if (existing) throw new BadRequestError("Email already registered!");

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.PASSWORD_HASH_SALT) || 12,
  );
  const user = await User.create({ name, email, password: hashedPassword });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new UnauthorizedError();

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new UnauthorizedError();

  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.JWT_EXPIRED_TIME) || 900 },
  );

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = { register, login };
