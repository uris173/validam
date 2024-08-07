const Order = require('../models/order')
const User = require('../models/users')
const {bot} = require('../bot/bot')


const all_orders = async (req, res) => {
  const per_page = 20
  let next = req.query.next || 1
  next = (next - 1) * per_page

  const status = req.query.status || null
  const order_num = req.query.order_num || null
  let fill = {}
  fill = status ? {...fill, status} : fill
  fill = order_num ? {...fill, order_num} : fill

  const count = await Order.find({...fill}).count()
  let orders = await Order.find({...fill})
  .populate([{path: 'products.product'}, {path: 'user'}])
  .limit(per_page)
  .skip(next)
  .sort({_id: -1})
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

const send_message = async (req, res) => {
  const {_id, text} = req.body
  const user = await User.findById(_id)
  bot.sendMessage(user.userId, text)
  .then(() => res.status(200).json({message: 'Сообщение отправлено!'}))
  .catch(error => {
    if (error.response && error.response.statusCode === 403) {
      res.status(200).json({message: 'Сообщение не отправлено. Пользователь заблокировал бота.'})
    } else {
      res.status(200).json({message: 'Ошибка при отправке сообщения.'})
    }
  })
}

const edit_order = async (req, res) => {
  await Order.findByIdAndUpdate(req.body._id, {...req.body})
  let order = await Order.findById(req.body._id)
  .populate([{path: 'products.product'}, {path: 'user'}])
  .lean()

  order.total_count = 0
  order.total_price = 0
  order.products = order.products.map(val => {
    val.total = val.count * val.product.price
    order.total_count += val.count
    order.total_price += val.total
    return val
  })

  if (order.status !== 0) {
    let status = order.status
    let text_ru = status === 1 ? 'Ваш заказ принят и в обработке!' : status === 2 ? 'Ваш заказ готов! Вы можете забрать свой заказ!' : status === 3 ? 'Заказ успешно передан вам!' : 'Заказ отказан!'
    let text_uz = status === 1 ? 'Sizning buyurtmangiz qabul qilindi va tayorlash jarayonida!' : status === 2 ? 'Sizning buyurtmangiz tayyor! Buyurtmangizni olib kitishingiz mumkin!' : status === 3 ? 'Buyurtma muvoffaqiyatli topshirildi!' : 'Buyurtma rad etildi!'
    let text = order.user.language === 'ru' ? text_ru : text_uz
    bot.sendMessage(order.user.userId, text)
    .then(() => res.status(201).json(order))
    .catch(error => {
      if (error.response && error.response.statusCode === 403) {
        res.status(200).json({message: 'Сообщение не отправлено. Пользователь заблокировал бота.'})
      } else {
        res.status(200).json({message: 'Ошибка при отправке сообщения.'})
      }
    })
  }
}

const delete_order = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.status(200).json({message:'Удалено!'})
}


module.exports = {
  all_orders,
  get_order,
  send_message,
  edit_order,
  delete_order
}