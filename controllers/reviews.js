const Review = require('../models/review')


const all_reviews = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  const count = await Review.find().count()
  let reviews = await Review.find()
  .populate({path: 'user'})
  .limit(per_page)
  .skip(next)
  .sort({_id: -1})
  .lean()

  res.status(200).json({count, reviews})
}

const get_review = async (req, res) => {
  let review = await Review.findById(req.params.id)
  res.status(200).json(review)
}


module.exports = {
  all_reviews,
  get_review
}