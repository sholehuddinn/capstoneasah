import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", 
  });
};
