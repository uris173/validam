const Food = require('../models/food')
const Cart = require('../models/cart')

const category_food = async (req, res) => {
  const category_id = req.params.id
  let page = req.query.page || 0
  const per_page = 2
  page = page * per_page

  let product = await Food.find({category: category_id, status: true})
  .sort({_id: -1})
  .limit(per_page)
  .skip(page)
  .lean()
  res.status(200).json({product, page})
}

const add_to_cart = async (req, res) => {
  let {_id, to_cart, count} = req.body

  const have_cart = await Cart.findOne({user: _id})
  if (have_cart) {
    let find_cart_product = have_cart.products.find(({product}) => product.toString() === to_cart)
    if (find_cart_product) {
      count += find_cart_product.count
      await Cart.findOneAndUpdate(
        {_id: have_cart._id, 'products.product': to_cart},
        {$set: {'products.$.count': count}}
      )
      res.status(201).json(count)
    } else {
      have_cart.products.push({product: to_cart, count})
      await have_cart.save()
      res.status(201).json(count)
    }
  } else {
    const cart = new Cart({user: _id, products: [{product: to_cart, count}]})
    await cart.save()
    res.status(201).json(count)
  }
}



module.exports = {
  category_food,
  add_to_cart
}