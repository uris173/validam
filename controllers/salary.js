const Salary = require('../models/salary')

const all_salaries = async (req, res) => {
  const year = parseInt(req.query.year) || null
  const month = parseInt(req.query.month) || null
  const user = req.query.user || null

  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  let fill = user !== null ? {user} : {}

  let salary = await Salary.find(fill)
  .populate('user')
  .sort({_id: -1})
  .limit(per_page)
  .skip(next)
  let count = await Salary.find(fill).count()

  res.status(200).json({salary, count})
}

const create_salary = async (req, res) => {
  const new_salary = new Salary({...req.body})
  await new_salary.save()
  const salary = await Salary.findById(new_salary._id)
  .populate('user')
  res.status(201).json(salary)
}

const get_salary = async (req, res) => {
  const salary = await Salary.findById(req.params.id)
  res.status(200).json(salary)
}

const edit_salary = async (req, res) => {
  let salary = await Salary.findByIdAndUpdate(req.body._id, {...req.body}, {new: true})
  .populate('user')
  res.status(201).json(salary)
}

const delete_salary = async (req, res) => {
  await Salary.findByIdAndDelete(req.params.id)
  res.status(200).json({message: 'Удалено.'})
}


module.exports = {
  all_salaries,
  create_salary,
  get_salary,
  edit_salary,
  delete_salary
}