const Users = require('../models/users')

const all_users = async (req, res) => {
  const count = await Users.find().count()
  const users = await Users.find().sort({_id: -1})
  res.status(200).json({users, count})
}


module.exports = {
  all_users
}