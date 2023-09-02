const Food = require('../models/food')
const fs = require('fs')
const { remove_prop } = require('../helpers/helper')

const all_foods = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  let fill = {}
  const title = req.query.title || null
  const title_uz = req.query.title_uz || null
  const category = req.query.category?.toString() || null
  fill = title ? {...fill, title: {$regex: new RegExp(title), $options: 'i'}} : fill
  fill = title_uz ? {...fill, title: {$regex: new RegExp(title_uz), $options: 'i'}} : fill
  fill = category ? {...fill, category} : fill

  let foods = await Food.find({...fill})
  .populate('category')
  .sort({_id: -1})
  .limit(per_page)
  .skip(next)
  const count = await Food.find({...fill}).count()

  res.status(200).json({foods, count})
}

const create_category = async (req, res) => {
  const {title, title_uz, category, weight_type, weight, price, image, description, description_uz, status} = req.body

  // const find_food = await Food.findOne({$or: [{title}, {title_uz}]})
  // if (find_food) return res.status(200).json({message: 'Еда с заданными значениями в названиях уже существует.'})

  const new_food = new Food({title, title_uz, category, weight_type, weight, price, image, description, description_uz, status})
  await new_food.save()

  const food = await Food.findById(new_food._id)
  .populate({path: 'category', select: 'title'})
  res.status(201).json(food)
}

const get_food = async (req, res) => {
  const food = await Food.findById(req.params.id)
  res.status(200).json(food)
}

const change_food_status = async (req, res) => {
  await Food.findByIdAndUpdate(req.params.id, {status: req.params.status})
  const food = await Food.findById(req.params.id)
  .populate({path: 'category', select: 'title'})
  res.status(200).json(food)
}

const edit_food = async (req, res) => {
  let {_id, title, title_uz, category, weight_type, weight, price, image, description, description_uz, status} = req.body

  // const find_food = await Food.findOne({$or: [{title}, {title_uz}], _id: {$ne: _id}})
  // if (find_food) return res.status(200).json({message: 'Еда с заданными значениями в названиях уже существует.'})

  image = remove_prop(image, 'status')
  await Food.findByIdAndUpdate(_id, {title, title_uz, category, weight_type, weight, price, image, description, description_uz, status})
  const food = await Food.findById(_id)
  .populate({path: 'category', select: 'title'})
  res.status(201).json(food)
}

const delete_food = async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id)
  if (fs.existsSync(food.image[0].url)) {
    fs.unlinkSync(food.image[0].url)
  }
  res.status(200).json({message: 'Удалено.'})
}


module.exports = {
  all_foods,
  create_category,
  get_food,
  change_food_status,
  edit_food,
  delete_food
}