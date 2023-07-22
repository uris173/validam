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


module.exports = {
  translation_assistant,
  card
}