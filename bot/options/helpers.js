const { menu_kb_ru, menu_kb_uz } = require('../options/keyboards')
const { ru, uz } = require('../options/transates')

const translation_assistant = (lang) => {
  const kb = lang === 'ru' ? menu_kb_ru : menu_kb_uz
  const translate = lang === 'ru' ? ru : uz
  return { kb, translate }
}

const card = (product, language) => {
  let img = 'https://images4.alphacoders.com/655/655929.png' // product.image[0].url

  let title = language === 'ru' ? product.title : product.title_uz
  let weight_type = language === 'ru' ? product.weight_type : product.weight_type === 'гр' ? 'gr' : 'kg'
  let weight = `${product.weight} ${weight_type}.`

  let price_str = language === 'ru' ? 'сум' : "so'm"
  let price = `<u>${product.price.toLocaleString('fr')}</u> ${price_str}`
  let description = language === 'ru' ? product.description : product.description_uz

  let info = `<b>Название еды: </b>${title}\n<b>Вес:</b> ${weight}\n\n<b>Описание:</b>\n<i>${description}</i>\n\n<b>Цена:</b> ${price}`

  return {img, info}
}


module.exports = {
  translation_assistant,
  card
}