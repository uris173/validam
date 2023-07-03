const Bot_Type = require('../../models/bot.type')

const all_types = async (req, res) => {
  await Bot_Type.find().then(data => res.status(200).json(data))
}

const create_bot_type = async (req, res) => {
  const new_type = new Bot_Type(req.body)
  await new_type.save()
  res.status(201).json(new_type)
}

const change_type_status = async (req, res) => {
  await Bot_Type.updateMany({status: false})
  await Bot_Type.findByIdAndUpdate(req.params.id, {status: true})
  await Bot_Type.find().then(data => res.status(201).json(data))
}


module.exports = {
  all_types,
  create_bot_type,
  change_type_status
}