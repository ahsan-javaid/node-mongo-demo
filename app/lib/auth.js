const promise = require('bluebird');
const jwtVerify = promise.promisify(require('jsonwebtoken').verify);
const db = global.db;

module.exports =  function() {
  return async (req, res, next) => {
    console.log('api token', global.kraken.get('app:jwtSecret'))

    if (!req.headers.authorization) {
      return res.status(401).send({status: "error", message: "authorization header missing"}).end();
    }
    const token = req.headers.authorization.split(' ')[1];
    console.log('tok: ', token)
    try {
      const decoded = await jwtVerify(token, global.kraken.get('app:jwtSecret'));
      if (!decoded) {
        return res.status(401).send({status: "error", message: "Invalid Token"}).end();
      }
      const user = await db[decoded.model].findById(decoded._id).lean().populate("Posts");
      if (!user) {
        return res.status(401).send({status: "error", message: "user not found"}).end();

      }
      req.user = user;
      req.user.userType = decoded.userType;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).send({status: "error", message: "Invalid Token"}).end();
    }
  }
}
