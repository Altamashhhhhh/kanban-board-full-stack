const jwt = require("jsonwebtoken");
const blockModel = require("../models/block.model");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const block = await blockModel.findOne({ token });
    if (block) {
      return res
        .status(401)
        .json({ message: "Token is blackListed, you have to login again " });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      console.log(decoded);
      req.user = decoded;
      console.log("USER ID : ", decoded.id);
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while verifying token" });
  }
};

module.exports = auth;
