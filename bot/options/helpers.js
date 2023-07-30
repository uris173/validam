const { menu_kb_ru, menu_kb_uz } = require('../options/keyboards')
const { ru, uz } = require('../options/transates')

const translation_assistant = (lang) => {
  const kb = lang === 'ru' ? menu_kb_ru : menu_kb_uz
  const translate = lang === 'ru' ? ru : uz
  return { kb, translate }
}

const card = (product, language) => {
  let img = 'https://images4.alphacoders.com/655/655929.png' // product.image[0].url

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
    let text = language === 'ru' ? `Название: ${title}` : `Nomi: ${title}`
    let callback = action === 'change count' ? JSON.stringify({change: element._id}) : JSON.stringify({delete: element._id})
    let obj = {text: title, callback_data: callback}
    array.push(obj)
    list += `${index + 1}) ${text} × ${element.count}\n`
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


module.exports = {
  translation_assistant,
  card,
  cart_products,
  actions_products,
  product_count_info
}