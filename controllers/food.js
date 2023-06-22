const Food = require('../models/food')

const all_foods = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  let fill = {}
  const title = req.query.title || null
  const category = req.query.category?.toString() || null
  fill = title ? {...fill, title: {$regex: new RegExp(title), $options: 'i'}} : fill
  fill = category ? {...fill, category} : fill

  let foods = await Food.find(fill)
  .populate('category')
  .sort({_id: -1})
  .limit(per_page)
  .skip(next)
  const count = await Food.find().count()

  res.status(200).json({foods, count})
}

const create_category = async (req, res) => {
  const {title, title_uz, category, weight_type, weight, price, image, description, description_uz, status} = req.body

  const find_food = await Food.findOne({$or: [{title}, {title_uz}]})
  if (find_food) return res.status(200).json({message: 'Еда с заданными значениями в названиях уже существует.'})

  const food = new Food({title, title_uz, category, weight_type, weight, price, image, description, description_uz, status})
  await food.save()

  res.status(201).json(food)
}

const get_food = async (req, res) => {
  await Food.findById(req.params.id).then(data => res.status(200).json(data))
}

const edit_food = async (req, res) => {
  const {_id, title, title_uz, category, weight_type, weight, price, image, description, description_uz, status} = req.body

  const find_food = await Food.findOne({$or: [{title}, {title_uz}], _id: {$ne: _id}})
  if (find_food) return res.status(200).json({message: 'Еда с заданными значениями в названиях уже существует.'})

  await Food.findByIdAndUpdate(_id, {title, title_uz, category, weight_type, weight, price, image, description, description_uz, status})
  await Food.findById(_id).then(data => res.status(201).json(data))
}

const delete_food = async (req, res) => {
  await Food.findByIdAndDelete(req.params.id).then(() => res.status(200).json({message: 'Удалено.'}))
}


module.exports = {
  all_foods,
  create_category,
  get_food,
  edit_food,
  delete_food
}