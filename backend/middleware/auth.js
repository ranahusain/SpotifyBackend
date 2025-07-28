const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("Please LogIn First");
  }

  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    console.log(decode);
    req.user = decode; //storing in req so where is neeeded in next() route it can be used
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Invalid Token");
  }
};

module.exports = auth;
