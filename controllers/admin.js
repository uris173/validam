const Admin = require('../models/admins')


const all_admins = async (req, res) => {
  let count = await Admin.find().count()
  let admins = await Admin.find().lean()
  admins = admins.map(adm => {
    adm.role = adm.role === 'admin' ? 'Администратор' : 'Работник'
    return adm
  })
  res.status(200).json({admins, count})
}

const create_admin = async (req, res) => {
  const {name, login, role, password} = req.body
  const find_admin = await Admin.findOne({login})
  if (find_admin) {
    res.status(200).json({message: `Админ с таким логином "${login}" уже есть!`})
  }
  const hash_pass = await bcrypt.hash(password, 7)
  const admin = new Admin({name, login, role, password: hash_pass})
  await admin.save()
  res.status(201).json(admin)
}

const get_admin = async (req, res) => {
  const admin = await Admin.findById(req.params.id)
  res.status(200).json(admin)
}

const edit_admin = async (req, res) => {
  const {_id, name, login, role, password} = req.body
  const find_admin = await Admin.findOne({login, _id: {$ne: _id}})
  if (find_admin)
    return res.status(200).json({message: `Админ с таким логином "${login}" уже есть!`})
  
  const hash_pass = await bcrypt.hash(password, 7)
  await Admin.findByIdAndUpdate(_id, {name, login, role, password: hash_pass})
  const admin = await Admin.findById(_id)
  res.status(201).json(admin)
}

const delete_admin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id)
  res.status(200).json({message: 'Admin deleted!'})
}



module.exports = {
  all_admins,
  create_admin,
  get_admin,
  edit_admin,
  delete_admin
}