const Food = require('../models/food')

const category_food = async (req, res) => {
  const category_id = req.params.id
  let page = req.query.page || 0
  const per_page = 2
  page = page * per_page

  let food = await Food.find({category: category_id, status: true})
  .sort({_id: -1})
  .limit(per_page)
  .skip(page)
  .lean()
  res.status(200).json({food, page})
}


module.exports = {
  category_food
}