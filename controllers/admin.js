const Admin = require('../models/admins')
const bcrypt = require('bcrypt')

const all_admins = async (req, res) => {
  let count = await Admin.find().count()
  let admins = await Admin.find().sort({_id: -1}).lean()
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
  admin.role = admin.role === 'worker' ? 'Работник' : 'Администратор'
  res.status(201).json(admin)
}

const get_admin = async (req, res) => {
  const admin = await Admin.findById(req.params.id)
  res.status(200).json(admin)
}

const edit_admin = async (req, res) => {
  const {_id, name, login, role, password} = req.body
  const have_admin = await Admin.findOne({login, _id: {$ne: _id}})
  if (have_admin)
    return res.status(200).json({message: `Админ с таким логином "${login}" уже есть!`})
  
  const find_admin = await Admin.findById(_id)
  let hash_pass = password !== '' ? await bcrypt.hash(password, 7) : find_admin.password

  await Admin.findByIdAndUpdate(_id, {name, login, role, password: hash_pass || find_admin.password})
  const admin = await Admin.findById(_id)
  res.status(201).json(admin)
}

const delete_admin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id)
  res.status(200).json({message: 'Удалено!'})
}



module.exports = {
  all_admins,
  create_admin,
  get_admin,
  edit_admin,
  delete_admin
}