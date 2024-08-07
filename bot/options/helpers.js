const { menu_kb_ru, menu_kb_uz } = require('../options/keyboards')
const { ru, uz } = require('../options/transates')

const translation_assistant = (lang) => {
  const kb = lang === 'ru' ? menu_kb_ru : menu_kb_uz
  const translate = lang === 'ru' ? ru : uz
  return { kb, translate }
}

const pagination_menu = (product, language) => {
  let list = ''
  product.forEach((val, index) => {
    let title = language === 'ru' ? val.title : val.title_uz
    let weight_type = language === 'ru' ? val.weight_type : val.weight_type === 'гр.' ? 'gr.' : 'kg.'
    let weight = `${val.weight} ${weight_type}`
    let price_str = language === 'ru' ? 'сум' : 'sum'
    list += `<i>${index + 1}</i>) <b>${title}</b>. ${weight} - ${val.price.toLocaleString('fr')} ${price_str}\n`
  })
  return list
}

const card = (product, language) => {
  let img = 'https://static01.nyt.com/images/2021/02/17/dining/17tootired-grilled-cheese/17tootired-grilled-cheese-articleLarge.jpg?quality=75&auto=webp&disable=upscale' // product.image[0].url

  let title = language === 'ru' ? `<b>Название еды:</b> ${product.title}` : `<b>Taom nomi:</b> ${product.title_uz}`
  let weight_type = language === 'ru' ? product.weight_type : product.weight_type === 'гр.' ? 'gr.' : 'kg.'
  let weight = `${product.weight} ${weight_type}.`
  weight = language === 'ru' ? `<b>Вес:</b> ${weight}` : `<b>Vazn:</b> ${weight}`

  let price_str = language === 'ru' ? 'сум' : "so'm"
  let price = `<u>${product.price.toLocaleString('fr')}</u> ${price_str}`
  price = language === 'ru' ? `<b>Цена:</b> ${price}` : `<b>Narxi:</b> ${price}`
  let description = language === 'ru' ? `<b>Описание:</b>\n<i>${product.description}</i>` : `<b>Tavsif:</b>\n<i>${product.description_uz}</i>`

  let info = `${title}\n${weight}\n\n${description}\n\n${price}`

  return {img, info}
}

const cart_products = (products, language) => {
  let list = ''
  let total_price = 0
  let price_str = ''
  let total_str = language === 'ru' ? 'Итого:' : 'Jami:'
  products.forEach((element, index) => {
    let title = language === 'ru' ? element.product.title : element.product.title_uz
    let total_product_price = element.product.price * element.count
    price_str = language === 'ru' ? 'сум' : "so'm"
    let price = `${element.product.price.toLocaleString('fr')} ${price_str}`
    // let count_str = language === 'ru' ? 'Кол-во:' : "Miqdori:"
    total_price += total_product_price
    list += `${index + 1}) ${title} - ${price} × ${element.count} = <b>${total_product_price.toLocaleString('fr')} ${price_str}</b>\n`
  });
  list += `\n\n${total_str} <b><u>${total_price.toLocaleString('fr')}</u></b> ${price_str}`

  return list
}

const actions_products = (products, language, action) => {
  let list = ''
  let array = []

  products.forEach((element, index) => {
    let title = language === 'ru' ? element.product.title : element.product.title_uz
    let text = language === 'ru' ? `Название: <b>${title}</b>` : `Nomi: <b>${title}</b>`
    let callback = action === 'change count' ? JSON.stringify({change: element._id}) : JSON.stringify({delete: element._id})
    let callback_text = action === 'change count' ? title : `${title} ❌`
    let obj = {text: callback_text, callback_data: callback}
    array.push(obj)
    list += `${index + 1}) ${text} × <b>${element.count}</b>\n`
  })
  return {list, array}
}

const product_count_info = (product, language) => {
  let title = language === 'ru' ? product.product.title : product.product.title_uz
  let text = language === 'ru' 
    ? `Изменение количества\n\nНазвание: <b>${title}</b> | Текущее кол-во: <b>${product.count}</b>` 
    : `Miqdor o'zgarishi\n\nNomi: <b>${title}</b> Hozirgi miqdor: <b>${product.count}</b>`
  
  return text
}

function get_random_int() {
  return Math.floor(Math.random() * 100000)
}



module.exports = {
  pagination_menu,
  translation_assistant,
  card,
  cart_products,
  actions_products,
  product_count_info,
  get_random_int
}