const Order = require('../models/order')
const Products = require('../models/food')
const Categoty = require('../models/category')
const User = require('../models/users')
const Reviews = require('../models/review')

const datas_count = async (req, res) => {
  const order = await Order.find().count()
  const product = await Products.find().count()
  const category = await Categoty.find().count()
  const user = await User.find().count()
  const reviews = await Reviews.find().count()
  res.status(200).json({order, product, category, user, reviews})
}

const doughnut_statistic = async (req, res) => {
  let not_viewed = await Order.find({status: 0}).populate({
    path: 'products.product',
    select: 'price'
  })
  let not_viewed_price = 0
  not_viewed.forEach(val => {
    val.products.forEach(el => {
      not_viewed_price += el.count * el.product.price
    })
  })

  let pending = await Order.find({status: 1}).populate({
    path: 'products.product',
    select: 'price'
  })
  let pending_price = 0
  pending.forEach(val => {
    val.products.forEach(el => {
      pending_price += el.count * el.product.price
    })
  })

  let ready = await Order.find({status: 2}).populate({
    path: 'products.product',
    select: 'price'
  })
  let ready_price = 0
  ready.forEach(val => {
    val.products.forEach(el => {
      ready_price += el.count * el.product.price
    })
  })

  let taken_away = await Order.find({status: 3}).populate({
    path: 'products.product',
    select: 'price'
  })
  let taken_price = 0
  taken_away.forEach(val => {
    val.products.forEach(el => {
      taken_price += el.count * el.product.price
    })
  })

  let denied = await Order.find({status: 4}).populate({
    path: 'products.product',
    select: 'price'
  })
  let denied_price = 0
  denied.forEach(val => {
    val.products.forEach(el => {
      denied_price += el.count * el.product.price
    })
  })

  let titles = ['Не просмотренные', 'В обработке', 'Готовые', 'Забрали', 'Отказанные']
  let price = {
    titles,
    prices: [not_viewed_price, pending_price, ready_price, taken_price, denied_price]
  }
  let count = {
    titles,
    counts: [not_viewed.length,  pending.length, ready.length, taken_away.length, denied.length]
  }

  res.status(200).json({
    price, count
    // not_viewed: {price: not_viewed_price, count: not_viewed.length},
    // pending: {price: pending_price, count: pending.length},
    // ready: {price: ready_price, count: ready.length},
    // taken_away: {price: taken_price, count: taken_away.length},
    // denied: {price: denied_price, count: denied.length}
  })
}

const popular_products = async (req, res) => {
  // let data = []
  let datas = await Order.aggregate([
    {
      $unwind: "$products"
    },
    {
      $group: {
        _id: "$products.product",
        total_orders: { $sum: "$products.count" }
      }
    },
    {
      $sort: { total_orders: -1 }
    }
  ])
  .limit(5)

  let titles = []
  let counts = []
  datas = await Promise.all(datas.map(async data => {
    data.product = await Products.findById(data._id, 'title')
    titles.push(data.product.title)
    counts.push(data.total_orders)
    return data
  }))
  res.status(200).json({titles, counts})
}

const month_statistic = async (req, res) => {
  const date = new Date();
  const currentYear = parseInt(req.query.year) || date.getFullYear()
  const currentMonth = parseInt(req.query.month) || date.getMonth()
  // console.log(currentYear, currentMonth);
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

  let orders = await Order.find()
  .populate({path: 'products.product', select: 'price'})
  .lean()
  let order_by_day = {};

  orders.forEach(order => {
    let orderDate = new Date(order.date)
    if (order.date.getFullYear() === currentYear && order.date.getMonth() === currentMonth) {
      let day = orderDate.getDate()
      if (!order_by_day[day]) {
        order_by_day[day] = 0
      }
      order_by_day[day] ++
    }
  })

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  let order_by_day_arr = [];
  for (let i = 1; i<= daysInCurrentMonth; i ++) {
    order_by_day_arr.push(order_by_day[i] || 0)
  }

  let total_month_price = 0
  orders.forEach(order => {
    if (order.date.getFullYear() === currentYear && order.date.getMonth() === currentMonth) {
      order.products.forEach(val => total_month_price += val.count * val.product.price)
    }
  })

  res.status(200).json({order_by_day_arr, total_month_price, currentMonth})
}

const year_statistic = async (req, res) => {
  const date = new Date()
  const current_year = parseInt(req.query.year) || date.getFullYear()

  let orders = await Order.find()
  .populate({path: 'products.product', select: 'price'})
  .lean()

  let total_year_price = 0
  let orderByMonth = {}
  let order_by_month_arr = []

  orders.forEach(order => {
    if (order.date.getFullYear() === current_year) {
      let orderDate = new Date(order.date)
      let month = orderDate.getMonth() + 1
      if (!orderByMonth[month]) {
        orderByMonth[month] = 0
      }
      orderByMonth[month] ++
      order.products.forEach(val => total_year_price += val.count * val.product.price)
    }
  })
  for (let i = 1; i<= 12; i ++) {
    order_by_month_arr.push(orderByMonth[i] || 0)
  }

  res.status(200).json({total_year_price, order_by_month_arr, current_year})
}


module.exports = {
  datas_count,
  doughnut_statistic,
  popular_products,
  month_statistic,
  year_statistic
}