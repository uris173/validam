const jwt = require('jsonwebtoken')


const all = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.json({message: "Auth error!"})
  }
  const decoded = jwt.verify(token, process.env.KEY)
  if (['admin', 'worker'].includes(decoded.role)) {
    req.admin = decoded
    next()
  } else {
    return res.status(401).json({message: "You don't have access"})
  }
}

const top = async(req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.json({message: "Auth error!"})
  }
  const decoded = jwt.verify(token, process.env.KEY)
  if (['admin'].includes(decoded.role)) {
    req.admin = decoded
    next()
  } else {
    return res.status(401).json({message: "You don't have access"})
  }
}

module.exports = {
  all,
  top
}