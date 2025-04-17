import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../connection";

const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  userName: string
) => {
  const sql = `
    INSERT INTO users (
      created_at,
      first_name,
      last_name,
      email,
      password,
      update_at,
      user_name,
      gravatar
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, gravatar;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);
  const gravatarHash = crypto.createHash("sha256").update(email).digest("hex");
  const now = new Date();

  const { id, gravatar } = await db.one(sql, [
    now,             // created_at
    firstName,
    lastName,
    email,
    hashedPassword,
    now,             // update_at
    userName,
    gravatarHash     // gravatar
  ]);

  return { id, email, userName, gravatar };
};

const login = async (userName: string, password: string) => {
  const sql = "SELECT * FROM users WHERE user_name = $1";

  const user = await db.one(sql, [userName]);

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid credentials, try again.");
  }

  return {
    id: user.id,
    userName: user.user_name,
    email: user.email,
    gravatar: user.gravatar,
  };
};

export default { register, login };
