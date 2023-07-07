const Category = require('../models/category')


const all_category = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  let fill = {}
  const title = req.query.title || null
  fill = title ? {...fill, title: {$regex: new RegExp(title), $options: 'i'}} : fill

  let category = await Category.find(fill)
  .sort({_id: -1})
  .limit(per_page)
  .skip(next)
  const count = await Category.find().count()

  res.status(200).json({category, count})
}

const create_category = async (req, res) => {
  const {title, title_uz, slug, status} = req.body

  const find_category = await Category.findOne({slug})
  if (find_category) return res.status(200).json({message: `Категория с таким уникальным названием "${slug}" уже есть`})

  const category = new Category({title, title_uz, slug, status})
  await category.save()
  res.status(201).json(category)
}

const get_category = async (req, res) => {
  const category = await Category.findById(req.params.id)
  res.status(200).json(category)
}

const edit_category = async (req, res) => {
  const {_id, title, title_uz, slug, status} = req.body

  const find_category = await Category.findOne({slug, _id: {$ne: _id}})
  if (find_category) return res.status(200).json({message: `Категория с таким уникальным названием "${slug}" уже есть`})

  await Category.findByIdAndUpdate(_id, {title, title_uz, slug, status})
  const category = await Category.findById(_id)
  res.status(201).json(category)
}

const change_status = async (req, res) => {
  const {id, status} = req.params
  await Category.findByIdAndUpdate(id, {status})
  const category = await Category.findById(id)
  res.status(200).json(category)
}

const delete_category = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.status(200).json({message: 'Категория удалена.'})
}


module.exports = {
  all_category,
  create_category,
  get_category,
  edit_category,
  change_status,
  delete_category
}