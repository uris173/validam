const Admin = require('../models/admins')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const admin = async(req, res) =>{
  const chek = await Admin.findOne({username: 'admin'})
  if(chek) {
    res.status(200).json({message: 'Error, such admin already exists!'})
  } else {
    const hashPass = await bcrypt.hash('p@$$w0rd', 7)
    const admin = new Admin({name: 'Admin', login: 'admin', password: hashPass, role: 'admin'})
    await admin.save()
    res.status(201).json({message: 'Admin created'})
  }
}

const login = async (req, res) => {
  const {login, password} = req.body
  let admin = await Admin.findOne({login})
  if(!admin) {
    return res.json({message: 'Админ не найден!'})
  }

  const is_valid_pass = bcrypt.compareSync(password, admin.password)
  if(!is_valid_pass) {
    return res.json({message: 'Неверный пароль!'})
  }

  const token = jwt.sign({
    id: admin.id,
    role: admin.role,
    login: admin.login,
  }, process.env.KEY, {expiresIn: '30d'})

  return res.status(200).json({
    token,
    user: {
      id: admin.id,
      login: admin.login,
      name: admin.name,
      who: admin.role,
    }
  })
}

const login_verification = async (req, res) => {
  let {login} = req.body
  await Admin.findOne({login}).then(data => {
    if (!data) return res.status(200).json({message: 'none'})
    res.status(200).json(data)
  })
}

const check_admin = async (req, res) => {
  const admin = await Admin.findById(req.admin.id)
  if (!admin){
    return res.json({message: "Admin is not found!"})
  }
  res.status(200).json(admin)
}



module.exports = {
  admin,
  login,
  login_verification,
  check_admin
}