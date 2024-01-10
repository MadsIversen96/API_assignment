
const jwt = require('jsonwebtoken');


function isAuth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.jsend.fail({statusCode: 401, result:'Unauthorized: No token provided'});
  }

  console.log('Received token:', token);
  console.log('Token secret:', process.env.TOKEN_SECRET);

  jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err.message);
      console.error('Decoded:', decoded);
      return res.jsend.fail({statusCode: 401, result: 'Unauthorized: Invalid token'});
    }

    req.user = decoded;
    next();
  });
}
 
module.exports = isAuth;

