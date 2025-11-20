import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token tidak ditemukan di header Authorization" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "Format token tidak valid. Gunakan 'Bearer <token>'" });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token.trim() === "") {
      return res.status(400).json({ error: "Token kosong, tidak dapat diverifikasi" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token telah kedaluwarsa, silakan login ulang" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token tidak valid atau rusak" });
      } else {
        return res.status(401).json({ error: "Gagal memverifikasi token" });
      }
    }

    if (!decoded.id || !decoded.username) {
      return res.status(400).json({ error: "Payload token tidak lengkap" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("[authMiddleware Error]", err);
    return res.status(500).json({ error: "Terjadi kesalahan saat memverifikasi token" });
  }
};
