const Bot_Type = require('../../models/bot.type')
const Users = require('../../models/users')
const url = 'https://foodapi.of-astora.uz'
const batch_size = 10
let offset = 0
let is_sending = false

const all_types = async (req, res) => {
  const bot_type = await Bot_Type.find()
  res.status(200).json(bot_type)
}

const create_bot_type = async (req, res) => {
  const new_type = new Bot_Type(req.body)
  await new_type.save()
  res.status(201).json(new_type)
}

const change_type_status = async (req, res) => {
  await Bot_Type.updateMany({status: false})
  await Bot_Type.findByIdAndUpdate(req.params.id, {status: true})
  const bot_type = await Bot_Type.find()
  res.status(200).json(bot_type)
}

const delete_bot_type = async (req, res) => {
  await Bot_Type.findByIdAndDelete(req.params.id)
  res.status(200).json('Bot type deleted!')
}


module.exports = {
  all_types,
  create_bot_type,
  change_type_status,
  delete_bot_type,
}