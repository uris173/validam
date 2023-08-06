const Order = require('../models/order')


const all_orders = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  const count = await Order.find().count()
  let orders = await Order.find()
  .populate([{path: 'products.product'}, {path: 'user'}])
  .limit(per_page)
  .skip(next)
  .lean()
  
  orders = orders.map(val => {
    val.total_price = 0
    val.total_count = 0
    val.products = val.products.map(el => {
      el.total = el.count * el.product.price
      val.total_count += el.count
      val.total_price += el.total
      return el
    })
    return val
  })
  
  res.status(200).json({count, orders})
}

const get_order = async (req, res) => {
  const order = await Order.findById(req.params.id)
  .populate([{path: 'products.product'}, {path: 'user'}])
  res.status(200).json(order)
}

const edit_order = async (req, res) => {
  await Order.findByIdAndUpdate(req.body._id, {...req.body})
  const order = await Order.findById(req.body._id)
  .populate([{path: 'products.product'}, {path: 'user'}])
  res.status(201).json(order)
}

const delete_order = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.status(200).json({message:'Удалено!'})
}


module.exports = {
  all_orders,
  get_order,
  edit_order,
  delete_order
}