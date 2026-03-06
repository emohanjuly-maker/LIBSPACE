import jwt from "jsonwebtoken";
import BlackList from "../models/blackListerToken.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check if header exists
    if (!authHeader) {
      return res.status(401).send({ msg: "No token provided" });
    }

    const token = authHeader?.split(" ")[1];

if (!token) {
  return res.status(401).send({ msg: "Token missing" });
}

    let findBlock = await BlackList.findOne({ token: token });

    if (findBlock) {
      return res.status(200).send({ msg: "You are already logout" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ msg: "You're not authenticated person", Error: err.message });
      }

      console.log(decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).send({ msg: "Token verification failed", error });
  }
};